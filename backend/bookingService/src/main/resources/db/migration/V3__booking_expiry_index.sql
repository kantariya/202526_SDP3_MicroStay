CREATE INDEX idx_booking_expiry
    ON bookings (status, payment_due_time);
