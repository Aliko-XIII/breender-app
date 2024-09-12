CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_name VARCHAR NOT NULL CHECK (char_length(user_name) > 0),
    phone VARCHAR NOT NULL UNIQUE CHECK (char_length(phone) >= 10),
    user_bio TEXT,
    picture_url VARCHAR,
    hashed_password VARCHAR NOT NULL CHECK (char_length(hashed_password) > 0),
    salt VARCHAR NOT NULL CHECK (char_length(salt) > 0)
);