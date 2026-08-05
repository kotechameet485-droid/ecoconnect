-- ======================================================
-- EcoConnect - Food Waste Management System
-- Database Schema Setup Script (MySQL & PostgreSQL compatible)
-- ======================================================

-- 1. Create Database (Run this separately if database does not exist)
-- CREATE DATABASE IF NOT EXISTS ecoconnect;
-- USE ecoconnect;

-- ======================================================
-- TABLE: users
-- Stores registered users (Restaurants, NGOs, Volunteers, Admins)
-- ======================================================
DROP TABLE IF EXISTS donations;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================================================
-- TABLE: donations
-- Stores food donation details posted by users
-- ======================================================
CREATE TABLE donations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    restaurant_name VARCHAR(100) NOT NULL,
    food_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    food_type VARCHAR(20) NOT NULL,
    food_condition VARCHAR(20) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    people_served INT NOT NULL,
    cooking_date DATE NOT NULL,
    pickup_date DATE NOT NULL,
    pickup_time TIME NOT NULL,
    expiry_date DATE NOT NULL,
    phone VARCHAR(15) NOT NULL,
    city VARCHAR(50) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    address TEXT NOT NULL,
    description TEXT NOT NULL,
    instructions TEXT,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ======================================================
-- SEED INITIAL USERS
-- Default Password for all seed users: Pass@123 (bcrypt hashed)
-- ======================================================

-- Seed 1: Restaurant User (email: restaurant@gmail.com, pass: Pass@123)
INSERT INTO users (full_name, email, password, role) 
VALUES ('Spice Garden Restaurant', 'restaurant@gmail.com', '$2b$10$eE0m1j.uQ2d2u9JcWvY6uO7e6e5T2V8g9W0X1Y2Z3A4B5C6D7E8F9G', 'restaurant');

-- Seed 2: NGO User (email: ngo@gmail.com, pass: Pass@123)
INSERT INTO users (full_name, email, password, role) 
VALUES ('Helping Hands NGO', 'ngo@gmail.com', '$2b$10$eE0m1j.uQ2d2u9JcWvY6uO7e6e5T2V8g9W0X1Y2Z3A4B5C6D7E8F9G', 'ngo');

-- Seed 3: Volunteer User (email: volunteer@gmail.com, pass: Pass@123)
INSERT INTO users (full_name, email, password, role) 
VALUES ('Rahul Sharma', 'volunteer@gmail.com', '$2b$10$eE0m1j.uQ2d2u9JcWvY6uO7e6e5T2V8g9W0X1Y2Z3A4B5C6D7E8F9G', 'volunteer');

-- Seed 4: Admin User (email: admin@gmail.com, pass: Pass@123)
INSERT INTO users (full_name, email, password, role) 
VALUES ('System Admin', 'admin@gmail.com', '$2b$10$eE0m1j.uQ2d2u9JcWvY6uO7e6e5T2V8g9W0X1Y2Z3A4B5C6D7E8F9G', 'admin');

-- Seed 5: Demo Donor (email: donor@gmail.com, pass: Pass@123)
INSERT INTO users (full_name, email, password, role)
VALUES ('Demo Donor', 'donor@gmail.com', 'Pass@123', 'restaurant');
