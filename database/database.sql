-- ============================================================================
-- PERSONAL EXPENSE TRACKER - DATABASE SCHEMA
-- ============================================================================
-- This SQL script creates the database structure for our expense tracker.
-- It defines two tables: 'users' and 'transactions', establishes a foreign
-- key relationship between them, and creates indexes for query optimization.
--
-- How to import this file into MySQL:
-- Command Line: mysql -u username -p < database.sql
-- phpMyAdmin: Use the "Import" tab and select this file.
-- ============================================================================

-- 1. Create the Database (Optional / For reference)
-- Uncomment these lines if you want to create the database from scratch.
CREATE DATABASE IF NOT EXISTS expense_tracker;
USE expense_tracker;

-- 2. Drop existing tables if they exist (Order matters due to Foreign Keys!)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS expenses;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- TABLE: users
-- ============================================================================
-- Stores registration and login information for each user.
-- Passwords will be stored as Bcrypt hashes (not plain text) for security.
-- ============================================================================
CREATE TABLE users (
    -- Unique identifier for each user. AUTO_INCREMENT automatically generates
    -- a sequential integer (1, 2, 3...) when a new user is registered.
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- The user's full name. VARCHAR(100) allows variable character strings up to 100 characters.
    name VARCHAR(100) NOT NULL,
    
    -- Unique email address used for login.
    -- UNIQUE constraint ensures no two users can register with the same email.
    email VARCHAR(191) UNIQUE NOT NULL,
    
    -- The hashed password. Hashed passwords from Bcrypt are typically 60 characters,
    -- but VARCHAR(255) gives us flexibility for future algorithms.
    password VARCHAR(255) NOT NULL,
    
    -- Timestamp when the user account was created.
    -- Defaults to the current system date and time.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE: transactions
-- ============================================================================
-- Stores both income and expense records for users.
-- Each transaction is linked to a specific user via the user_id foreign key.
-- ============================================================================
CREATE TABLE transactions (
    -- Unique identifier for each transaction.
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Links this transaction to a user. Must match the data type of users.id (INT).
    user_id INT NOT NULL,
    
    -- Specifies whether this is an 'income' or an 'expense'.
    -- ENUM limits the value to these two specific choices.
    type ENUM('income', 'expense') NOT NULL,
    
    -- The money amount. DECIMAL(10, 2) stores numbers with up to 10 digits total,
    -- with exactly 2 digits after the decimal point (e.g. 99999999.99).
    -- This is highly recommended for financial data to prevent float rounding errors.
    amount DECIMAL(10, 2) NOT NULL,
    
    -- The category of the transaction (e.g. 'Food', 'Travel', 'Shopping', etc.).
    -- Stored as text in the database.
    category VARCHAR(50) NOT NULL,
    
    -- A brief note or description detailing the transaction.
    description VARCHAR(255) NOT NULL,
    
    -- The date the transaction occurred (selected by the user, e.g., '2026-07-02').
    date DATE NOT NULL,
    
    -- System timestamp when the transaction was inserted into the database.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- FOREIGN KEY CONSTRAINT
    -- Links user_id here to the id column of the users table.
    -- ON DELETE CASCADE: If a user is deleted, all of their transactions are
    -- automatically deleted from the database to maintain referential integrity.
    CONSTRAINT fk_transaction_user
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ============================================================================
-- Indexes are created on columns that are frequently used in WHERE, JOIN, or ORDER BY clauses.
-- They speed up data retrieval similar to an index at the back of a textbook.
-- ============================================================================

-- Speed up looking up transactions for a specific user.
CREATE INDEX idx_transactions_user ON transactions(user_id);

-- Speed up filtering transactions by date range for a specific user.
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date);

-- Speed up filtering transactions by category.
CREATE INDEX idx_transactions_user_category ON transactions(user_id, category);


-- ============================================================================
-- SAMPLE DATA (For Testing)
-- ============================================================================
-- Inserting demo users and sample income/expense records.
-- Note: The password hash below corresponds to 'password123' hashed with bcrypt.
-- ============================================================================

-- Insert a test user
INSERT INTO users (id, name, email, password, created_at) VALUES 
(1, 'John Doe', 'john@example.com', '$2a$10$tZ2o75D5Qh6aXU4UoYspL.gG8p.5P6D2R67bLzI/T/D/F5z567w/q', NOW());

-- Insert sample transactions for John Doe (user_id = 1)
-- Categories: Food, Travel, Shopping, Bills, Education, Health, Entertainment, Other
INSERT INTO transactions (user_id, type, amount, category, description, date) VALUES
(1, 'income', 5000.00, 'Other', 'Monthly Salary', '2026-06-01'),
(1, 'expense', 1500.00, 'Bills', 'Apartment Rent', '2026-06-02'),
(1, 'expense', 120.50, 'Food', 'Weekly Groceries at Walmart', '2026-06-05'),
(1, 'expense', 45.00, 'Travel', 'Gas for Car', '2026-06-08'),
(1, 'expense', 200.00, 'Shopping', 'New Running Shoes', '2026-06-10'),
(1, 'expense', 350.00, 'Education', 'Web Development Course Textbooks', '2026-06-12'),
(1, 'income', 450.00, 'Other', 'Freelance Web Design Project', '2026-06-15'),
(1, 'expense', 80.00, 'Entertainment', 'Movie Night and Dinner with Friends', '2026-06-18'),
(1, 'expense', 95.00, 'Health', 'Monthly Dental Checkup', '2026-06-20'),
(1, 'expense', 60.00, 'Food', 'Dinner at Olive Garden', '2026-06-25'),
(1, 'expense', 85.00, 'Bills', 'Electricity Bill', '2026-06-28'),
(1, 'income', 150.00, 'Other', 'Sold Old Bicycle', '2026-06-30');
