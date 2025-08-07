-- Sample data for testing the Luxy car booking system

-- First, insert sample brands
INSERT INTO brand (name, image) VALUES 
('Porsche', 'https://example.com/porsche-logo.png'),
('Lamborghini', 'https://example.com/lamborghini-logo.png'),
('Ferrari', 'https://example.com/ferrari-logo.png');

-- Insert a sample vendor (you may need to have a user first)
INSERT INTO vendor (bvn, idType, idNumber, kycVerified, userId) VALUES 
('12345678901', 'NIN', 'SAMPLE123456789', 1, 1);

-- Insert sample cars
INSERT INTO car (
    make, model, year, color, licensePlate, vin, transmissionType, fuelType, 
    hasEscort, numberOfSeats, carLocation, price, status, vendorId, brandId,
    features
) VALUES 
(
    'Porsche', '911 Carrera', 2023, 'Red', 'LUX-001', 'WP0AA2A99NS000001', 
    'Automatic', 'Gasoline', 0, 2, 'Lagos, Nigeria', 500.00, 'AVAILABLE', 1, 1,
    '["GPS", "Bluetooth", "Leather Seats", "Sunroof"]'
),
(
    'Lamborghini', 'Huracán', 2024, 'Yellow', 'LUX-002', 'ZHWUC1ZF1LLA00001', 
    'Automatic', 'Gasoline', 0, 2, 'Lagos, Nigeria', 800.00, 'AVAILABLE', 1, 2,
    '["GPS", "Bluetooth", "Carbon Fiber Interior", "Sport Mode"]'
),
(
    'Ferrari', '488 GTB', 2023, 'Black', 'LUX-003', 'ZFF79ALA7J0000001', 
    'Automatic', 'Gasoline', 0, 2, 'Lagos, Nigeria', 750.00, 'AVAILABLE', 1, 3,
    '["GPS", "Bluetooth", "Racing Mode", "Carbon Ceramic Brakes"]'
);

-- Verify the data was inserted
SELECT 'Cars inserted:' as info;
SELECT c.id, c.make, c.model, c.year, c.price, c.status, b.name as brand_name 
FROM car c 
JOIN brand b ON c.brandId = b.id;
