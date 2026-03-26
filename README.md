<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=220&section=header&text=ECR%20System&fontSize=80&fontAlignY=38&desc=Real-Time%20Document%20Validator%20%26%20E-Challan%20Relay&descAlignY=60&descSize=20&descAlign=50" width="100%" />

<br/>

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![YOLOv8](https://img.shields.io/badge/YOLOv8-Computer_Vision-FF4A17?style=for-the-badge&logo=opencv&logoColor=white)]()
[![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)]()

<br/>

**An open-source, AI-powered traffic enforcement platform designed to eliminate manual challan processing and reduce document fraud on Indian roads.**

[📖 Documentation](docs/SETUP.md) · [🐛 Report Bug](../../issues) · [💡 Request Feature](../../issues) · [🤝 Contributing](CONTRIBUTING.md)

</div>

---

## 🔴 The Problem: India's Traffic Enforcement Gap

India has **~22 crore registered vehicles** but a tiny fraction carry valid PUC, insurance, and fitness certificates simultaneously. Manual enforcement by traffic police is:

- **Slow** — a single officer can check ~40 vehicles/hour manually
- **Inconsistent** — errors in challan slips, missing signatures, lost paper receipts
- **Easily evaded** — expired documents go undetected at unmanned checkpoints
- **Paper-heavy** — challans get misplaced, fines go unpaid, no digital trail

The result: millions of rupees in unpaid fines, emissions from unchecked vehicles, and road safety risks from drivers with invalid licenses or unfit vehicles.

**ECR was built to fix this.**

---

## ✅ The Solution: Automated, AI-Powered Enforcement

ECR (E-Challan Relay) is a **three-tier microservices platform** that:

1. **Reads license plates in real-time** from dashcam feeds using YOLOv8 + OpenCV
2. **Validates documents instantly** — RC, Insurance, PUC, and Fitness — against a centralized vehicle dataset
3. **Issues e-challans automatically** via Gmail SMTP with PDF evidence attached
4. **Notifies citizens** and lets them **pay fines online** through a self-service portal

All without a traffic officer needing to stop a single vehicle.

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        ECR Platform                          │
├─────────────────┬──────────────────┬────────────────────────┤
│  React Frontend │ Node.js Backend  │  Python ML Service     │
│  (Port 3000)    │ (Port 5001)      │  (Port 5000)           │
│                 │                  │                        │
│  Citizen Portal │ Auth (JWT+Fire)  │  YOLOv8 ANPR Engine   │
│  Admin Panel    │ Challan History  │  OpenCV Processing     │
│  Payment UI     │ Email Dispatch   │  Pandas Doc Lookup     │
│  News Feed      │ MongoDB ORM      │  ReportLab PDF Gen     │
└─────────────────┴──────────────────┴────────────────────────┘
                           │
                    MongoDB Database
                 (Violations, Users, Logs)
```

---

## ✨ Features

### 🤖 AI Enforcement Engine
- **Real-time ANPR** — YOLOv8-powered number plate detection from video/image feeds
- **Bounding box visualization** — Live annotation of detected plates with confidence scores
- **Batch video analysis** — Process dashcam recordings for retrospective violations

### 👮 Admin Dashboard (Traffic Officials Only)
- **Manual Scan Control** — Explicit scan/cancel buttons for precise workflow management
- **Live Statistics** — Real-time violation counts, pending challans, and compliance rates
- **Structured Reports** — Tabular view of RC, Insurance, PUC, and Fitness status per vehicle
- **Direct Email Dispatch** — Send challans manually with evidence from the dashboard
- **Role-Based Access Control** — JWT + bcrypt authentication; admins only

### 🌐 Citizen Portal (Public Access)
- **Violation Self-Check** — Search by plate number without login
- **Pending Fine Overview** — Full details of outstanding challans
- **Simulated Payment Gateway** — Complete the payment flow end-to-end
- **Receipt Printing** — Printable receipt generated after successful payment

### 📬 Automated Notification Pipeline
- **SMTP Email Delivery** — Challans sent instantly with PDF evidence
- **Full audit trail** — Every violation logged with timestamp and officer ID

### 📰 Real-Time News Integration
- Live feed of Indian traffic law updates and road safety news
- Official news channel branding for professionalism

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React.js 18, Tailwind CSS, Framer Motion | Citizen + Admin UI |
| Backend | Node.js, Express.js, Mongoose | API, Auth, Notifications |
| ML Service | Python 3.9, Flask, OpenCV, YOLOv8 | ANPR & Document Validation |
| Database | MongoDB | Violations, Users, Audit Logs |
| Auth | Firebase + JWT + bcrypt | Secure Role-Based Access |
| PDF | ReportLab | Challan document generation |
| Email | Gmail SMTP | Automated fine delivery |

---

## 📂 Project Structure

```
ECR/
├── src/                    # React.js Frontend
│   ├── pages/              # AdminDashboard, CitizenPortal, PayChallan...
│   ├── components/         # Header, Footer, WorkflowAnimation...
│   └── contexts/           # Firebase AuthContext
├── backend/                # Node.js Express API (Port 5001)
│   ├── routes/             # auth, challans, email
│   └── server.js
├── ml_service/             # Python/Flask ANPR + ML (Port 5000)
│   ├── app/                # app.py, YOLO inference, plate lookup
│   └── requirements.txt
├── data/                   # Indian vehicle dataset (RC/PUC/Insurance)
├── docs/                   # Setup guides, DB status, SMTP tests
└── public/                 # Static assets, demo video
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- Python 3.9+
- MongoDB Community Server (running on port 27017)
- Gmail account with App Password enabled (for SMTP)

### One-Command Setup (Windows)
```bash
git clone https://github.com/himanshupandey04/Real-Time-Doc-Validator-Instant-E-Challan-Relay.git
cd Real-Time-Doc-Validator-Instant-E-Challan-Relay
start-backend.bat
```

### Manual Setup
```bash
# 1. Install frontend + root dependencies
npm install

# 2. Install backend dependencies
cd backend && npm install

# 3. Install ML service dependencies
cd ../ml_service && pip install -r requirements.txt
```

### Environment Variables

Create `backend/.env`:
```env
MONGO_URI=mongodb://localhost:27017/ecr
JWT_SECRET=your_secret_key
PORT=5001
```

Create `ml_service/app/.env`:
```env
GMAIL_USER=your@gmail.com
GMAIL_APP_PASSWORD=your_app_password
```

### Run the Full Stack
```bash
npm run dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5001 |
| ML Service | http://localhost:5000 |

---

## 🔑 Demo Credentials

| Role | Username | Password |
|---|---|---|
| Traffic Officer (Admin) | `officer1` | `12345` |
| Test Plate — Valid | `MH12DE1433` | All docs current |
| Test Plate — Expired PUC | `KA05JA2024` | PUC expired |

---

## 🔒 Security

- All API keys and SMTP credentials stored in `.env` (git-ignored)
- Role-based access: citizens see public portal, admins access enforcement tools
- Password hashing with bcrypt on all local accounts
- JWT tokens with expiration for session management

---

## 🗺️ Roadmap

- [ ] Deploy to cloud (AWS EC2 + MongoDB Atlas)
- [ ] Integrate live CCTV feed via RTSP streams
- [ ] Mobile app for on-the-spot scanning (React Native)
- [ ] Multi-city dataset support
- [ ] SMS notifications via Twilio alongside email
- [ ] Dashboard analytics with Chart.js / Recharts

---

## 🤝 Contributing

Contributions are welcome! Whether it's:
- Improving ANPR accuracy on regional plates
- Adding support for more document types
- Localization for non-English speaking states

Please open an [issue](../../issues) first to discuss what you'd like to change, then check [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

<div align="center">
<sub>Built with ❤️ to make Indian roads safer, one plate at a time.</sub>
<br/><br/>
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer" width="100%" />
</div>
