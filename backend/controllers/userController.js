/* ===================================================
   User Controller (userController.js)
   Handles User Registration & Login Authentication
   =================================================== */

const db = require('../db');
const bcrypt = require('bcrypt');

// 1. Register User Endpoint (POST /users)
const registerUser = async (req, res) => {
  try {
    const { full_name, email, password, role } = req.body;

    // Validation
    if (!full_name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'All fields (full_name, email, password, role) are required.',
      });
    }

    // Check if user already exists
    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email.trim().toLowerCase()]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email address is already registered.',
      });
    }

    // Hash password with bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user into PostgreSQL users table using parameterized query
    const insertQuery = `
      INSERT INTO users (full_name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, full_name, email, role, created_at
    `;
    const result = await db.query(insertQuery, [
      full_name.trim(),
      email.trim().toLowerCase(),
      hashedPassword,
      role.trim().toLowerCase(),
    ]);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      user: result.rows[0],
    });
  } catch (err) {
    console.error('Error in registerUser:', err);
    return res.status(500).json({
      success: false,
      message: 'Database Error',
      error: err.message,
    });
  }
};

// 2. Login User Endpoint (POST /login)
const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate inputs
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanRole = role.trim().toLowerCase();

    // Query database for matching user by email and role using parameterized query
    const query = `
      SELECT * FROM users
      WHERE LOWER(email) = $1 AND LOWER(role) = $2
    `;
    const result = await db.query(query, [cleanEmail, cleanRole]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const user = result.rows[0];

    // Check password (supports both bcrypt hashed passwords and legacy/seed plain-text)
    let isMatch = false;
    if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      // Fallback for plain-text seed user password comparison
      isMatch = user.password === password;
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Return success response and logged-in user data (excluding password)
    return res.json({
      success: true,
      message: 'Login Successful',
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      },
    });
  } catch (err) {
    console.error('Error in loginUser:', err);
    return res.status(500).json({
      success: false,
      message: 'Database Error',
      error: err.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
