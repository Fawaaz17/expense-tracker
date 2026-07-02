# Personal Expense Tracker with Authentication & Dashboard

A beginner-friendly, clean, and modern full-stack web application designed for tracking personal expenses and incomes. This project features a responsive dashboard, interactive charts, customizable filters, and secure user authentication.

This repository is optimized for learning and technical interview preparation. Every source code file contains descriptive comments explaining database connections, state hooks, REST routings, and security practices in simple English.

---

## Features

### 🔐 Secure Authentication & Session Management
*   **User Registration & Log In:** Creating user profiles with email uniqueness enforcement.
*   **Password Hashing:** Passwords are never stored as plain text; they are encrypted using salt hashes with `bcryptjs`.
*   **JSON Web Tokens (JWT):** All secure API communication uses signed JWTs in the Authorization headers. Private frontend pages are protected by React Route Guards.

### 📊 Financial Analytics Dashboard
*   **Statistical Metrics:** Dynamic calculation of Total Incomes, Total Expenses, and Net Balance.
*   **Interactive Visual Charts:**
    *   **Pie Chart:** Distribution of expenses classified by category using `Chart.js`.
    *   **Bar Chart:** Month-over-month comparison of total income vs. total expense for the last 6 months.
*   **Recent Activity Feed:** Quick look at the 5 most recent transactions with inline edit and delete actions.

### ➕ CRUD Ledger Modules (Income & Expense)
*   **Incomes & Expenses:** Create, read, update, and delete financial records.
*   **Categories:** Default selections: `Food`, `Travel`, `Shopping`, `Bills`, `Education`, `Health`, `Entertainment`, and `Other`.
*   **Custom Ledger Queries:**
    *   Search transactions by description.
    *   Filter by Category and Date Ranges.
    *   Sort by Amount and Transaction Date.

---

## Technology Stack

### Frontend (Client)
*   **React (Vite):** Declarative component-based UI framework.
*   **React Router:** Client-side page navigation.
*   **Axios:** HTTP client for communication with backend services.
*   **Chart.js & React-Chartjs-2:** Interactive HTML5 canvas rendering for graphics.
*   **Vanilla CSS:** Clean styling utilizing custom CSS variables, responsive flex/grid layouts, and micro-interactions.

### Backend (Server)
*   **Node.js:** Server-side JavaScript runtime engine.
*   **Express.js:** Minimal and flexible web API routing framework.
*   **Bcrypt.js:** Password encryption hashing.
*   **JSON Web Tokens (JWT):** Auth token signature and validation.

### Database
*   **MySQL:** Relational database management system (RDBMS).

---

## Folder Structure

```text
expense-tracker/
├── database/
│   └── database.sql          # MySQL Schema, indexes, and sample data
├── backend/
│   ├── config/
│   │   └── db.js             # MySQL Connection Pool configuration
│   ├── middleware/
│   │   └── authMiddleware.js # JWT validation route guard middleware
│   ├── controllers/
│   │   ├── authController.js        # Logic for signup, login, profile fetch
│   │   ├── transactionController.js # CRUD logic with search/filters/sorting
│   │   └── dashboardController.js   # Calculations for stats and charts
│   ├── routes/
│   │   ├── authRoutes.js     # Routing paths for authentication
│   │   ├── transactionRoutes.js     # Routing paths for transactions
│   │   └── dashboardRoutes.js       # Routing paths for dashboard statistics
│   ├── server.js             # Main server setup (CORS, Express, endpoints)
│   ├── .env                  # Port, Database keys (ignored in Git)
│   └── package.json          # Node dependencies and execution scripts
├── frontend/
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js        # Centered Axios client & API endpoints
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx # Guard wrapper checking JWT status
│   │   │   ├── Navbar.jsx    # Top global header & logout handler
│   │   │   ├── Sidebar.jsx   # Sidebar navigation with active links
│   │   │   └── TransactionForm.jsx # Reusable form for Adding/Editing logs
│   │   ├── pages/
│   │   │   ├── Home.jsx      # Landing portal page
│   │   │   ├── Login.jsx     # Log In form
│   │   │   ├── Register.jsx  # Sign Up form
│   │   │   ├── Dashboard.jsx # Cards, Charts, and recent records feed
│   │   │   ├── Transactions.jsx # Historical logs table with search filters
│   │   │   ├── AddTransaction.jsx # Form container to log transaction
│   │   │   ├── EditTransaction.jsx # Form container to edit transaction
│   │   │   ├── Profile.jsx   # User details profile card
│   │   │   └── NotFound.jsx  # Fallback 404 handler
│   │   ├── index.css         # Styling system & responsive layout CSS
│   │   ├── App.jsx           # React Router router mounts & page templates
│   │   └── main.jsx          # React DOM compiler bootstrap
│   ├── index.html            # Main HTML document index
│   ├── vite.config.js        # Vite config server settings
│   └── package.json          # Frontend packages & build script configurations
├── PROJECT_EXPLANATION.md    # Detail files walkthrough (for Mock Interviews)
├── INTERVIEW_GUIDE.md        # 50 Technical Q&As (for Interview Prep)
└── README.md                 # Project guide (this file)
```

