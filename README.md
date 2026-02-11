# 💰 Trackify - Smart Expense Tracker

A modern, full-stack expense tracking application with advanced features like savings goals, budget management, and insightful analytics.

![Trackify](https://img.shields.io/badge/Version-1.0.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-6+-brightgreen)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### 📊 **Expense Tracking**
- Add, edit, and delete expenses
- Categorize expenses (Food, Transport, Shopping, etc.)
- Date-based filtering
- Notes and descriptions

### 🎯 **Savings Goals** (Unique Feature!)
- Create multiple savings goals
- Visual progress tracking with progress bars
- Category-based goals (Emergency Fund, Vacation, Education, etc.)
- Quick contributions
- Deadline tracking with countdown
- Auto-completion celebration

### 💰 **Budget Management**
- Set monthly budgets
- Real-time budget tracking
- Alerts when approaching/exceeding budget
- Budget vs actual spending comparison

### 📈 **Analytics & Insights**
- Today's expenses tracking
- Monthly spending overview
- Overall lifetime total
- Average daily spending
- Spending by category (pie chart)
- Monthly trend analysis (line chart)
- Category breakdown (bar chart)

### 🎨 **Modern UI/UX**
- Clean, minimal design
- Light/Dark mode toggle
- Responsive layout (mobile-friendly)
- Smooth animations
- Color-coded statistics
- Interactive charts (Chart.js)

## 🚀 Tech Stack

### **Backend**
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### **Frontend**
- **Vanilla JavaScript** - No framework overhead
- **HTML5** - Semantic markup
- **CSS3** - Modern styling
- **Chart.js** - Data visualization

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Git

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/manojmanoharan2005-dot/expense-tracker.git
cd expense-tracker
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/trackify
# Or use MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/trackify

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server Port
PORT=3000
```

4. **Start MongoDB** (if using local)
```bash
mongod
```

5. **Run the application**

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

6. **Open in browser**
```
http://localhost:3000
```

## 📁 Project Structure

```
trackify/
├── client/                 # Frontend files
│   ├── css/
│   │   └── style.css      # All styles
│   ├── js/
│   │   ├── main.js        # Utilities & helpers
│   │   ├── auth.js        # Authentication logic
│   │   ├── dashboard.js   # Dashboard functionality
│   │   └── goals.js       # Goals feature
│   ├── login.html         # Login page
│   ├── signup.html        # Signup page
│   └── dashboard.html     # Main dashboard
├── server/                # Backend files
│   ├── config/
│   │   └── db.js          # Database connection
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT authentication
│   ├── models/
│   │   ├── User.js        # User model
│   │   ├── Expense.js     # Expense model
│   │   └── Goal.js        # Goal model
│   ├── routes/
│   │   ├── authRoutes.js  # Auth endpoints
│   │   ├── expenseRoutes.js  # Expense endpoints
│   │   └── goalRoutes.js  # Goal endpoints
│   └── server.js          # Express server
├── .env                   # Environment variables
├── .gitignore            # Git ignore file
├── package.json          # Dependencies
└── README.md             # This file
```

## 🔐 API Endpoints

### **Authentication**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### **Expenses**
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `PUT /api/expenses/budget/update` - Update budget

### **Goals**
- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal
- `PUT /api/goals/:id/contribute` - Add money to goal

## 🎯 Usage

### **1. Sign Up**
- Navigate to `/signup`
- Enter name, email, and password
- Click "Create Account"

### **2. Login**
- Navigate to `/login`
- Enter credentials
- Access dashboard

### **3. Add Expense**
- Click "+ Add Expense"
- Fill in details (title, amount, category, date)
- Save expense

### **4. Create Savings Goal**
- Go to "Goals" section
- Click "+ Add Goal"
- Set name, target amount, deadline
- Track progress visually

### **5. Set Budget**
- Go to "Budget" section
- Enter monthly budget amount
- Monitor spending vs budget

## 📊 Dashboard Overview

The dashboard displays:
- **Today's Expenses** - Current day spending
- **This Month** - Monthly total with trend
- **Overall Total** - All-time expenses
- **Monthly Budget** - Budget tracking
- **Average Daily** - Daily spending average
- **Transactions** - Transaction count

## 🔮 Future Features

- [ ] Recurring expenses tracker
- [ ] Category budget limits
- [ ] Spending heatmap calendar
- [ ] Export reports (CSV/PDF)
- [ ] Split expenses with friends
- [ ] Custom expense tags
- [ ] Bill reminders
- [ ] Email notifications
- [ ] Mobile app (React Native)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Manoj Kumar**
- GitHub: [@manojmanoharan2005-dot](https://github.com/manojmanoharan2005-dot)

## 🙏 Acknowledgments

- Chart.js for beautiful charts
- MongoDB for database
- Express.js for backend framework
- All contributors and users

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Made with ❤️ by Manoj Kumar**

⭐ Star this repo if you find it helpful!
