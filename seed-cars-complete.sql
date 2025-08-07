-- Complete SQL script to seed test data for Luxy car booking system
-- Run this script in your MySQL database

-- IMPORTANT: Replace 'your_database_name' with your actual database name
-- You can find your database name in your .env file (DB_NAME variable)
-- Common database names might be: luxy_db, luxy_backend, luxy, etc.

USE test;

-- Alternative: If you're unsure of your database name, run this first:
-- SHOW DATABASES;

-- Step 1: Insert sample brands (required for cars)
INSERT INTO brand (id, name, image, dateCreated, lastUpdated) VALUES 
(1, 'Porsche', 'https://example.com/images/porsche-logo.png', NOW(), NOW()),
(2, 'Lamborghini', 'https://example.com/images/lamborghini-logo.png', NOW(), NOW()),
(3, 'Ferrari', 'https://example.com/images/ferrari-logo.png', NOW(), NOW()),
(4, 'BMW', 'https://example.com/images/bmw-logo.png', NOW(), NOW()),
(5, 'Mercedes-Benz', 'https://example.com/images/mercedes-logo.png', NOW(), NOW()),
(6, 'Audi', 'https://example.com/images/audi-logo.png', NOW(), NOW()),
(7, 'Rolls-Royce', 'https://example.com/images/rolls-royce-logo.png', NOW(), NOW())
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Step 2: Insert sample user first (required for vendor)
INSERT INTO users (id, firstName, lastName, email, otpVerified, userType, status, dateCreated, lastUpdated) VALUES 
(1, 'Vendor', 'Admin', 'vendor@luxurycars.ng', 1, 'VENDOR', 'ACTIVE', NOW(), NOW())
ON DUPLICATE KEY UPDATE id=id; -- Ignore if user already exists

-- Step 2b: Insert test customer user for booking testing
INSERT INTO users (id, firstName, lastName, email, otpVerified, userType, status, dateCreated, lastUpdated) VALUES 
(2, 'John', 'Doe', 'john.doe@example.com', 1, 'CUSTOMER', 'ACTIVE', NOW(), NOW())
ON DUPLICATE KEY UPDATE id=id; -- Ignore if user already exists

-- Step 3: Insert sample vendor
INSERT INTO vendor (id, bvn, idType, idNumber, kycVerified, userId) VALUES 
(1, '12345678901', 'NIN', 'SAMPLE123456789', 1, 1)
ON DUPLICATE KEY UPDATE id=id; -- Ignore if vendor already exists

-- Step 3b: Insert test customer for booking testing
INSERT INTO customer (id, bvn, idType, idNumber, kycVerified, userId) VALUES 
(1, '09876543210', 'NIN', 'CUSTOMER123456789', 1, 2)
ON DUPLICATE KEY UPDATE id=id; -- Ignore if customer already exists

-- Step 3b: Insert test customer for booking testing
INSERT INTO customer (id, bvn, idType, idNumber, kycVerified, userId) VALUES 
(1, '09876543210', 'NIN', 'CUSTOMER123456789', 1, 2)
ON DUPLICATE KEY UPDATE id=id; -- Ignore if customer already exists

-- Step 4: Insert comprehensive test cars with all fields
INSERT INTO car (
    id, make, model, year, color, licensePlate, vin, transmissionType, fuelType, 
    hasEscort, conditionReport, features, exteriorPhotoUrl, interiorPhotoUrl, 
    numberOfSeats, carLocation, vehicleLicenseUrl, roadworthinessUrl, 
    ownershipCertificateUrl, price, status, vendorId, brandId, dateCreated, lastUpdated
) VALUES 

-- Luxury Sports Cars
(1, 'Porsche', '911 Carrera S', 2024, 'Guards Red', 'LUX-001', 'WP0AA2A99PS000001', 
 'Automatic', 'Gasoline', 0, 'Excellent condition, recently serviced', 
 '["GPS Navigation", "Bluetooth", "Leather Seats", "Sunroof", "Sport Chrono Package", "BOSE Sound System"]',
 'https://example.com/images/porsche-911-exterior.jpg', 'https://example.com/images/porsche-911-interior.jpg',
 2, 'Victoria Island, Lagos', 'https://example.com/docs/license-001.pdf', 
 'https://example.com/docs/roadworthy-001.pdf', 'https://example.com/docs/ownership-001.pdf',
 750.00, 'AVAILABLE', 1, 1, NOW(), NOW()),

