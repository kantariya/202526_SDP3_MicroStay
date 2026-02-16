ALTER TABLE users
    ADD COLUMN two_factor_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN total_stays INT NOT NULL DEFAULT 0,
    ADD COLUMN last_booking_date DATE NULL;
