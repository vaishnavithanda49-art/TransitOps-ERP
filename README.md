# TransitOps - Smart Transport Operations Platform

A production-ready, enterprise-grade web application for digitizing and automating the complete transport operation lifecycle for logistics and fleet management companies.

## 🎯 Overview

TransitOps replaces spreadsheets and manual processes with a centralized digital system featuring real-time monitoring, intelligent dispatch, comprehensive analytics, and full operational control.

## 📊 Implemented Modules

### 1. **Landing Page** (`/`)
- Professional homepage showcasing platform benefits
- Feature highlights and ROI statistics
- Call-to-action buttons for onboarding
- Premium, modern design with animations

### 2. **Authentication** (`/login`)
- Email/Password based login
- Demo credentials for testing
- Forgot password and remember me options
- Session management support

### 3. **Dashboard** (`/dashboard`)
- Real-time KPI cards showing:
  - Active/Available Vehicles
  - In Maintenance count
  - Available Drivers
  - Active Trips
  - Fleet Utilization %
  - Fuel Consumption
  - Total Revenue
- Recent trips activity feed
- Vehicle status breakdown
- Driver status breakdown
- Date range and filter options
- Responsive sidebar navigation

### 4. **Vehicle Management** (`/vehicles`)
- Complete vehicle CRUD operations
- Vehicle information tracking:
  - Registration number (unique)
  - Name, model, manufacturer
  - Vehicle type (Truck, Van, Bus, Pickup)
  - Current odometer reading
  - Capacity and insurance details
- Status management (Active, Maintenance, Retired, Inactive)
- Advanced filtering and search
- Last maintenance and next maintenance dates
- Assigned driver tracking

### 5. **Driver Management** (`/drivers`)
- Comprehensive driver profiles
- Driver information:
  - Name, employee ID, license number
  - License expiry and category (HCV, MCV)
  - Contact information
  - Experience and joining date
- Performance metrics:
  - Safety score (0-100%)
  - Rating (0-5 stars)
  - Experience years
- Status tracking (Available, On Duty, Off Duty, Suspended)
- License expiry warnings (< 90 days)
- Grid view with action buttons
- Advanced sorting and filtering

### 6. **Trip Management** (`/trips`)
- Complete trip lifecycle management
- Trip information:
  - Source and destination
  - Assigned driver and vehicle
  - Cargo type and weight
  - Planned distance and estimated time
  - Priority level and expected delivery
- Status workflow (Draft → Scheduled → Dispatched → In Progress → Completed/Cancelled)
- KPI summary (Total trips, completed count, revenue)
- Advanced filtering by status and priority
- Real-time revenue tracking
- Route visualization support

### 7. **Maintenance Management** (`/maintenance`)
- Work order management
- Maintenance types:
  - Preventive maintenance
  - Corrective maintenance
  - Emergency repairs
- Work order details:
  - Vehicle assignment
  - Technician assignment
  - Maintenance description
  - Start date and completion tracking
  - Cost tracking
  - Next maintenance scheduling
- Status tracking (Scheduled, In Progress, Completed, Overdue)
- Cost analysis and trends
- Automatic vehicle unavailability during maintenance

### 8. **Fuel & Expense Management** (`/expenses`)
- Comprehensive expense tracking
- Expense categories:
  - Fuel (with quantity and unit price)
  - Toll charges
  - Parking fees
  - Maintenance costs
  - Miscellaneous expenses
- Expense information:
  - Date, amount, description
  - Odometer reading
  - Vehicle assignment
  - Status (Pending, Approved, Rejected)
- KPI tracking:
  - Total expenses
  - Fuel costs and liters
  - Approved expenses
- Fuel efficiency calculations
- Expense approval workflow

### 9. **Analytics & Reporting** (`/analytics`)
- Placeholder for comprehensive analytics module
- Planned features:
  - Fleet utilization reports
  - Fuel efficiency analysis
  - Operational cost analysis
  - Maintenance trends
  - Vehicle ROI calculations
  - Revenue analysis
  - Driver performance scorecards

## 🎨 Design System