(2, 'Lamborghini', 'Huracán EVO', 2023, 'Arancio Borealis (Orange)', 'LUX-002', 'ZHWUC1ZF1PLA00001', 
 'Automatic', 'Gasoline', 0, 'Pristine condition, low mileage', 
 '["GPS Navigation", "Bluetooth", "Carbon Fiber Interior", "Sport Mode", "Launch Control", "Premium Sound"]',
 'https://example.com/images/lamborghini-huracan-exterior.jpg', 'https://example.com/images/lamborghini-huracan-interior.jpg',
 2, 'Ikoyi, Lagos', 'https://example.com/docs/license-002.pdf', 
 'https://example.com/docs/roadworthy-002.pdf', 'https://example.com/docs/ownership-002.pdf',
 1200.00, 'AVAILABLE', 1, 2, NOW(), NOW()),

(3, 'Ferrari', '488 GTB', 2023, 'Rosso Corsa (Red)', 'LUX-003', 'ZFF79ALA7P0000001', 
 'Automatic', 'Gasoline', 0, 'Immaculate condition, Ferrari certified', 
 '["GPS Navigation", "Bluetooth", "Racing Mode", "Carbon Ceramic Brakes", "Ferrari Telemetry", "Premium Audio"]',
 'https://example.com/images/ferrari-488-exterior.jpg', 'https://example.com/images/ferrari-488-interior.jpg',
 2, 'Lekki Phase 1, Lagos', 'https://example.com/docs/license-003.pdf', 
 'https://example.com/docs/roadworthy-003.pdf', 'https://example.com/docs/ownership-003.pdf',
 1000.00, 'AVAILABLE', 1, 3, NOW(), NOW()),

-- Luxury Sedans
(4, 'BMW', '7 Series 750Li', 2024, 'Alpine White', 'LUX-004', 'WBA7E2C59PCG00001', 
 'Automatic', 'Gasoline', 1, 'Executive luxury sedan with chauffeur service available', 
 '["GPS Navigation", "Bluetooth", "Massage Seats", "Rear Entertainment", "Panoramic Sunroof", "Harman Kardon Audio"]',
 'https://example.com/images/bmw-7series-exterior.jpg', 'https://example.com/images/bmw-7series-interior.jpg',
 5, 'Victoria Island, Lagos', 'https://example.com/docs/license-004.pdf', 
 'https://example.com/docs/roadworthy-004.pdf', 'https://example.com/docs/ownership-004.pdf',
 500.00, 'AVAILABLE', 1, 4, NOW(), NOW()),

(5, 'Mercedes-Benz', 'S-Class S560', 2024, 'Obsidian Black', 'LUX-005', 'WDDUG8CB8PA000001', 
 'Automatic', 'Gasoline', 1, 'Ultimate luxury sedan with premium amenities', 
 '["GPS Navigation", "Bluetooth", "Air Suspension", "Burmester Sound", "Ambient Lighting", "Executive Rear Seats"]',
 'https://example.com/images/mercedes-s-class-exterior.jpg', 'https://example.com/images/mercedes-s-class-interior.jpg',
 5, 'Ikoyi, Lagos', 'https://example.com/docs/license-005.pdf', 
 'https://example.com/docs/roadworthy-005.pdf', 'https://example.com/docs/ownership-005.pdf',
 600.00, 'AVAILABLE', 1, 5, NOW(), NOW()),

(6, 'Audi', 'A8 L Quattro', 2024, 'Moonlight Blue', 'LUX-006', 'WAUZZZ4G2PN000001', 
 'Automatic', 'Gasoline', 1, 'Technology-focused luxury sedan', 
 '["GPS Navigation", "Bluetooth", "Quattro AWD", "Virtual Cockpit", "Matrix LED Headlights", "Bang & Olufsen Audio"]',
 'https://example.com/images/audi-a8-exterior.jpg', 'https://example.com/images/audi-a8-interior.jpg',
 5, 'Lekki Phase 1, Lagos', 'https://example.com/docs/license-006.pdf', 
 'https://example.com/docs/roadworthy-006.pdf', 'https://example.com/docs/ownership-006.pdf',
 550.00, 'AVAILABLE', 1, 6, NOW(), NOW()),

