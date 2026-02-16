# 🚦 ECR - E-Challan Recognition System

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/Frontend-React-61dafb.svg)
![Node](https://img.shields.io/badge/Backend-Node.js-339933.svg)
![Python](https://img.shields.io/badge/ML%20Service-Python-3776ab.svg)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47a248.svg)

A comprehensive, AI-powered traffic violation management system that uses Automatic Number Plate Recognition (ANPR) to detect vehicle document expirations and issue e-challans automatically.

---

## 🌟 Key Features

-   **🔍 AI-Powered Scanning**: Real-time number plate detection using YOLOv8 models.
-   **📹 Video Analysis**: Process dashboard camera feeds or uploaded videos for automatic violation detection.
-   **📄 Document Verification**: Real-time checking of RC, Insurance, PUC, and Fitness data against a central dataset.
-   **📧 Automated Notifications**: Instant e-challan delivery to vehicle owners via Gmail SMTP with PDF evidence.
-   **💳 Payment Gateway**: Mock payment simulation for citizens to pay their fines online.
-   **📊 Admin Dashboard**: Comprehensive management interface for traffic officials with live monitoring and statistics.

---

## 🏗️ Architecture Overview

The system consists of three primary components:

1.  **Frontend (React)**: Professional dark-themed UI built for both citizens and administrators.
2.  **Backend (Node.js/Express)**: Core API handling user authentication (Firebase/JWT), user profiles, and notification history.
3.  **ML Service (Python/Flask)**: Computer Vision service running YOLOv8 for plate detection and handling the vehicle dataset processing.

---

## 🛠️ Tech Stack

-   **Frontend**: React.js, Tailwind CSS, Framer Motion
-   **Backend**: Node.js, Express, Mongoose, Firebase Admin
-   **ML Service**: Python, Flask, OpenCV, YOLO, Pandas, ReportLab
-   **Database**: MongoDB (Unified across services)

---

## 🚀 Getting Started

### 📋 Prerequisites

-   **Node.js** (v16+)
-   **Python** (3.9+)
-   **MongoDB Community Server** (Running locally on port 27017)

### 🔧 Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/ECR-System.git
    cd ECR-System
    ```

2.  **Install All Dependencies**:
    ```bash
    # Root & Frontend
    npm install

    # Backend
    cd backend && npm install

    # ML Service
    cd ../ml_service && pip install -r requirements.txt
    ```

3.  **Environment Setup**:
    -   Configure `backend/.env` with your MongoDB URI and JWT secrets.
    -   Configure `ml_service/app/.env` with your Gmail SMTP credentials for automated emails.

### 🏃 Running the Application

You can start the entire stack (Frontend, Backend, and ML Service) with a single command from the root directory:

```bash
npm run dev
```

-   **Frontend**: http://localhost:3000
-   **Backend API**: http://localhost:5001
-   **ML Service**: http://localhost:5000

---

## 📁 Project Structure

```
ECR/
├── backend/            # Express.js Server (Port 5001)
├── ml_service/         # Flask ML Service & YOLO Models (Port 5000)
│   └── app/            # Main ML Application logic
├── src/                # React.js Frontend source
├── public/             # Static assets
├── docs/               # Detailed documentation & setup guides
├── LICENSE             # MIT License
└── README.md           # You are here
```

---

## 🛡️ Security & Privacy

-   **Credential Management**: All API keys and SMTP passwords are managed via environment variables and ignored by Git.
-   **Auth**: Role-based access control (RBAC) ensuring only officials can access scanning tools.
-   **Database**: Password hashing using bcrypt for all local accounts.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for Smarter Traffic Management**
