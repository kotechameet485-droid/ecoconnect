/* ===================================================
   User Routes (userRoutes.js)
   Express Router for User Registration & Login
   =================================================== */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// POST /users - User Registration
router.post('/users', userController.registerUser);

// POST /login - User Login
router.post('/login', userController.loginUser);

module.exports = router;
