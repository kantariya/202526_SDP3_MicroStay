CREATE TABLE booking_guests (

    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    booking_id BIGINT NOT NULL,

    full_name VARCHAR(120) NOT NULL,
    age INT NOT NULL,
    aadhar_number VARCHAR(20) NOT NULL,

    CONSTRAINT fk_booking_guests_booking
        FOREIGN KEY (booking_id)
        REFERENCES bookings(booking_id)
        ON DELETE CASCADE
);

ALTER TABLE bookings
DROP COLUMN full_name,
DROP COLUMN email,
DROP COLUMN phone;