# TransitOps API Endpoints Documentation

## Base URL
```
https://api.transitops.com/v1
```

## Authentication
All endpoints (except `/auth/login` and `/auth/signup`) require:
```
Authorization: Bearer {JWT_TOKEN}
```

---

## 🔐 Authentication Endpoints

### POST `/auth/login`
Login with email and password
```json
Request:
{
  "email": "demo@transitops.com",
  "password": "demo123456"
}

Response:
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "USR001",
    "email": "demo@transitops.com",
    "name": "Admin User",
    "role": "Super Admin"
  }
}
```

### POST `/auth/refresh`
Refresh access token
```json
Request:
{
  "refreshToken": "eyJhbGc..."
}

Response:
{
  "accessToken": "eyJhbGc..."
}
```

### POST `/auth/logout`
Logout and invalidate tokens

---

## 🚗 Vehicle Management Endpoints

### GET `/vehicles`
List all vehicles with filters
```
Query Parameters:
- page: number (default: 1)
- limit: number (default: 20)
- status: Active | Maintenance | Retired | Inactive
- type: Truck | Van | Bus | Pickup
- search: string (registration, name, model)

Response:
{
  "data": [
    {
      "id": "VEH001",
      "registrationNumber": "TRN-2024-001",
      "name": "Fleet Truck 01",
      "model": "Volvo FH16",
      "manufacturer": "Volvo",
      "type": "Truck",
      "status": "Active",
      "odometer": 45230,
      "capacity": 25,
      "lastMaintenance": "2024-01-15",
      "nextMaintenance": "2024-04-15",
      "registrationExpiry": "2025-06-30",
      "assignedTo": "DRV001"
    }
  ],
  "total": 247,
  "page": 1,
  "limit": 20
}
```

### GET `/vehicles/:id`
Get single vehicle details
```
Response:
{
  "id": "VEH001",
  "registrationNumber": "TRN-2024-001",
  "name": "Fleet Truck 01",
  // ... full vehicle data
  "documents": [...],
  "maintenanceHistory": [...],
  "tripHistory": [...]
}
```

### POST `/vehicles`
Create new vehicle
```json
Request:
{
  "registrationNumber": "TRN-2024-006",
  "name": "Fleet Truck 03",
  "model": "Scania R500",
  "manufacturer": "Scania",
  "type": "Truck",
  "chassisNumber": "CH123456",
  "engineNumber": "EN654321",
  "vinNumber": "VIN123456789",
  "maxLoadCapacity": 22,
  "acquisitionCost": 850000,
  "insuranceDetails": {...},
  "registrationExpiry": "2025-08-20",
  "pollutionCertificateExpiry": "2025-07-15"
}
```

### PUT `/vehicles/:id`
Update vehicle
```json
Request: (any field can be updated)
{
  "name": "Fleet Truck 03 Updated",
  "status": "Active"
}
```

### DELETE `/vehicles/:id`
Soft delete vehicle

### GET `/vehicles/available`
Get available vehicles for trip assignment
```
Response:
{
  "data": [
    // Only Active vehicles not on trips and not in maintenance
  ],
  "total": 189
}
```

---

## 👤 Driver Management Endpoints

### GET `/drivers`
List all drivers with filters
```
Query Parameters:
- page: number
- limit: number
- status: Available | On Duty | Off Duty | Suspended
- licenseExpiringSoon: boolean
- search: string

Response:
{
  "data": [
    {
      "id": "DRV001",
      "name": "John Doe",
      "employeeId": "EMP001",
      "licenseNumber": "DL-2024-001",
      "licenseExpiry": "2026-06-15",
      "licenseCategory": "HCV",
      "status": "Available",
      "safetyScore": 95,
      "rating": 4.8,
      "experience": 12,
      "joiningDate": "2015-03-10",
      "phone": "+1-555-0101",
      "email": "john.doe@transitops.com",
      "currentVehicle": "VEH001"
    }
  ],
  "total": 248
}
```

### GET `/drivers/:id`
Get driver profile with complete history
```
Response:
{
  // Driver data
  "accidentHistory": [...],
  "penaltyRecords": [...],
  "certifications": [...],
  "tripHistory": [...],
  "documents": [...]
}
```

