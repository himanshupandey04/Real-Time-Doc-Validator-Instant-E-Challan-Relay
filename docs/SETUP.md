# 🚦 E-Challan System - Complete Setup Guide

## 📋 Prerequisites

Before setting up the E-Challan system, ensure you have the following installed:

1. **Node.js** (v14 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **MongoDB** (v4.4 or higher)
   - Download from: https://www.mongodb.com/try/download/community
   - **Important:** Make sure MongoDB is running on `mongodb://localhost:27017/`

3. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

---

## 🗄️ MongoDB Setup

### Option 1: MongoDB Community Server (Recommended)

1. **Download MongoDB Community Server**
   - Visit: https://www.mongodb.com/try/download/community
   - Select your Windows version
   - Download and install

2. **Start MongoDB Service**
   
   **Method A: Windows Service (Automatic)**
   - MongoDB usually installs as a Windows service and starts automatically
   - Check if running: Open Services (Win + R → `services.msc`)
   - Look for "MongoDB Server" and ensure it's running

   **Method B: Manual Start**
   ```powershell
   # Navigate to MongoDB bin directory (adjust path if needed)
   cd "C:\Program Files\MongoDB\Server\7.0\bin"
   
   # Start MongoDB
   .\mongod.exe --dbpath "C:\data\db"
   ```

3. **Verify MongoDB is Running**
   ```powershell
   # Open MongoDB Shell
   mongosh
   
   # You should see a connection message
   # Type 'exit' to close
   ```

### Option 2: MongoDB Atlas (Cloud - Free Tier)

If you prefer a cloud database:

1. Sign up at: https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Update `backend/.env` with your Atlas connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/echallan_system
   ```

---

## 🚀 Backend Setup

### Automated Setup (Recommended)

**Run the setup script:**
```powershell
.\setup-backend.bat
```

This will:
1. Check MongoDB connection
2. Install all dependencies
3. Seed the database with sample data

### Manual Setup

If you prefer manual setup:

1. **Navigate to backend directory**
   ```powershell
   cd backend
   ```

2. **Install dependencies**
   ```powershell
   npm install
   ```

3. **Configure environment**
   - The `.env` file is already created with default settings
   - Modify if needed (especially for production)

4. **Seed the database**
   ```powershell
   npm run seed
   ```

   This creates:
   - 1 Admin user
   - 1 Officer user
   - 2 Citizen users with vehicles
   - 2 Sample challans

---

## 🎯 Running the Application

### Start Backend Server

**Option 1: Using batch script**
```powershell
.\start-backend.bat
```

**Option 2: Manual start**
```powershell
cd backend
npm run dev
```

The backend server will start on: **http://localhost:5000**

### Start Frontend (React App)

In a **new terminal**:

```powershell
npm start
```

The frontend will start on: **http://localhost:3000**

---

## 🔐 Default Login Credentials

After seeding the database, use these credentials:

### 👨‍💼 Admin Account
- **Email:** admin@echallan.gov.in
- **Password:** Admin@123456
- **Role:** Administrator (full access)

### 👮 Traffic Officer Account
- **Email:** officer1@echallan.gov.in
- **Password:** Officer@123
- **Role:** Officer (can issue challans)

### 👤 Citizen Account 1
- **Email:** amit.kumar@example.com
- **Password:** User@123456
- **Vehicle:** DL01AB1234 (Maruti Swift)
- **Challan:** 1 pending challan (Over-speeding)

### 👤 Citizen Account 2
- **Email:** priya.sharma@example.com
- **Password:** User@123456
- **Vehicle:** MH02CD5678 (Honda Activa)
- **Challan:** 1 paid challan (Signal Jump)

---

## 📊 Database Structure

The system creates the following MongoDB collections:

### 1. **users**
- Stores user accounts (citizens, officers, admins)
- Handles authentication and authorization
- Tracks login attempts and account security

### 2. **vehicles**
- Vehicle registration information
- Owner details
- Document expiry tracking (Insurance, PUC, Registration)

### 3. **challans**
- Traffic violation records
- Fine amounts and payment status
- Officer and location details
- Auto-generated challan numbers

### 4. **notifications**
- User notifications
- Challan and payment alerts
- Document expiry reminders

---

## 🧪 Testing the API

### Using Browser

Visit: http://localhost:5000

You should see:
```json
{
  "success": true,
  "message": "E-Challan System API",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/auth",
    "challans": "/api/challans",
    "health": "/health"
  }
}
```

### Using Postman/Insomnia

**1. Login**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@echallan.gov.in",
  "password": "Admin@123456"
}
```

