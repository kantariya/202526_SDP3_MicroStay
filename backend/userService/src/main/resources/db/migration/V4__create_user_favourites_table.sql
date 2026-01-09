CREATE TABLE user_favourites (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    hotel_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uk_user_hotel UNIQUE (user_id, hotel_id),
    INDEX idx_user_id (user_id),
    INDEX idx_hotel_id (hotel_id)
);