---

## Installation & Setup

### Prerequisite
*   **Node.js:** Make sure Node (version 16 or later) is installed on your computer.
*   **MySQL Server:** Ensure MySQL is running on your machine (e.g. via XAMPP, WampServer, or direct installation).

### Step 1: Database Setup
1.  Open your MySQL Command Line Client or phpMyAdmin.
2.  Import the SQL schema script to construct tables and load mock rows:
    ```bash
    # Open MySQL terminal and import database.sql
    mysql -u root -p < database/database.sql
    ```
    *(Alternatively, create a database named `expense_tracker` and copy-paste the SQL queries inside the `database/database.sql` file into your SQL window).*

### Step 2: Backend Configuration & Start
1.  Open your terminal and navigate to the `backend/` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables:
    *   Create a `.env` file (if not automatically created) based on the following template:
    ```env
    PORT=5000
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=
    DB_NAME=expense_tracker
    JWT_SECRET=my_super_secret_key_123456
    ```
    *   *Make sure your `DB_PASSWORD` matches your MySQL root account password.*
4.  Launch the Express server:
    ```bash
    npm start
    ```
    The console will print: `Database connected successfully to MySQL` and `Expense Tracker backend running on port: 5000`.

### Step 3: Frontend Installation & Start
1.  Open a second terminal window and navigate to the `frontend/` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Launch the React Vite server:
    ```bash
    npm run dev
    ```
    Open your browser and navigate to `http://localhost:3000`.

---

## API Endpoints List

### Authentication (Public)
*   `POST /api/auth/register` : User Registration. Expects JSON body: `{ name, email, password }`.
*   `POST /api/auth/login` : User Authentication. Expects JSON body: `{ email, password }`. Returns signed JWT.

### User Profile (Protected)
*   `GET /api/auth/profile` : Fetch logged-in user credentials. Expects JWT Bearer token in request header.

### Transactions CRUD (Protected - Expects JWT)
*   `GET /api/transactions` : Retrieve transactions history list. Supports query parameters:
    *   `search` (string) : matches description
    *   `category` (string) : filters category
    *   `startDate` / `endDate` (YYYY-MM-DD) : filters dates
    *   `sortBy` (`date`, `amount`, `created_at`) : sorting criteria
    *   `sortOrder` (`ASC`, `DESC`) : sort direction
*   `POST /api/transactions` : Save a new transaction. Expects JSON body: `{ type, amount, category, description, date }`.
*   `PUT /api/transactions/:id` : Update transaction record by ID.
*   `DELETE /api/transactions/:id` : Remove transaction record by ID.

### Dashboard Stats (Protected - Expects JWT)
*   `GET /api/dashboard` : Fetch aggregated balances, category distribution totals, and 6-month transaction trends.

---

## Screenshots Placeholder

*You can save and replace mock dashboard screenshots here to visually showcase the interface in your engineering portfolios.*

---

## Future Improvements

1.  **Pagination:** Implement SQL pagination (`LIMIT` and `OFFSET`) on the transactions history table to support loading large ledgers.
2.  **Interactive Budget Limits:** Add budget category thresholds (e.g. warn users when bills exceed a monthly target).
3.  **Password Management:** Provide password reset features using email verifications.
4.  **Multi-currency Support:** Allow users to choose international currencies.
