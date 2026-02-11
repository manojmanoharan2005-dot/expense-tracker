# 🚀 QUICK START GUIDE - Trackify

## Step-by-Step Instructions to Run the Project

### ✅ Prerequisites Check
- [x] Node.js installed
- [x] MongoDB installed (or MongoDB Atlas account)
- [x] Dependencies installed (`npm install` - COMPLETED)

---

## 🎯 OPTION 1: Using Local MongoDB

### 1. Start MongoDB
Open a new terminal and run:
```bash
mongod
```
Keep this terminal running.

### 2. Update .env File (if needed)
The `.env` file is already configured for local MongoDB:
```
MONGO_URI=mongodb://localhost:27017/trackify
```

### 3. Start the Server
In the project directory, run:
```bash
npm run dev
```

### 4. Open Browser
Navigate to: **http://localhost:5000**

---

## 🎯 OPTION 2: Using MongoDB Atlas (Cloud)

### 1. Create MongoDB Atlas Account
- Go to https://www.mongodb.com/cloud/atlas
- Sign up for free
- Create a new cluster (free tier)

### 2. Get Connection String
- Click "Connect" on your cluster
- Choose "Connect your application"
- Copy the connection string
- Replace `<password>` with your database user password

### 3. Update .env File
Open `.env` and replace the MONGO_URI:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/trackify?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
```

### 4. Start the Server
```bash
npm run dev
```

### 5. Open Browser
Navigate to: **http://localhost:5000**

---

## 📱 First Time Usage

### 1. Create Account
- Click "Sign Up"
- Enter your details:
  - Name: Your Name
  - Email: your@email.com
  - Password: minimum 6 characters
- Click "Create Account"

### 2. Set Monthly Budget
- After login, go to "Budget" in sidebar
- Enter your monthly budget (e.g., 50000)
- Click "Update Budget"

### 3. Add Your First Expense
- Click "+ Add Expense" button
- Fill in:
  - Title: "Grocery Shopping"
  - Amount: 2500
  - Category: Food
  - Date: Today's date
  - Notes: "Weekly groceries"
- Click "Save Expense"

### 4. Explore Features
- **Dashboard**: View overview and charts
- **Expenses**: See all expenses, filter by category/date
- **Budget**: Manage your budget
- **Analytics**: Detailed spending insights
- **Theme Toggle**: Switch between dark/light mode

---

## 🎨 Available NPM Scripts

```bash
npm start       # Start server in production mode
npm run dev     # Start server with nodemon (auto-restart)
```

---

## 🔑 Default Credentials for Testing

You can create any account you want. There are no default credentials.

**Example Test Account:**
- Name: John Doe
- Email: john@example.com
- Password: test123

---

## 🌐 API Endpoints Reference

### Authentication (Public)
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login

### Expenses (Protected - Requires JWT Token)
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Add new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `PUT /api/expenses/budget/update` - Update budget

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"
**Solution:** 
- Make sure MongoDB is running (`mongod` command)
- Check MONGO_URI in `.env` file
- For Atlas: Verify IP whitelist and credentials

### Issue: "Port 5000 already in use"
**Solution:**
- Change PORT in `.env` to 3000 or 8000
- Or stop the process using port 5000

### Issue: "JWT token invalid"
**Solution:**
- Clear browser localStorage
- Logout and login again
- Check JWT_SECRET in `.env`

### Issue: "Charts not displaying"
**Solution:**
- Check internet connection (Chart.js loads from CDN)
- Open browser console for errors
- Try refreshing the page

---

## 📊 Testing the Application

### Test Scenario 1: Basic Flow
1. Sign up with new account
2. Set budget to ₹50,000
3. Add 5 different expenses in different categories
4. View dashboard - charts should update
5. Edit an expense
6. Delete an expense
7. Filter expenses by category

### Test Scenario 2: Budget Alerts
1. Set budget to ₹10,000
2. Add expenses totaling ₹8,500 (should show 80% warning)
3. Add more expenses to exceed ₹10,000 (should show over-budget alert)

### Test Scenario 3: Multi-Month Data
1. Add expenses for current month
2. Change date filter to view different months
3. Check analytics for month-over-month comparison

---

## 🎯 Next Steps After Setup

1. **Customize**: Modify colors in `client/css/style.css`
2. **Add Features**: Extend with export to CSV, recurring expenses, etc.
3. **Deploy**: Deploy to Render, Heroku, or Vercel
4. **Secure**: Change JWT_SECRET to a strong random string

---

## 📞 Need Help?

Check the main README.md for detailed documentation.

---

**🎉 Enjoy using Trackify! Happy expense tracking!**
