/* ===================================================
   Donation Controller (donationController.js)
   Handles Full CRUD operations for Food Donations
   =================================================== */

const db = require('../db');
const fs = require('fs');
const path = require('path');

// 1. CREATE DONATION (POST /donations)
const createDonation = async (req, res) => {
  try {
    const {
      user_id,
      restaurant_name, restaurantName,
      food_name, foodName,
      category,
      food_type, foodType,
      food_condition, foodCondition,
      quantity,
      unit,
      people_served, peopleServed,
      cooking_date, cookingDate,
      pickup_date, pickupDate,
      pickup_time, pickupTime,
      expiry_date, expiryDate,
      phone,
      city,
      pincode,
      address,
      description,
      instructions,
    } = req.body;

    // Resolve field names (support both snake_case and camelCase from frontend)
    const finalUserId = user_id || 1; // Default to seed user 1 if user_id is not supplied
    const finalRestaurantName = restaurant_name || restaurantName;
    const finalFoodName = food_name || foodName;
    const finalCategory = category;
    const finalFoodType = food_type || foodType;
    const finalFoodCondition = food_condition || foodCondition;
    const finalQuantity = parseFloat(quantity);
    const finalUnit = unit;
    const finalPeopleServed = parseInt(people_served || peopleServed, 10);
    const finalCookingDate = cooking_date || cookingDate;
    const finalPickupDate = pickup_date || pickupDate;
    const finalPickupTime = pickup_time || pickupTime;
    const finalExpiryDate = expiry_date || expiryDate;
    const finalPhone = phone;
    const finalCity = city;
    const finalPincode = pincode;
    const finalAddress = address;
    const finalDescription = description;
    const finalInstructions = instructions || '';
    const finalImage = req.file ? req.file.filename : null;

    // Basic Validation
    if (
      !finalRestaurantName ||
      !finalFoodName ||
      !finalCategory ||
      !finalFoodType ||
      !finalFoodCondition ||
      !finalQuantity ||
      !finalUnit ||
      !finalPeopleServed ||
      !finalCookingDate ||
      !finalPickupDate ||
      !finalPickupTime ||
      !finalExpiryDate ||
      !finalPhone ||
      !finalCity ||
      !finalPincode ||
      !finalAddress ||
      !finalDescription
    ) {
      return res.status(400).json({
        success: false,
        message: 'All required donation fields must be provided.',
      });
    }

    // Parameterized INSERT Query
    const insertQuery = `
      INSERT INTO donations (
        user_id, restaurant_name, food_name, category, food_type, food_condition,
        quantity, unit, people_served, cooking_date, pickup_date, pickup_time,
        expiry_date, phone, city, pincode, address, description, instructions, image
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
      )
      RETURNING *
    `;

    const values = [
      finalUserId,
      finalRestaurantName,
      finalFoodName,
      finalCategory,
      finalFoodType,
      finalFoodCondition,
      finalQuantity,
      finalUnit,
      finalPeopleServed,
      finalCookingDate,
      finalPickupDate,
      finalPickupTime,
      finalExpiryDate,
      finalPhone,
      finalCity,
      finalPincode,
      finalAddress,
      finalDescription,
      finalInstructions,
      finalImage,
    ];

    const result = await db.query(insertQuery, values);

    return res.status(201).json({
      success: true,
      message: 'Donation Saved',
      donation: result.rows[0],
    });
  } catch (err) {
    console.error('Error in createDonation:', err);
    return res.status(500).json({
      success: false,
      message: 'Database Error',
      error: err.message,
    });
  }
};

// 2. GET ALL DONATIONS (GET /donations)
const getAllDonations = async (req, res) => {
  try {
    const query = `
      SELECT d.*, u.full_name AS donor_name, u.email AS donor_email 
      FROM donations d
      LEFT JOIN users u ON d.user_id = u.id
      ORDER BY d.created_at DESC
    `;
    const result = await db.query(query);

    return res.json({
      success: true,
      count: result.rows.length,
      donations: result.rows,
    });
  } catch (err) {
    console.error('Error in getAllDonations:', err);
    return res.status(500).json({
      success: false,
      message: 'Database Error',
      error: err.message,
    });
  }
};

