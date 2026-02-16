# E-Challan System Backend API

A comprehensive backend system for managing electronic traffic challans with MongoDB database and JWT authentication.

## 🚀 Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin, Officer, Citizen)
  - Secure password hashing with bcrypt
  - Refresh token mechanism
  - Account lockout after failed login attempts

- **Challan Management**
  - Create, read, update challans
  - Payment processing
  - Search by registration number
  - Automatic challan number generation
  - Due date tracking

- **Vehicle Management**
  - Vehicle registration tracking
  - Document expiry monitoring
  - Owner information

- **Security Features**
  - Helmet.js for security headers
  - Rate limiting on API endpoints
  - CORS configuration
  - Input validation
  - SQL injection protection (MongoDB)

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Update the values as needed
   ```bash
   cp .env.example .env
   ```

4. **Ensure MongoDB is running**
   ```bash
   # The default connection string is:
   # mongodb://localhost:27017/echallan_system
   ```

## 🗄️ Database Setup

**Seed the database with sample data:**
```bash
npm run seed
```

This will create:
- 1 Admin user
- 1 Officer user
- 2 Citizen users
- 2 Vehicles
- 2 Sample challans

## 🚀 Running the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | Login user | Public |
| POST | `/logout` | Logout user | Private |
| GET | `/me` | Get current user | Private |
| POST | `/refresh` | Refresh access token | Public |
| PUT | `/update-password` | Update password | Private |

### Challans (`/api/challans`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all challans | Private |
| GET | `/:id` | Get single challan | Private |
| POST | `/` | Create challan | Officer/Admin |
| PUT | `/:id/pay` | Pay challan | Private |
| GET | `/search/:registrationNumber` | Search by vehicle | Public |

### Health Check

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/health` | Server health status | Public |

## 🔐 Default Login Credentials

### Admin
- **Email:** admin@echallan.gov.in
- **Password:** Admin@123456

### Officer
- **Email:** officer1@echallan.gov.in
- **Password:** Officer@123

### Citizen 1
- **Email:** amit.kumar@example.com
- **Password:** User@123456
- **Vehicle:** DL01AB1234

### Citizen 2
- **Email:** priya.sharma@example.com
- **Password:** User@123456
- **Vehicle:** MH02CD5678

## 📦 Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── authController.js    # Authentication logic
│   └── challanController.js # Challan management
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── models/
│   ├── User.js              # User schema
│   ├── Vehicle.js           # Vehicle schema
│   ├── Challan.js           # Challan schema
│   └── Notification.js      # Notification schema
├── routes/
│   ├── auth.js              # Auth routes
│   └── challans.js          # Challan routes
├── scripts/
│   └── seedDatabase.js      # Database seeding
├── .env                     # Environment variables
├── .env.example             # Environment template
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies
├── server.js               # Main server file
└── README.md               # This file
```

## 🔒 Security Features

1. **Password Security**
   - Bcrypt hashing with configurable rounds
   - Minimum 8 characters required
   - Passwords never returned in API responses

2. **Authentication**
   - JWT tokens with expiration
   - Refresh token mechanism
   - Account lockout after 5 failed attempts

3. **Rate Limiting**
   - General API: 100 requests per 15 minutes
   - Auth endpoints: 5 requests per 15 minutes

4. **Headers**
   - Helmet.js for security headers
   - CORS configuration

## 🧪 Testing the API

Use tools like Postman, Insomnia, or curl to test the API.

**Example: Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@echallan.gov.in",
    "password": "Admin@123456"
  }'
```

**Example: Get Challans (with token)**
```bash
curl -X GET http://localhost:5000/api/challans \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🌐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/echallan_system |
| `PORT` | Server port | 5000 |
| `JWT_SECRET` | JWT secret key | (required) |
| `JWT_REFRESH_SECRET` | Refresh token secret | (required) |
| `JWT_EXPIRE` | Access token expiry | 24h |
| `JWT_REFRESH_EXPIRE` | Refresh token expiry | 7d |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |
| `BCRYPT_ROUNDS` | Bcrypt hashing rounds | 10 |

## 📝 Database Schema

### User
- Personal information (name, email, phone)
- Authentication (password, tokens)
- Role-based access (citizen, officer, admin)
- License information
- Security features (login attempts, account lock)

### Vehicle
- Registration details
- Owner information
- Vehicle specifications
- Document tracking (insurance, PUC, registration)
- Blacklist status

### Challan
- Violation details
- Vehicle and owner information
- Fine and payment tracking
- Officer details
- Location and evidence
- Status management

### Notification
- User notifications
- Related entities (challan, vehicle)
- Priority levels
- Read status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For issues and questions, please create an issue in the repository.

---

**Made with ❤️ for Traffic Management**
