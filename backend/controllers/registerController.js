/* ===================================================
   Register Controller (registerController.js)
   Handles User Registration Logic for POST /register
   =================================================== */

const db = require('../db');
const bcrypt = require('bcrypt');

const handleRegister = async (req, res) => {
  try {
    const { fullName, full_name, email, password, confirmPassword, role } = req.body;

    const nameToUse = fullName || full_name;

    // 1. Input Validation
    if (!nameToUse || !nameToUse.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Full Name is required.',
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required.',
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required.',
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.',
      });
    }

    if (!role || !role.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Role selection is required.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanRole = role.trim().toLowerCase();
    const cleanName = nameToUse.trim();

    // 2. Check for Duplicate Email
    const checkEmailQuery = 'SELECT * FROM users WHERE LOWER(email) = $1';
    const existingUser = await db.query(checkEmailQuery, [cleanEmail]);

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // 3. Hash Password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. Parameterized INSERT Query
    const insertQuery = `
      INSERT INTO users (full_name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, full_name, email, role, created_at
    `;

    const result = await db.query(insertQuery, [
      cleanName,
      cleanEmail,
      hashedPassword,
      cleanRole,
    ]);

    return res.status(201).json({
      success: true,
      message: 'Registration Successful',
      user: result.rows[0],
    });

  } catch (err) {
    console.error('Error in registerController:', err);
    return res.status(500).json({
      success: false,
      message: 'Database Error',
      error: err.message,
    });
  }
};

module.exports = {
  handleRegister,
};
