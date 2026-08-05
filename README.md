# 🌿 EcoConnect – Food Waste Management System

A full-stack web application designed to bridge the gap between food donors (restaurants, hotels, events) and non-governmental organizations (NGOs) / welfare shelters to effectively reduce food wastage and eliminate hunger.

---

## 📌 Project Overview

Every day, millions of meals are lost or wasted while millions of people suffer from food insecurity. **EcoConnect** provides a seamless, real-time platform where food donors can log surplus food, specify pickup timelines, upload images, and coordinate with verified NGOs and volunteers to facilitate swift food distribution.

---

## ✨ Key Features

- **Donor Food Posting Portal**: Effortlessly log surplus food details including quantity, food condition (Fresh, Hot, Frozen), pickup timings, contact info, and image uploads.
- **Role-Based Access**: Dedicated workflows for Restaurants, NGOs, Volunteers, and Admins.
- **Image Upload Integration**: Secure image handling via Multer for food quality verification.
- **Real-Time Data Visualizations**: Analytics module featuring bar charts, pie charts, histograms, scatter plots, and trend lines powered by Python Matplotlib datasets.
- **Robust Database Layer**: Dual database support for **MySQL** and **PostgreSQL** with parameter sanitization against SQL injection.
- **Security & Privacy**: Hashed passwords using bcrypt, environment variable isolation (`.env`), and clean git history without sensitive credentials.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+), Bootstrap 5 (Analytics UI)
- **Backend**: Node.js, Express.js
- **Database**: MySQL (`mysql2`) / PostgreSQL (`pg`)
- **File Uploads**: Multer
- **Version Control**: Git & GitHub

---

## 📁 Folder Structure

```
ecoconnect/
│
├── backend/
│   ├── controllers/
│   │   ├── donationController.js   # Handles Food Donation CRUD operations
│   │   ├── registerController.js   # Handles user registration logic
│   │   └── userController.js       # Handles user authentication & login
│   ├── middleware/
│   │   └── upload.js               # Multer image upload configuration
│   ├── routes/
│   │   ├── donationRoutes.js       # Express router for /donations endpoints
│   │   ├── registerRoutes.js       # Express router for /register endpoints
│   │   └── userRoutes.js           # Express router for /users and /login
│   ├── uploads/
│   │   └── .gitkeep                # Directory for user-uploaded runtime images
│   ├── .env.example                # Backend environment variable template
│   ├── db.js                       # Database connection module (MySQL/PostgreSQL)
│   ├── package.json                # Node.js dependencies & script entrypoints
│   ├── schema.sql                  # Production SQL schema setup & seed script
│   └── server.js                   # Express server entry point
│
├── images/
│   ├── graphs/                     # Data visualization charts
│   │   ├── bar_chart.png
│   │   ├── histogram.png
│   │   ├── line_chart.png
│   │   ├── pie_chart.png
│   │   └── scatter_plot.png
│   └── logo.png                    # EcoConnect permanent brand logo
│
├── .env.example                    # Root environment variable template
├── .gitignore                      # Git exclusion rules
├── analytics.css                   # Styles for analytics page
├── analytics.html                  # Food waste data analytics dashboard
├── analytics.js                    # Analytics interactivity & lightbox
├── donation.html                   # Food donation entry form
├── index.html                      # Landing page & system introduction
├── login.html                      # User authentication login page
├── register.html                   # User registration page
├── script.js                       # Client-side form validation & API integration
├── style.css                       # Global design system & theme stylesheet
├── thankyou.html                   # Post-donation submission confirmation
└── README.md                       # Complete project documentation
```

---

## ⚙️ Installation & Prerequisites

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.0.0 or higher)
- [MySQL Server](https://dev.mysql.com/downloads/installer/) (v8.0+) OR [PostgreSQL](https://www.postgresql.org/download/) (v12+)
- Git installed on your local machine

---

## 🗄️ Database Setup

1. Open your database CLI (MySQL Server / PostgreSQL Workbench / `mysql` shell).
2. Create the database:
   ```sql
   CREATE DATABASE ecoconnect;
   USE ecoconnect;
   ```
3. Import the database schema and seed data located in `backend/schema.sql`:
   ```bash
   mysql -u root -p ecoconnect < backend/schema.sql
   ```
   *(For PostgreSQL users: `psql -U postgres -d ecoconnect -f backend/schema.sql`)*

---

## 🔑 Environment Variables Setup

1. In the `backend/` directory, copy `.env.example` to create `.env`:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Update `.env` with your local database credentials:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=ecoconnect
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   ```

---

## 🚀 How to Run the Project

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/ecoconnect.git
   cd ecoconnect
   ```

2. **Install backend dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Start the Express backend server**:
   ```bash
   npm start
   ```
   *For development with auto-reloading:*
   ```bash
   npm run dev
   ```

4. **Access the application**:
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 📸 Screenshots

*(Add screenshots of your application UI here)*

- **Home Page**: System mission, impact statistics, and service offerings.
- **Donation Form**: Comprehensive multi-field form with live image preview and validation.
- **Analytics Dashboard**: Interactive Matplotlib food waste data visualizations with lightbox zoom.

---

## 🔮 Future Improvements

- [ ] Automated SMS/Email notifications to nearby NGOs upon new food donation postings.
- [ ] Google Maps API integration for real-time pickup route tracking.
- [ ] AI-driven surplus food shelf-life prediction based on ambient temperature and food category.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
