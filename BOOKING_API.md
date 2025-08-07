# Luxy Car Booking API

This document describes the car booking functionality implemented in the Luxy backend application.

## Overview

The booking system allows customers to:
1. Browse available cars
2. Check car availability for specific dates
3. Calculate booking prices
4. Create car bookings
5. View their booking history
6. Cancel bookings

## API Endpoints

### Authentication
All booking endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Car Endpoints

#### Get All Available Cars
```http
GET /api/v1/cars
```
- **Description**: Retrieve all available cars
- **Roles**: CUSTOMER, ADMIN, VENDOR
- **Response**: List of available cars with details

#### Get Car by ID
```http
GET /api/v1/cars/{id}
```
- **Description**: Get specific car details
- **Roles**: CUSTOMER, ADMIN, VENDOR
- **Parameters**: 
  - `id` (path): Car ID
- **Response**: Car details including brand information

### Booking Endpoints

#### Create Booking
```http
POST /api/v1/bookings
```
- **Description**: Create a new car booking
- **Roles**: CUSTOMER
- **Body**:
```json
{
  "carId": 1,
  "startDate": "2024-03-01",
  "endDate": "2024-03-07",
  "startTime": "10:00",
  "endTime": "18:00",
  "paymentMethod": "CREDIT_CARD",
  "specialRequests": "Need GPS navigation",
  "pickupLocation": "Downtown Office",
  "returnLocation": "Airport Terminal"
}
```
- **Response**: Created booking details with reference number

#### Get Customer Bookings
```http
GET /api/v1/bookings/customer
```
- **Description**: Get all bookings for the authenticated customer
- **Roles**: CUSTOMER
- **Response**: List of customer's bookings

#### Get All Bookings (Admin/Vendor)
```http
GET /api/v1/bookings/all
```
- **Description**: Get all bookings (admin/vendor only)
- **Roles**: ADMIN, VENDOR
- **Response**: List of all bookings in the system

#### Check Car Availability
```http
GET /api/v1/bookings/availability?carId=1&startDate=2024-03-01&endDate=2024-03-07
```
- **Description**: Check if a car is available for specific dates
- **Roles**: CUSTOMER, ADMIN, VENDOR
- **Query Parameters**:
  - `carId`: Car ID to check
  - `startDate`: Start date (YYYY-MM-DD)
  - `endDate`: End date (YYYY-MM-DD)
- **Response**: Availability status and conflicting dates if any

#### Calculate Booking Price
```http
GET /api/v1/bookings/calculate?carId=1&startDate=2024-03-01&endDate=2024-03-07
```
- **Description**: Calculate total price for a booking
- **Roles**: CUSTOMER, ADMIN, VENDOR
- **Query Parameters**:
  - `carId`: Car ID
  - `startDate`: Start date (YYYY-MM-DD)
  - `endDate`: End date (YYYY-MM-DD)
- **Response**: Price breakdown including taxes

#### Get Booking by Reference
```http
GET /api/v1/bookings/reference/{reference}
```
- **Description**: Get booking details by reference number
- **Roles**: CUSTOMER, ADMIN, VENDOR
- **Parameters**:
  - `reference` (path): Booking reference number
- **Response**: Booking details

#### Get Booking by ID
```http
GET /api/v1/bookings/{id}
```
- **Description**: Get booking details by ID
- **Roles**: CUSTOMER, ADMIN, VENDOR
- **Parameters**:
  - `id` (path): Booking ID
- **Response**: Booking details

#### Cancel Booking
```http
PATCH /api/v1/bookings/{id}/cancel
```
- **Description**: Cancel a booking
- **Roles**: CUSTOMER
- **Parameters**:
  - `id` (path): Booking ID
- **Body**:
```json
{
  "reason": "Change of plans"
}
```
- **Response**: Cancellation confirmation

## Data Models

### Booking Status
- `PENDING`: Initial status when booking is created
- `CONFIRMED`: Booking confirmed after payment
- `ACTIVE`: Booking is currently active (rental period)
- `COMPLETED`: Booking completed successfully
- `CANCELLED`: Booking cancelled by customer
- `REJECTED`: Booking rejected by vendor/admin

### Payment Status
- `PENDING`: Payment not yet processed
- `PAID`: Payment completed successfully
- `FAILED`: Payment failed
- `REFUNDED`: Payment refunded

### Payment Methods
- `CREDIT_CARD`: Credit/Debit card payment
- `WALLET`: Digital wallet payment
- `APPLE_PAY`: Apple Pay
- `PAYPAL`: PayPal
- `BANK_TRANSFER`: Direct bank transfer

## Business Rules

1. **Booking Creation**:
   - Start date cannot be in the past
   - End date must be after start date
   - Car must be available for the selected dates
   - Customer must be authenticated and have a valid account

2. **Pricing**:
   - Base price is calculated as: `pricePerDay * totalDays`
   - 7.5% tax is added to the subtotal
   - Total = Subtotal + Tax

3. **Availability**:
   - Cars with `CONFIRMED` or `ACTIVE` bookings are not available for overlapping dates
   - Only cars with status `AVAILABLE` can be booked

4. **Cancellation**:
   - Only the booking owner can cancel their booking
   - Cannot cancel `COMPLETED` bookings
   - Cannot cancel already `CANCELLED` bookings

## Sample Usage Flow

1. **Browse Cars**: GET `/api/v1/cars`
2. **Check Availability**: GET `/api/v1/bookings/availability?carId=1&startDate=2024-03-01&endDate=2024-03-07`
3. **Calculate Price**: GET `/api/v1/bookings/calculate?carId=1&startDate=2024-03-01&endDate=2024-03-07`
4. **Create Booking**: POST `/api/v1/bookings` with booking details
5. **View Bookings**: GET `/api/v1/bookings/customer`
6. **Cancel if needed**: PATCH `/api/v1/bookings/{id}/cancel`

## Error Handling

The API returns standard HTTP status codes:
- `200`: Success
- `201`: Created (for new bookings)
- `400`: Bad Request (validation errors, business rule violations)
- `401`: Unauthorized (missing or invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found (resource doesn't exist)
- `409`: Conflict (car not available, etc.)
- `500`: Internal Server Error

All error responses include a descriptive message explaining the issue.

## Testing the API

You can test the API using tools like:
- Postman
- curl
- Swagger UI (available at `/api` endpoint when the server is running)

Make sure to:
1. Create a user account first using the auth endpoints
2. Login to get a JWT token
3. Include the token in the Authorization header for all booking requests
