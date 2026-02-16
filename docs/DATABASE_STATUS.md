# 🚦 E-Challan System - Quick Start Guide

## ✅ What Has Been Created

### 1. **MongoDB Database Setup** ✅
- **Database Name:** `echallan_system`
- **Connection:** `mongodb://localhost:27017/echallan_system`
- **Status:** Connected and Running

### 2. **Database Collections Created**
The following MongoDB collections are ready:

#### **users** Collection
- Stores user accounts (Citizens, Officers, Admins)
- Features:
  - JWT-based authentication
  - Password hashing with bcrypt
  - Role-based access control
  - Account lockout after failed login attempts
  - Refresh token mechanism

#### **vehicles** Collection
- Vehicle registration information
- Owner details
- Document tracking (Insurance, PUC, Registration)
- Expiry monitoring

#### **challans** Collection
- Traffic violation records
- Auto-generated challan numbers (format: ECH2602XXXX)
- Payment tracking
- Fine calculation
- Officer and location details

#### **notifications** Collection
- User notifications
- Challan alerts
- Payment confirmations
- Document expiry reminders

---

## 🔐 Authentication System

### Security Features Implemented:
1. ✅ **JWT Authentication** - Access & refresh tokens
2. ✅ **Password Hashing** - bcrypt with 10 rounds
3. ✅ **Rate Limiting** - Prevents brute force attacks
4. ✅ **Account Lockout** - After 5 failed login attempts (15 min lock)
5. ✅ **Role-Based Access** - Admin, Officer, Citizen roles
6. ✅ **CORS Protection** - Configured for frontend
7. ✅ **Security Headers** - Helmet.js middleware

---

## 🚀 Running Servers

### Backend API Server
- **URL:** http://localhost:5000
- **Status:** ✅ Running
- **Framework:** Express.js + MongoDB
- **Features:**
  - RESTful API
  - JWT authentication
  - Role-based authorization
  - Input validation
  - Error handling

### Frontend React App
- **URL:** http://localhost:3000
- **Status:** ✅ Starting...
- **Framework:** React 18
- **Features:**
  - Modern UI with animations
  - Responsive design
  - User authentication
  - Challan management
  - Payment processing

---

## 📚 API Endpoints Available

### Authentication (`/api/auth`)
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
POST   /api/auth/logout            - Logout user
GET    /api/auth/me                - Get current user
POST   /api/auth/refresh           - Refresh access token
PUT    /api/auth/update-password   - Update password
```

### Challans (`/api/challans`)
```
GET    /api/challans                        - Get all challans
GET    /api/challans/:id                    - Get single challan
POST   /api/challans                        - Create challan (Officer/Admin)
PUT    /api/challans/:id/pay                - Pay challan
GET    /api/challans/search/:regNumber      - Search by vehicle number
```

### Health Check
```
GET    /health                     - Server health status
```

---

## 🧪 Testing the System

### 1. Test Backend API
Open browser and visit: **http://localhost:5000**

You should see:
```json
{
  "success": true,
  "message": "E-Challan System API",
  "version": "1.0.0"
}
```

### 2. Test Health Endpoint
Visit: **http://localhost:5000/health**

### 3. Test Registration (Using Postman/Browser Console)

**Register a new user:**
```javascript
fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'Password@123',
    phone: '9876543210',
    role: 'citizen'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

**Login:**
```javascript
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'Password@123'
  })
})
.then(res => res.json())
.then(data => {
  console.log('Access Token:', data.data.accessToken);
  // Save this token for authenticated requests
});
```

---

## 📊 Database Schema Overview

### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  phone: String (required, 10 digits),
  licenseNumber: String (optional, unique),
  role: Enum ['citizen', 'officer', 'admin'],
  isActive: Boolean,
  isVerified: Boolean,
  loginAttempts: Number,
  lockUntil: Date,
  lastLogin: Date
}
```

### Vehicle Schema
```javascript
{
  registrationNumber: String (required, unique),
  owner: ObjectId (ref: User),
  vehicleType: Enum,
  make: String,
  model: String,
  year: Number,
  insuranceExpiry: Date,
  pucExpiry: Date,
  registrationExpiry: Date,
  isBlacklisted: Boolean
}
```

### Challan Schema
```javascript
{
  challanNumber: String (auto-generated),
  vehicle: ObjectId (ref: Vehicle),
  registrationNumber: String,
  owner: ObjectId (ref: User),
  violationType: Enum,
  location: Object,
  fineAmount: Number,
  paymentStatus: Enum,
  issuedBy: ObjectId (ref: User),
  dueDate: Date,
  status: Enum
}
```

---

## 🔧 Configuration Files

### Environment Variables (`.env`)
```env
MONGODB_URI=mongodb://localhost:27017/echallan_system
PORT=5000
JWT_SECRET=echallan_jwt_secret_key_2026_secure_token
JWT_REFRESH_SECRET=echallan_refresh_token_secret_2026_secure
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

---

## 📁 Backend Project Structure

```
backend/
├── config/
│   └── database.js              # MongoDB connection
├── controllers/
│   ├── authController.js        # Authentication logic
│   └── challanController.js     # Challan management
├── middleware/
│   └── auth.js                  # JWT middleware
├── models/
│   ├── User.js                  # User schema
│   ├── Vehicle.js               # Vehicle schema
│   ├── Challan.js               # Challan schema
│   └── Notification.js          # Notification schema
├── routes/
│   ├── auth.js                  # Auth routes
│   └── challans.js              # Challan routes
├── scripts/
│   ├── seedDatabase.js          # Database seeding
│   └── testConnection.js        # Connection test
├── .env                         # Environment config
├── server.js                    # Main server
└── package.json                 # Dependencies
```

---

## 🎯 Next Steps

1. ✅ **Backend is running** on http://localhost:5000
2. ✅ **Frontend is starting** on http://localhost:3000
3. ⏳ **Create test users** via API or registration page
4. ⏳ **Test authentication** flow
5. ⏳ **Create vehicles and challans**

---

## 💡 Usage Tips

### Creating Your First User
1. Open the React app at http://localhost:3000
2. Navigate to the registration page
3. Fill in the details:
   - Name, Email, Password (min 8 chars)
   - Phone (10 digits)
   - License Number (optional)
4. Click Register

### Logging In
1. Use the email and password you registered with
2. You'll receive an access token
3. The token is automatically stored for API requests

### Creating a Challan (Officer/Admin only)
1. Login as an officer or admin
2. Use the challan creation endpoint
3. Provide vehicle registration number and violation details
4. System auto-generates challan number and calculates fine

---

## 🆘 Troubleshooting

### Backend won't start
- Ensure MongoDB is running: `Get-Service MongoDB`
- Check port 5000 is not in use
- Verify .env file exists

### Frontend won't start
- Check if port 3000 is available
- Run `npm install` if dependencies are missing
- Clear cache: `npm cache clean --force`

### Database connection error
- Verify MongoDB service is running
- Check connection string in .env
- Ensure MongoDB is on port 27017

---

## 📞 Support

- Backend README: `backend/README.md`
- Setup Guide: `SETUP.md`
- API Documentation: See endpoints section above

---

**🎉 Your E-Challan System with MongoDB and Authentication is Ready!**

Both servers are running. Open http://localhost:3000 in your browser to start using the application!