-- Ultra Luxury
(7, 'Rolls-Royce', 'Ghost', 2024, 'Arctic White', 'LUX-007', 'SCA664S60PG000001', 
 'Automatic', 'Gasoline', 1, 'Pinnacle of luxury with dedicated chauffeur', 
 '["GPS Navigation", "Bluetooth", "Starlight Headliner", "Refrigerated Compartment", "Picnic Tables", "Bespoke Audio"]',
 'https://example.com/images/rolls-royce-ghost-exterior.jpg', 'https://example.com/images/rolls-royce-ghost-interior.jpg',
 5, 'Victoria Island, Lagos', 'https://example.com/docs/license-007.pdf', 
 'https://example.com/docs/roadworthy-007.pdf', 'https://example.com/docs/ownership-007.pdf',
 1500.00, 'AVAILABLE', 1, 7, NOW(), NOW()),

-- Additional Cars for Testing Different Statuses
(8, 'Porsche', 'Taycan Turbo S', 2024, 'Frozen Blue', 'LUX-008', 'WP0ZZZ99ZPS000001', 
 'Automatic', 'Electric', 0, 'High-performance electric sports car', 
 '["GPS Navigation", "Bluetooth", "Sport Chrono", "Air Suspension", "Porsche Communication Management", "Premium Audio"]',
 'https://example.com/images/porsche-taycan-exterior.jpg', 'https://example.com/images/porsche-taycan-interior.jpg',
 4, 'Ikoyi, Lagos', 'https://example.com/docs/license-008.pdf', 
 'https://example.com/docs/roadworthy-008.pdf', 'https://example.com/docs/ownership-008.pdf',
 800.00, 'MAINTENANCE', 1, 1, NOW(), NOW()),

(9, 'BMW', 'X7 M50i', 2024, 'Carbon Black', 'LUX-009', 'WBA71DY09PCG00001', 
 'Automatic', 'Gasoline', 1, 'Luxury SUV perfect for families or groups', 
 '["GPS Navigation", "Bluetooth", "3rd Row Seating", "Panoramic Sunroof", "Harman Kardon Audio", "Gesture Control"]',
 'https://example.com/images/bmw-x7-exterior.jpg', 'https://example.com/images/bmw-x7-interior.jpg',
 7, 'Lekki Phase 1, Lagos', 'https://example.com/docs/license-009.pdf', 
 'https://example.com/docs/roadworthy-009.pdf', 'https://example.com/docs/ownership-009.pdf',
 650.00, 'BOOKED', 1, 4, NOW(), NOW()),

(10, 'Mercedes-Benz', 'G-Class G63 AMG', 2024, 'Designo Diamond White', 'LUX-010', 'WDCYC7HH9PX000001', 
 'Automatic', 'Gasoline', 0, 'Iconic luxury SUV with exceptional off-road capability', 
 '["GPS Navigation", "Bluetooth", "AMG Performance", "Off-Road Package", "Burmester Audio", "AMG Exhaust"]',
 'https://example.com/images/mercedes-g63-exterior.jpg', 'https://example.com/images/mercedes-g63-interior.jpg',
 5, 'Victoria Island, Lagos', 'https://example.com/docs/license-010.pdf', 
 'https://example.com/docs/roadworthy-010.pdf', 'https://example.com/docs/ownership-010.pdf',
 900.00, 'AVAILABLE', 1, 5, NOW(), NOW())
ON DUPLICATE KEY UPDATE make=VALUES(make), model=VALUES(model);

-- Verify the inserted data
SELECT 'Brands inserted:' as info;
SELECT id, name FROM brand;

SELECT 'Cars inserted:' as info;
SELECT c.id, c.make, c.model, c.year, c.color, c.price, c.status, b.name as brand_name, c.carLocation
FROM car c 
JOIN brand b ON c.brandId = b.id
ORDER BY c.id;

SELECT 'Available cars for booking:' as info;
SELECT c.id, CONCAT(c.make, ' ', c.model, ' (', c.year, ')') as car_name, c.price, c.carLocation
FROM car c 
WHERE c.status = 'AVAILABLE'
ORDER BY c.price;
