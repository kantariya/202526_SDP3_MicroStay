-- =====================================================
-- PAYMENTS TABLE (paymentService DB)
-- =====================================================
CREATE TABLE payments (
    payment_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    payment_gateway VARCHAR(50) NOT NULL,
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

    booking_id BIGINT NOT NULL UNIQUE
);

