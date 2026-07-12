<<<<<<< HEAD
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
=======
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
>>>>>>> 2570e0927ccf16d0a9bbd0e4c2112f413f515b79