### POST `/drivers`
Create new driver
```json
Request:
{
  "name": "Alice Cooper",
  "employeeId": "EMP099",
  "licenseNumber": "DL-2024-099",
  "licenseCategory": "HCV",
  "licenseExpiry": "2026-12-31",
  "phone": "+1-555-0199",
  "email": "alice.cooper@transitops.com",
  "address": "...",
  "emergencyContact": "...",
  "joiningDate": "2024-02-15"
}
```

### PUT `/drivers/:id`
Update driver information

### DELETE `/drivers/:id`
Soft delete driver

### GET `/drivers/available`
Get available drivers for trip assignment

---

## 🛣️ Trip Management Endpoints

### GET `/trips`
List all trips with filters
```
Query Parameters:
- page: number
- limit: number
- status: Draft | Scheduled | Dispatched | In Progress | Completed | Cancelled
- priority: Low | Medium | High | Urgent
- dateFrom: date
- dateTo: date
- search: string

Response:
{
  "data": [
    {
      "id": "TRP001",
      "source": "New York, NY",
      "destination": "Boston, MA",
      "driver": "DRV001",
      "vehicle": "VEH001",
      "status": "Completed",
      "cargoType": "Electronics",
      "cargoWeight": 15,
      "plannedDistance": 215,
      "estimatedTime": 4,
      "scheduledDate": "2024-02-10",
      "priority": "High",
      "revenue": 2500,
      "actualDistance": 213,
      "actualTime": 3.8
    }
  ],
  "total": 456
}
```

### POST `/trips`
Create new trip (Schedule)
```json
Request:
{
  "source": "Chicago, IL",
  "destination": "Detroit, MI",
  "driverId": "DRV002",
  "vehicleId": "VEH002",
  "cargoType": "Furniture",
  "cargoWeight": 20,
  "plannedDistance": 280,
  "estimatedTime": 5,
  "scheduledDate": "2024-02-15",
  "priority": "Medium",
  "expectedRevenue": 3200,
  "deliveryInstructions": "..."
}
```

### PUT `/trips/:id/status`
Update trip status
```json
Request:
{
  "status": "Dispatched"
}
```

### PUT `/trips/:id/complete`
Mark trip as completed with actual data
```json
Request:
{
  "actualDistance": 213,
  "actualTime": 3.8,
  "fuelConsumed": 42,
  "expenses": [...]
}
```

### PUT `/trips/:id/cancel`
Cancel trip
```json
Request:
{
  "reason": "Vehicle breakdown",
  "notes": "..."
}
```

---

## 🔧 Maintenance Endpoints

### GET `/maintenance`
List maintenance records
```
Query Parameters:
- page: number
- limit: number
- status: Scheduled | In Progress | Completed | Overdue
- type: Preventive | Corrective | Emergency
- vehicleId: string

Response:
{
  "data": [
    {
      "id": "MNT001",
      "vehicleId": "VEH001",
      "type": "Preventive",
      "status": "Completed",
      "startDate": "2024-02-10",
      "completionDate": "2024-02-12",
      "cost": 2500,
      "technician": "Robert Tech",
      "description": "Regular servicing"
    }
  ],
  "total": 145
}
```

### POST `/maintenance`
Create work order
```json
Request:
{
  "vehicleId": "VEH003",
  "type": "Corrective",
  "description": "Brake system repair",
  "estimatedCost": 4200,
  "technicianId": "TEC001",
  "priority": "High"
}
```

### PUT `/maintenance/:id/complete`
Complete maintenance
```json
Request:
{
  "actualCost": 4150,
  "notes": "...",
  "invoiceUrl": "..."
}
```

---

## ⛽ Expense Endpoints

### GET `/expenses`
List expenses
```
Query Parameters:
- page: number
- category: Fuel | Toll | Parking | Maintenance | Other
- status: Pending | Approved | Rejected
- vehicleId: string
- dateFrom: date
- dateTo: date

Response:
{
  "data": [
    {
      "id": "EXP001",
      "date": "2024-02-11",
      "vehicleId": "VEH001",
      "category": "Fuel",
      "description": "Diesel fuel - 50L",
      "amount": 350,
      "status": "Approved",
      "odometer": 45230
    }
  ],
  "total": 2450,
  "filters": {
    "totalFuel": 1250,
    "totalTolls": 400,
    "totalApproved": 2200
  }
}
```