// 3. GET DONATION BY ID (GET /donations/:id)
const getDonationById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT d.*, u.full_name AS donor_name, u.email AS donor_email 
      FROM donations d
      LEFT JOIN users u ON d.user_id = u.id
      WHERE d.id = $1
    `;
    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Donation record not found.',
      });
    }

    return res.json({
      success: true,
      donation: result.rows[0],
    });
  } catch (err) {
    console.error('Error in getDonationById:', err);
    return res.status(500).json({
      success: false,
      message: 'Database Error',
      error: err.message,
    });
  }
};

// 4. UPDATE DONATION (PUT /donations/:id)
const updateDonation = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if donation exists
    const checkQuery = 'SELECT * FROM donations WHERE id = $1';
    const checkResult = await db.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Donation record not found.',
      });
    }

    const current = checkResult.rows[0];

    const {
      restaurant_name, restaurantName,
      food_name, foodName,
      category,
      food_type, foodType,
      food_condition, foodCondition,
      quantity,
      unit,
      people_served, peopleServed,
      cooking_date, cookingDate,
      pickup_date, pickupDate,
      pickup_time, pickupTime,
      expiry_date, expiryDate,
      phone,
      city,
      pincode,
      address,
      description,
      instructions,
    } = req.body;

    const finalRestaurantName = restaurant_name || restaurantName || current.restaurant_name;
    const finalFoodName = food_name || foodName || current.food_name;
    const finalCategory = category || current.category;
    const finalFoodType = food_type || foodType || current.food_type;
    const finalFoodCondition = food_condition || foodCondition || current.food_condition;
    const finalQuantity = quantity ? parseFloat(quantity) : current.quantity;
    const finalUnit = unit || current.unit;
    const finalPeopleServed = (people_served || peopleServed) ? parseInt(people_served || peopleServed, 10) : current.people_served;
    const finalCookingDate = cooking_date || cookingDate || current.cooking_date;
    const finalPickupDate = pickup_date || pickupDate || current.pickup_date;
    const finalPickupTime = pickup_time || pickupTime || current.pickup_time;
    const finalExpiryDate = expiry_date || expiryDate || current.expiry_date;
    const finalPhone = phone || current.phone;
    const finalCity = city || current.city;
    const finalPincode = pincode || current.pincode;
    const finalAddress = address || current.address;
    const finalDescription = description || current.description;
    const finalInstructions = instructions !== undefined ? instructions : current.instructions;

    let finalImage = current.image;
    if (req.file) {
      finalImage = req.file.filename;
      // Remove old image if existing
      if (current.image) {
        const oldPath = path.join(__dirname, '../uploads', current.image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    }

    const updateQuery = `
      UPDATE donations
      SET 
        restaurant_name = $1,
        food_name = $2,
        category = $3,
        food_type = $4,
        food_condition = $5,
        quantity = $6,
        unit = $7,
        people_served = $8,
        cooking_date = $9,
        pickup_date = $10,
        pickup_time = $11,
        expiry_date = $12,
        phone = $13,
        city = $14,
        pincode = $15,
        address = $16,
        description = $17,
        instructions = $18,
        image = $19
      WHERE id = $20
      RETURNING *
    `;

    const values = [
      finalRestaurantName,
      finalFoodName,
      finalCategory,
      finalFoodType,
      finalFoodCondition,
      finalQuantity,
      finalUnit,
      finalPeopleServed,
      finalCookingDate,
      finalPickupDate,
      finalPickupTime,
      finalExpiryDate,
      finalPhone,
      finalCity,
      finalPincode,
      finalAddress,
      finalDescription,
      finalInstructions,
      finalImage,
      id,
    ];

    const result = await db.query(updateQuery, values);

    return res.json({
      success: true,
      message: 'Donation Updated Successfully',
      donation: result.rows[0],
    });
  } catch (err) {
    console.error('Error in updateDonation:', err);
    return res.status(500).json({
      success: false,
      message: 'Database Error',
      error: err.message,
    });
  }
};

// 5. DELETE DONATION (DELETE /donations/:id)
const deleteDonation = async (req, res) => {
  try {
    const { id } = req.params;

    const query = 'DELETE FROM donations WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Donation record not found.',
      });
    }

    const deletedRecord = result.rows[0];

    // Clean up uploaded file if exists
    if (deletedRecord.image) {
      const imgPath = path.join(__dirname, '../uploads', deletedRecord.image);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    }

    return res.json({
      success: true,
      message: 'Donation Deleted Successfully',
      donation: deletedRecord,
    });
  } catch (err) {
    console.error('Error in deleteDonation:', err);
    return res.status(500).json({
      success: false,
      message: 'Database Error',
      error: err.message,
    });
  }
};

module.exports = {
  createDonation,
  getAllDonations,
  getDonationById,
  updateDonation,
  deleteDonation,
};
