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
  
- **picture_url** (`character varying`): 
  - Description: The path to the user's profile picture.
  - Constraints: None
  
- **hashed_password** (`character varying`): 
  - Description: User's hashed password.
  - Constraints: Not Null, Check (char_length(hashed_password) > 0)
  
- **salt** (`character varying`): 
  - Description: User's unique salt for password hashing.
  - Constraints: Not Null, Check (char_length(salt) > 0)

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

## Enum Type: sex_enum

The enum type used to represent the sex. It consists of two possible values:
```
M: Represents male.
F: Represents female.
```

## Enum Type: species_enum 

The enum type used to represent the animal's species. It has such values:
```
Dog: Represents dog species.
Cat: Represents cat species.
```

## Table: animals

### Description
This table stores animals information including name, specie, breed, photos paths, .

### Columns

- **animal_id** (`uuid`): 
  - Description: A unique identifier for each animal, generated automatically.
  - Default: `gen_random_uuid()`
  - Constraints: Primary Key

- **owner_id** (`uuid`):
  - Description: Animal owner's user record id.
  - Constraints: Not Null, Foreign Key.

- **animal_name** (`character varying`): 
  - Description: The name of the animal.
  - Constraints: Not Null, Check (char_length(animal_name) > 0)

- **animal_sex** (`sex_enum`): 
  - Description: The sex of the animal.
  - Constraints: Not Null

- **animal_species** (`species_enum`): 
  - Description: The species of the animal.
  - Constraints: Not Null, Check (char_length(animal_species) > 0)

- **animal_breed** (`character varying`): 
  - Description: The breed of the animal.
  - Constraints: Not Null, Check (char_length(animal_breed) > 0)

- **animal_bio** (`text`): 
  - Description: The description of the animal profile.
  - Constraints: None
  
- **date_of_birth** (`date`):
  - Description: Date of birth of the animal.
  - Constraints: Not Null

- **profile_photo** (`uuid`): 
  - Description: A unique identifier for photo used as profile picture.
  - Default: `gen_random_uuid()`
  - Constraints: Foreign Key


## Table: animal_photos

### Description
This table stores paths to animal's photos.

### Columns

- **photo_id** (`uuid`): 
  - Description: A unique identifier for each photo.
  - Default: `gen_random_uuid()`
  - Constraints: Primary Key

- **animal_id** (`uuid`): 
  - Description: A unique identifier for each animal.
  - Default: `gen_random_uuid()`
  - Constraints: Not Null, Foreign Key

- **photo_url** (`character varying`): 
  - Description: A path to a photo.
  - Constraints: Not Null

- **uploaded_at** (`timestamp`): 
  - Description: Time and date when photo was uploaded.
  - Default: NOW()
  - Constraints: Not Null

## Table: animal_pedigrees
### Description
This table stores paths to animal's pedigrees.

### Columns

- **pedigree_id** (`uuid`): 
  - Description: A unique identifier for each of animal's pedigree.
  - Default: `gen_random_uuid()`
  - Constraints: Primary Key

- **animal_id** (`uuid`): 
  - Description: A unique identifier for each animal.
  - Default: `gen_random_uuid()`
  - Constraints: Not Null, Foreign Key

- **pedigree_url** (`character varying`): 
  - Description: A path to a GEDCOM file with animal's pedigree.
  - Constraints: Not Null
  
- **copy_url** (`character varying`): 
  - Description: A path to a digital copy of animal's pedigree.
  - Constraints: Not Null

## Table: animal_documents
### Description
This table stores paths to animal's documents.

### Columns

- **document_id** (`uuid`): 
  - Description: A unique identifier for each of animal's document.
  - Default: `gen_random_uuid()`
  - Constraints: Primary Key

- **animal_id** (`uuid`): 
  - Description: A unique identifier for each animal.
  - Default: `gen_random_uuid()`
  - Constraints: Not Null, Foreign Key

- **document_name** (`character varying`): 
  - Description: Name of the stored document.
  - Constraints: None

- **document_url** (`character varying`): 
  - Description: A path to a digital copy of the document.
  - Constraints: Not Null

- **uploaded_at** (`timestamp`): 
  - Description: Time and date when document was uploaded.
  - Default: NOW()
  - Constraints: Not Null
