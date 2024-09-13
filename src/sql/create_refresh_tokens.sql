CREATE TABLE IF NOT EXISTS refresh_tokens
(
    user_id uuid NOT NULL,
    refresh_token character varying,
    expires_at BIGINT,
    CONSTRAINT refresh_token_pkey PRIMARY KEY (user_id),
    CONSTRAINT user_FK FOREIGN KEY (user_id)
        REFERENCES users (user_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);