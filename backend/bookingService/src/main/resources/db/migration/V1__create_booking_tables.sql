-- =====================================================
-- BOOKINGS TABLE
-- =====================================================
CREATE TABLE bookings (
    booking_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    booking_reference VARCHAR(100) NOT NULL UNIQUE,
    user_id VARCHAR(100) NOT NULL,

    -- Embedded GuestDetails
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,

    hotel_id VARCHAR(50) NOT NULL,
    hotel_name VARCHAR(150) NOT NULL,

    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,

    total_rooms INT NOT NULL,
    total_guests INT NOT NULL,

    total_amount DOUBLE NOT NULL,
    currency VARCHAR(10) NOT NULL,

    status ENUM (
        'INITIATED',
        'CONFIRMED',
        'CANCELLED',
        'FAILED'
    ) NOT NULL,

    created_at DATETIME NOT NULL,
    updated_at DATETIME NULL
);

-- =====================================================
-- BOOKED ROOMS TABLE
-- =====================================================
CREATE TABLE booked_rooms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    room_id VARCHAR(50) NOT NULL,
    room_type VARCHAR(50) NOT NULL,

    adults INT NOT NULL,
    children INT NOT NULL,

    price_per_night DOUBLE NOT NULL,
    number_of_rooms INT NOT NULL,

    booking_id BIGINT NOT NULL,

    CONSTRAINT fk_booked_rooms_booking
        FOREIGN KEY (booking_id)
        REFERENCES bookings(booking_id)
        ON DELETE CASCADE
);

-- =====================================================
-- PAYMENTS TABLE
-- =====================================================
CREATE TABLE payments (
    payment_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    payment_gateway VARCHAR(50),
    gateway_payment_id VARCHAR(100),
    gateway_order_id VARCHAR(100),

    amount DOUBLE NOT NULL,
    currency VARCHAR(10) NOT NULL,

    status ENUM (
        'CREATED',
        'SUCCESS',
        'FAILED',
        'REFUNDED'
    ) NOT NULL,

    payment_time DATETIME,

    booking_id BIGINT NOT NULL UNIQUE,

    CONSTRAINT fk_payments_booking
        FOREIGN KEY (booking_id)
        REFERENCES bookings(booking_id)
        ON DELETE CASCADE
);
