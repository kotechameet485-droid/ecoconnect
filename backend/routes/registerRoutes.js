/* ===================================================
   Register Routes (registerRoutes.js)
   Express Router for POST /register
   =================================================== */

const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');

// POST /register - User Registration
router.post('/register', registerController.handleRegister);

module.exports = router;
