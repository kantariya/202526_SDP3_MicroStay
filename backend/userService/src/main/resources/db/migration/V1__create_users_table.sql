CREATE TABLE users (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    address VARCHAR(500),
    city VARCHAR(100),
    country VARCHAR(100),
    role VARCHAR(50) NOT NULL,
    account_non_locked BOOLEAN DEFAULT TRUE,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6)
);