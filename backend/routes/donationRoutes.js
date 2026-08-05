/* ===================================================
   Donation Routes (donationRoutes.js)
   Express Router for Food Donation CRUD operations
   =================================================== */

const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const upload = require('../middleware/upload');

// POST /donations - Create Donation (with image upload)
router.post('/donations', upload.single('foodImage'), donationController.createDonation);

// GET /donations - Get All Donations
router.get('/donations', donationController.getAllDonations);

// GET /donations/:id - Get Donation By ID
router.get('/donations/:id', donationController.getDonationById);

// PUT /donations/:id - Update Donation By ID (with optional new image)
router.put('/donations/:id', upload.single('foodImage'), donationController.updateDonation);

// DELETE /donations/:id - Delete Donation By ID
router.delete('/donations/:id', donationController.deleteDonation);

module.exports = router;