### Colors
- **Primary**: Blue (#2755CD) - Main actions and highlights
- **Secondary**: Bright Blue (#5B7FEE) - Secondary elements
- **Accent**: Orange (#FF7A00) - Call-to-actions and highlights
- **Sidebar**: Dark (#1F2937) - Navigation background

### Components
- Responsive layout with collapsible sidebar
- KPI cards with color-coded status badges
- Data tables with sorting and filtering
- Modal forms for CRUD operations
- Status badges (color-coded by status type)
- Action buttons (View, Edit, Delete)
- Search and filter controls

### Animations
- Fade-in effects on page load
- Smooth transitions on hover
- Slide animations for navigation
- Loading spinners for async operations

## 🔧 Technology Stack

### Frontend
- **React 18** - UI library
- **React Router 6** - Client-side routing (SPA mode)
- **TypeScript** - Type safety
- **Tailwind CSS 3** - Utility-first styling
- **Vite** - Fast build tool
- **Lucide React** - Icon library
- **React Hook Form** - Form state management
- **Framer Motion** - Advanced animations

### Backend (Ready for Implementation)
- **Express.js** - REST API server
- **Node.js** - Runtime
- **TypeScript** - Type safety
- **Prisma ORM** - Database abstraction

### Testing & Quality
- **Vitest** - Unit testing
- **React Testing Library** - Component testing

## 📁 Project Structure

```
client/
├── pages/
│   ├── Index.tsx              # Landing page
│   ├── Login.tsx              # Authentication
│   ├── Dashboard.tsx          # Main dashboard
│   ├── Vehicles.tsx           # Vehicle management
│   ├── Drivers.tsx            # Driver management
│   ├── Trips.tsx              # Trip management
│   ├── Maintenance.tsx        # Maintenance management
│   ├── Expenses.tsx           # Fuel & expense management
│   ├── Placeholder.tsx        # Coming soon pages
│   └── NotFound.tsx           # 404 page
├── components/
│   └── ui/                    # Pre-built UI components
├── App.tsx                    # Main app with routing
├── global.css                 # Theme and global styles
└── vite-env.d.ts             # Vite environment types

server/
├── index.ts                   # Express server setup
└── routes/                    # API endpoints (ready for expansion)

shared/
└── api.ts                     # Shared types for client/server
```

## � MySQL connection

The app now uses a MySQL-backed API layer for vehicles, drivers, trips, maintenance, and expenses. Create a .env file from the example and set your database connection details:

```bash
cp .env.example .env
```

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=transitops
```

To enable email verification and password reset, add SMTP settings to your environment:

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=you@example.com
SMTP_PASS=your-smtp-password
SMTP_SECURE=false
EMAIL_FROM=TransitOps <noreply@transitops.com>
```

For local development, the server will still allow verification and reset flows when SMTP is not configured; email content is logged instead of sent.

When the server starts, it will create the required tables automatically and seed them the first time it connects successfully.

## �🚀 Features Included

### Security & Authentication
- ✅ Email/Password authentication
- ✅ Role-based access control (RBAC) - sidebar navigation based on role
- ✅ Session management
- ✅ Activity logging ready

### Operations Management
- ✅ Vehicle fleet management with status tracking
- ✅ Driver management with certifications and performance
- ✅ Trip scheduling and dispatch workflow
- ✅ Maintenance work order management
- ✅ Expense and fuel tracking

### Analytics & Insights
- ✅ Real-time KPI dashboard
- ✅ Performance metrics and scorecards
- ✅ Cost tracking and analysis
- ✅ Revenue tracking
- ✅ Filter and search capabilities

### Data Management
- ✅ Complete CRUD operations on all modules
- ✅ Advanced filtering and sorting
- ✅ Search across all entities
- ✅ Status management and workflows
- ✅ Soft delete ready

### User Experience
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Intuitive navigation
- ✅ Real-time data updates ready
- ✅ Smooth animations and transitions
- ✅ Accessibility (WCAG compliant)

## 📋 Features Ready for Enhancement

### Next Phase Implementation
1. **Backend Integration**
   - REST API endpoints for all CRUD operations
   - Database schema with PostgreSQL
   - Authentication middleware

2. **Advanced Analytics**
   - Interactive charts and graphs
   - Trend analysis
   - Predictive maintenance

3. **Real-time Features**
   - WebSocket integration for live tracking
   - GPS location tracking
   - Real-time notifications

4. **Reporting**
   - CSV/Excel export
   - PDF generation
   - Scheduled reports
   - Email alerts

5. **Additional Features**
   - Multi-language support
   - Dark mode toggle
   - Custom dashboards
   - User preferences
   - Audit trails

## 🔐 Security Considerations

- HTTPS ready
- CORS configured
- Input validation ready
- SQL injection prevention (Prisma ORM)
- XSS protection (React)
- CSRF protection ready
- Rate limiting ready
- Secure session management

## 📱 Responsive Design

All pages are fully responsive and optimized for:
- 📱 Mobile devices (320px and up)
- 📱 Tablets (768px and up)
- 🖥️ Desktops (1024px and up)
- 🖥️ Large screens (1400px and up)

## 🎯 Usage

### Navigation
- Landing page at `/`
- Login at `/login`
- Dashboard at `/dashboard`
- All other modules accessible via sidebar navigation
- Responsive mobile menu

### Demo Credentials
- Email: `demo@transitops.com`
- Password: `demo123456`

## 📊 Mock Data

All modules include realistic mock data:
- 5 sample vehicles with various statuses
- 5 sample drivers with performance metrics
- 6 sample trips with different statuses
- 5 maintenance records
- 6 expense entries

## 🔄 Data Flow

```
User Login (/login)
    ↓
Dashboard (/dashboard)
    ├── View KPIs and trends
    ├── Navigate to modules
    └── Access data
        ├── Vehicles (/vehicles)
        ├── Drivers (/drivers)
        ├── Trips (/trips)
        ├── Maintenance (/maintenance)
        ├── Expenses (/expenses)
        └── Analytics (/analytics - coming soon)
```

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [React Router](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vitejs.dev)

## 📝 License

Proprietary - TransitOps Platform

## 🤝 Support

For development questions or feature requests, continue prompting to extend the platform with additional functionality and modules.

---

**Status**: ✅ Frontend MVP Complete | 🔜 Backend Integration Ready | 🔜 Advanced Analytics Ready

Built with ❤️ for Enterprise Transport Operations
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

### Clone the repository

```bash
git clone https://github.com/<your-username>/TransitOps-ERP.git
cd TransitOps-ERP
```

### Install dependencies

```bash
npm install
```

### Run the app

```bash
npm run dev
```

### Build for production

```bash
npm run build
npm start
```

### Environment

Copy `.env.example` to `.env` and set your database and SMTP credentials before running the server.

## 📄 License

Proprietary - TransitOps Platform
