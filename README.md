# 🚛 TransitOps ERP

> A Smart Transport Operations Platform that digitizes fleet management, vehicle dispatch, driver operations, maintenance, fuel tracking, and operational analytics.

---

## 📌 Overview

TransitOps is an Enterprise Transport Operations Management System designed to help logistics and transportation organizations manage their daily operations from a single platform.

The system replaces manual spreadsheets and paper-based workflows with a centralized solution for managing vehicles, drivers, trips, maintenance, fuel expenses, and operational reports.

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- Secure Login
- Role-Based Access Control (RBAC)
- Session Management

### 🚚 Vehicle Management
- Vehicle Registration
- Vehicle Directory
- Vehicle Status Tracking
- Vehicle Lifecycle Management

### 👨‍✈️ Driver Management
- Driver Profiles
- License Validation
- Safety Score Tracking
- Driver Availability Management

### 📦 Trip Management
- Trip Creation & Dispatch
- Vehicle Assignment
- Driver Assignment
- Cargo Validation
- Automatic Status Updates

### 🔧 Maintenance Management
- Maintenance Requests
- Vehicle Service History
- Automatic Maintenance Status
- Repair Workflow

### ⛽ Fuel & Expense Tracking
- Fuel Logs
- Maintenance Expenses
- Operational Cost Tracking

### 📊 Dashboard & Reports
- Fleet Utilization
- Active Trips
- Vehicle Status
- Fuel Efficiency
- Operational Cost Analysis
- Vehicle ROI

---

## 📋 Business Rules

- ✅ Unique Vehicle Registration Number
- ✅ Prevent Double Vehicle Assignment
- ✅ Prevent Double Driver Assignment
- ✅ Validate Driver License Expiry
- ✅ Validate Vehicle Capacity
- ✅ Automatic Vehicle Status Updates
- ✅ Automatic Driver Status Updates
- ✅ Maintenance Workflow Automation

---

## 🏗️ Project Architecture

```
TransitOps-ERP
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── application.properties
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── docs/
│
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS

### Backend
- Spring Boot
- Java

### Database
- MySQL

### Tools
- Git
- GitHub

---

## 👥 User Roles

### 🚚 Fleet Manager
- Manage fleet assets
- Monitor vehicle lifecycle
- View operational dashboard

### 📋 Dispatcher
- Create Trips
- Assign Drivers
- Assign Vehicles

### 🛡️ Safety Officer
- Monitor Driver Compliance
- Verify License Validity

### 💰 Financial Analyst
- Track Fuel Costs
- Analyze Expenses
- Generate Reports

---

## 📈 Future Enhancements

- Email Notifications
- PDF Report Export
- Vehicle Document Management
- Interactive Charts
- Advanced Search & Filters
- Dark Mode
- Mobile Responsive Dashboard

---

## 🚀 Getting Started

### Clone Repository

```bash
git clone https://github.com/<your-username>/TransitOps-ERP.git
```

### Frontend

```bash
cd frontend
npm install
npm start
```

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

---

## 🤝 Team

Hackathon Project

---

## 📄 License

This project is developed for a Hackathon and is intended for educational and demonstration purposes.