### POST `/expenses`
Log new expense
```json
Request:
{
  "vehicleId": "VEH001",
  "category": "Fuel",
  "description": "Diesel fuel",
  "amount": 350,
  "odometer": 45230,
  "quantity": 50,
  "unitPrice": 7,
  "tripId": "TRP001",
  "receiptUrl": "..."
}
```

### PUT `/expenses/:id/approve`
Approve expense

### PUT `/expenses/:id/reject`
Reject expense
```json
Request:
{
  "reason": "Duplicate entry"
}
```

---

## 📊 Analytics Endpoints

### GET `/analytics/dashboard`
Get dashboard KPIs
```
Response:
{
  "kpis": {
    "activeVehicles": 247,
    "availableVehicles": 189,
    "inMaintenance": 24,
    "activeTrips": 89,
    "drivingAvailable": 156,
    "fleetUtilization": 76,
    "fuelConsumption": 1240,
    "maintenanceCost": 45230,
    "totalRevenue": 450000
  },
  "trends": {
    "vehicleUtilizationTrend": [...],
    "fuelConsumptionTrend": [...]
  }
}
```

### GET `/analytics/fleet-utilization`
Fleet utilization report

### GET `/analytics/fuel-efficiency`
Fuel efficiency analysis

### GET `/analytics/cost-analysis`
Operational cost breakdown

### GET `/analytics/maintenance-trends`
Maintenance trend analysis

### GET `/analytics/driver-performance`
Driver performance scorecards

---

## 📤 Export Endpoints

### GET `/export/vehicles/csv`
Export vehicles as CSV

### GET `/export/trips/excel`
Export trips as Excel

### GET `/export/expenses/pdf`
Export expenses as PDF

---

## 🔔 Notification Endpoints

### GET `/notifications`
Get user notifications

### POST `/notifications/:id/read`
Mark notification as read

### GET `/notifications/settings`
Get notification preferences

### PUT `/notifications/settings`
Update notification preferences

---

## ✅ Validation Rules

### Vehicle
- `registrationNumber` must be unique
- `maxLoadCapacity` must be > 0
- Cannot assign to trips if status is Retired/Maintenance/Inactive

### Driver
- `licenseNumber` must be unique
- Cannot assign if status is Suspended
- Cannot assign if license is expired

### Trip
- `cargoWeight` cannot exceed vehicle capacity
- `source` and `destination` must be different
- Cannot assign Retired vehicles
- Cannot assign drivers with expired licenses

### Expense
- `amount` must be > 0
- `odometer` must be greater than previous odometer reading

---

## 🔄 Status Workflows

### Trip Status Transitions
```
Draft → Scheduled → Approved → Dispatched → In Progress → Completed
                                                        ↓
                                                      Closed
                          ↓
                       Cancelled
```

### Maintenance Status Transitions
```
Scheduled → In Progress → Completed
   ↓
Overdue (if past due date)
```

### Expense Status Transitions
```
Pending → Approved
   ↓
Rejected
```

---

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "details": {
    "registrationNumber": "Must be unique"
  }
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions for this action"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 409 Conflict
```json
{
  "error": "Vehicle already assigned to active trip"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "requestId": "req_123456"
}
```

---

## 📈 Rate Limiting

- 100 requests per minute for authenticated users
- 10 requests per minute for unauthenticated endpoints
- Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

---

## 🔐 Pagination

All list endpoints support:
```
- page: Current page (default: 1)
- limit: Items per page (default: 20, max: 100)
- sortBy: Field to sort by
- order: asc | desc
```

Response includes:
```json
{
  "data": [...],
  "total": 500,
  "page": 1,
  "limit": 20,
  "totalPages": 25
}
```

---

## 📝 Request/Response Headers

### Request
```
Content-Type: application/json
Authorization: Bearer {JWT_TOKEN}
```

### Response
```
Content-Type: application/json
X-Request-ID: req_123456
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
```

---

Ready to implement! Continue prompting to build the backend API endpoints, database schema, and authentication system.
