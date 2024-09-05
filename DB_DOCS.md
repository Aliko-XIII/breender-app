# Database Tables Documentation

## Table: users

### Description
This table stores user information including name, profile picture, contact information, and unique identifiers.

### Columns

- **user_id** (`uuid`): 
  - Description: A unique identifier for each user, generated automatically.
  - Default: `gen_random_uuid()`
  - Constraints: Primary Key

- **user_name** (`character varying`): 
  - Description: The name of the user.
  - Constraints: Not Null, Check (char_length(user_name) > 0)
  
- **phone** (`character varying`): 
  - Description: The phone number of the user.
  - Constraints: Not Null, Unique, Check (char_length(phone) >= 10)

- **user_bio** (`text`): 
  - Description: The description of the user profile.
  - Constraints: None
  
- **picture_path** (`character varying`): 
  - Description: The path to the user's profile picture.
  - Constraints: None
  
- **hashed_password** (`character varying`): 
  - Description: User's hashed password.
  - Constraints: Not Null, Unique, Check (char_length(hashed_password) > 0)
  
- **salt** (`character varying`): 
  - Description: User's unique salt for password hashing.
  - Constraints: Not Null, Unique, Check (char_length(salt) > 0)


### Constraints

- **Primary Key**: `user_id`
- **Unique**: `email`, `hashed_password`, `salt`
- **Check**: 
  - `user_name_length`: char_length(user_name) > 0

## Table: refresh_tokens

### Description
This table stores refresh tokens for users, which are used to generate new access tokens for authentication purposes.

### Columns

- **user_id** (`uuid`): 
  - Description: A unique identifier for each user, linked to a user in the users table.
  - Constraints: Primary Key, Foreign Key referencing users(user_id)

- **refresh_token** (`character varying`): 
  - Description: The refresh token associated with the user.
  - Constraints: None

- **expires_at** (`timestamp with time zone`): 
  - Description: The expiration date and time of the refresh token.
  - Constraints: None

### Constraints

- **Primary Key**: `user_id`
- **Foreign Key**: 
  - `user_id` references users(user_id)
    - **On Update**: Cascade
    - **On Delete**: Cascade

