-- Quick fix for database selection issue
-- STEP 1: First run this to see your available databases
SHOW DATABASES;

-- STEP 2: Replace 'your_database_name' below with your actual database name and run
-- Common names might be: luxy_db, luxy_backend, luxy, car_booking_db, etc.
-- USE your_database_name;

-- STEP 3: Once you've selected the database, run the car seeding script

-- Quick single car insert for immediate testing (after selecting database):
-- USE your_database_name;
-- INSERT INTO brand (id, name, image, dateCreated, lastUpdated) VALUES (1, 'Porsche', 'https://example.com/images/porsche-logo.png', NOW(), NOW());
-- INSERT INTO vendor (id, name, email, phone, address, dateCreated, lastUpdated) VALUES (1, 'Luxury Cars Lagos', 'vendor@luxurycars.ng', '+234-800-LUXURY', 'Victoria Island, Lagos, Nigeria', NOW(), NOW());
-- INSERT INTO car (make, model, year, color, price, status, vendorId, brandId, carLocation, numberOfSeats) VALUES ('Porsche', '911 Carrera', 2024, 'Red', 750.00, 'AVAILABLE', 1, 1, 'Lagos, Nigeria', 2);
