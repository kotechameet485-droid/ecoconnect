/* ===================================================
   EcoConnect Server (server.js)
   Express Server Entrypoint for Full Stack Web App
   =================================================== */

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const db = require('./db');
const registerRoutes = require('./routes/registerRoutes');
const userRoutes = require('./routes/userRoutes');
const donationRoutes = require('./routes/donationRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and Request Parsing Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploaded Food Images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve Frontend Static Files (index.html, login.html, donation.html, thankyou.html, script.js, images/)
app.use(express.static(path.join(__dirname, '../')));

// Register Routes (Supports direct root endpoints and /api prefixed endpoints)
app.use('/', registerRoutes);
app.use('/', userRoutes);
app.use('/', donationRoutes);

app.use('/api', registerRoutes);
app.use('/api', userRoutes);
app.use('/api', donationRoutes);

// Database & Server Health Check Endpoint
app.get('/health', async (req, res) => {
  try {
    const dbTest = await db.query('SELECT NOW()');
    res.json({
      success: true,
      message: 'EcoConnect Server & Database are running healthy.',
      db_time: dbTest.rows[0].now,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Database Connection Error',
      error: err.message,
    });
  }
});

// Start Express Server
app.listen(PORT, () => {
  console.log('======================================================');
  console.log(`🚀 EcoConnect Server running on http://localhost:${PORT}`);
  console.log(`🌐 Frontend live at http://localhost:${PORT}`);
  console.log('======================================================');
});