**2. Get Challans (use token from login)**
```
GET http://localhost:5000/api/challans
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**3. Search Challan by Vehicle**
```
GET http://localhost:5000/api/challans/search/DL01AB1234
```

---

## 🔧 Troubleshooting

### MongoDB Connection Error

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solutions:**
1. Ensure MongoDB is running:
   ```powershell
   # Check if MongoDB service is running
   Get-Service -Name MongoDB
   
   # Start if not running
   Start-Service -Name MongoDB
   ```

2. Verify MongoDB is listening on port 27017:
   ```powershell
   netstat -an | findstr :27017
   ```

3. Check MongoDB logs:
   - Default location: `C:\Program Files\MongoDB\Server\7.0\log\mongod.log`

### Port Already in Use

**Error:** `Port 5000 is already in use`

**Solution:**
1. Find and kill the process:
   ```powershell
   # Find process using port 5000
   netstat -ano | findstr :5000
   
   # Kill the process (replace PID with actual process ID)
   taskkill /PID <PID> /F
   ```

2. Or change the port in `backend/.env`:
   ```
   PORT=5001
   ```

### Dependencies Installation Failed

**Solution:**
1. Clear npm cache:
   ```powershell
   npm cache clean --force
   ```

2. Delete node_modules and reinstall:
   ```powershell
   cd backend
   Remove-Item -Recurse -Force node_modules
   npm install
   ```

### Database Seeding Failed

**Solution:**
1. Ensure MongoDB is running
2. Clear existing data and re-seed:
   ```powershell
   # Connect to MongoDB
   mongosh
   
   # Drop database
   use echallan_system
   db.dropDatabase()
   exit
   
   # Re-run seed script
   npm run seed
   ```

---

## 📁 Project Structure

```
ECR/
├── backend/                    # Backend API
│   ├── config/
│   │   └── database.js        # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   └── challanController.js
│   ├── middleware/
│   │   └── auth.js            # JWT middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Vehicle.js
│   │   ├── Challan.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── challans.js
│   ├── scripts/
│   │   └── seedDatabase.js    # Database seeding
│   ├── .env                   # Environment config
│   ├── package.json
│   └── server.js              # Main server
├── src/                       # React frontend
│   ├── components/
│   ├── pages/
│   └── ...
├── setup-backend.bat          # Setup script
├── start-backend.bat          # Start script
└── SETUP.md                   # This file
```

---

## 🔒 Security Features

1. **Password Hashing:** bcrypt with 10 rounds
2. **JWT Authentication:** Access & refresh tokens
3. **Rate Limiting:** 
   - General API: 100 req/15min
   - Auth endpoints: 5 req/15min
4. **Account Lockout:** After 5 failed login attempts
5. **Role-Based Access Control:** Admin, Officer, Citizen
6. **CORS Protection:** Configured for frontend URL
7. **Security Headers:** Helmet.js middleware

---

## 📝 Next Steps

1. ✅ Verify MongoDB is running
2. ✅ Run backend setup (`.\setup-backend.bat`)
3. ✅ Start backend server (`.\start-backend.bat`)
4. ✅ Start frontend (`npm start` in root directory)
5. ✅ Login with test credentials
6. ✅ Explore the application!

---

## 🆘 Need Help?

- Check the backend README: `backend/README.md`
- Review API documentation in the README
- Check MongoDB logs for database issues
- Ensure all prerequisites are installed

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review error logs in the terminal
3. Verify all services are running

---

**Happy Coding! 🚀**
