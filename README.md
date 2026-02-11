# 💰 Trackify - Smart Expense & Budget Tracker

A complete full-stack web application for tracking expenses and managing budgets with beautiful UI, charts, and analytics.

## 🚀 Features

### Authentication
- ✅ User signup with password hashing (bcrypt)
- ✅ User login with JWT token
- ✅ Protected routes
- ✅ Logout functionality

### Expense Management
- ✅ Add new expenses
- ✅ Edit existing expenses
- ✅ Delete expenses
- ✅ Category-based organization (Food, Transport, Shopping, etc.)
- ✅ Filter by category and date
- ✅ Add notes to expenses

### Budget Management
- ✅ Set monthly budget
- ✅ View remaining budget
- ✅ Budget alerts (80% and 100% warnings)
- ✅ Visual budget progress bar

### Dashboard & Analytics
- ✅ Total spent this month
- ✅ Category breakdown (Pie chart)
- ✅ Monthly spending trend (Line chart)
- ✅ Recent transactions list
- ✅ Compare with previous month
- ✅ Average daily spending
- ✅ Top spending category

### UI/UX
- ✅ Modern dark mode design
- ✅ Light mode toggle
- ✅ Responsive layout
- ✅ Smooth animations
- ✅ Glassmorphism effects
- ✅ Beautiful charts (Chart.js)

## 🛠️ Tech Stack

**Frontend:**
- HTML5
- CSS3 (Vanilla CSS with modern design)
- JavaScript (ES6+)
- Chart.js for data visualization

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v14 or higher)
- MongoDB installed locally OR MongoDB Atlas account
- npm or yarn package manager

## 🔧 Installation & Setup

### 1. Clone or Navigate to Project Directory

```bash
cd d:\expsensetracker\trackify
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages:
- express
- mongoose
- bcryptjs
- jsonwebtoken
- dotenv
- cors
- nodemon (dev dependency)

### 3. Configure Environment Variables

The `.env` file is already created. Update it with your settings:

```env
# MongoDB Connection String
MONGO_URI=mongodb://localhost:27017/trackify
# OR use MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/trackify?retryWrites=true&w=majority

# JWT Secret Key (Change this to a random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server Port
PORT=5000
```

**Important:** Change the `JWT_SECRET` to a secure random string in production!

### 4. Setup MongoDB

**Option A: Local MongoDB**
- Make sure MongoDB is installed and running on your system
- The default connection string `mongodb://localhost:27017/trackify` will work

**Option B: MongoDB Atlas (Cloud)**
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Replace `MONGO_URI` in `.env` with your Atlas connection string

### 5. Start the Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

### 6. Access the Application

Open your browser and navigate to:
```
http://localhost:5000
```

## 📱 Usage Guide

### First Time Setup

1. **Sign Up**
   - Click "Sign Up" button
   - Enter your name, email, and password (min 6 characters)
   - You'll be automatically logged in

2. **Set Your Budget**
   - Go to "Budget" section in the sidebar
   - Enter your monthly budget amount
   - Click "Update Budget"

3. **Add Expenses**
   - Click "+ Add Expense" button
   - Fill in the details:
     - Title (e.g., "Grocery Shopping")
     - Amount (in ₹)
     - Category
     - Date
     - Notes (optional)
   - Click "Save Expense"

4. **View Analytics**
   - Dashboard shows your spending overview
   - View charts for category breakdown
   - See monthly trends
   - Compare with previous month

### Features Walkthrough

**Dashboard Overview:**
- Total spent this month
- Monthly budget status
- Average daily spending
- Total transactions count
- Category pie chart
- Monthly trend line chart
- Recent 5 transactions

**Expenses Page:**
- View all expenses in a table
- Filter by category
- Filter by month
- Edit or delete any expense

**Budget Page:**
- Set/update monthly budget
- View budget overview
- See spending progress bar
- Get alerts when approaching limit

**Analytics Page:**
- Detailed spending analysis
- Month-over-month comparison
- Top spending category
- Category breakdown chart

## 🎨 UI Features

- **Dark Mode:** Default beautiful dark theme
- **Light Mode:** Toggle to light mode anytime
- **Responsive:** Works on desktop, tablet, and mobile
- **Animations:** Smooth transitions and hover effects
- **Modern Design:** Glassmorphism, gradients, and shadows

## 🔒 Security Features

- Passwords are hashed using bcrypt
- JWT tokens for secure authentication
- Protected API routes
- Input validation on both frontend and backend
- Environment variables for sensitive data

## 📊 API Endpoints

### Authentication Routes
```
POST /api/auth/signup    - Register new user
POST /api/auth/login     - Login user
```

### Expense Routes (Protected)
```
GET    /api/expenses           - Get all user expenses
POST   /api/expenses           - Create new expense
PUT    /api/expenses/:id       - Update expense
DELETE /api/expenses/:id       - Delete expense
PUT    /api/expenses/budget/update - Update monthly budget
```

## 🗂️ Project Structure

```
trackify/
│
├── client/                    # Frontend files
│   ├── index.html            # Landing page
│   ├── login.html            # Login page
│   ├── signup.html           # Signup page
│   ├── dashboard.html        # Main dashboard
│   ├── css/
│   │   └── style.css         # All styles
│   └── js/
│       ├── main.js           # Utility functions
│       ├── auth.js           # Authentication logic
│       └── dashboard.js      # Dashboard functionality
│
├── server/                    # Backend files
│   ├── server.js             # Main server file
│   ├── config/
│   │   └── db.js             # Database connection
│   ├── models/
│   │   ├── User.js           # User model
│   │   └── Expense.js        # Expense model
│   ├── routes/
│   │   ├── authRoutes.js     # Auth endpoints
│   │   └── expenseRoutes.js  # Expense endpoints
│   └── middleware/
│       └── authMiddleware.js # JWT verification
│
├── package.json              # Dependencies
└── .env                      # Environment variables
```

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Make sure MongoDB is running
- Check your connection string in `.env`
- For Atlas, ensure your IP is whitelisted

**Port Already in Use:**
- Change the `PORT` in `.env` file
- Or stop the process using port 5000

**JWT Token Errors:**
- Clear browser localStorage
- Log out and log in again

**Charts Not Showing:**
- Make sure Chart.js CDN is loading
- Check browser console for errors

## 🚀 Deployment

### Backend Deployment (Render/Heroku)
1. Push code to GitHub
2. Connect to Render/Heroku
3. Set environment variables
4. Deploy

### Frontend
- The frontend is served by the Express server
- No separate deployment needed

## 📝 License

This project is open source and available for educational purposes.

## 👨‍💻 Author

Built with ❤️ as a full-stack expense tracker demonstration.

## 🙏 Acknowledgments

- Chart.js for beautiful charts
- Google Fonts (Inter) for typography
- MongoDB for database
- Express.js for backend framework

---

**Happy Expense Tracking! 💰📊**
