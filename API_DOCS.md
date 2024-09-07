# API Documentation

## Description
This project is an app for animal breeders. The application has the functionality to add, update, delete, and get information about users, their animals. App supports authorization using JWT (JSON Web Token).

## Technical Requirements
- **Programming Language**: JavaScript, TypeScript
- **Backend Framework**: Express.js
- **Frontend Framework**: React.js
- **Database**: PostgreSQL
- **Containerization**: Docker

## Base URL
`http://localhost:3000`

## API Endpoints

### 1. Endpoint `api/v1/auth/`:

***
#### POST `api/v1/auth/login`
**Purpose:** Authenticate and log in a user..

**Request headers:**

<table border=3>
<tr>
  <th style="width:20%;">Header name</th>
  <th>Header value</th>
  </tr>

  <tr>
  <td>Content-Type</th>
  <td>application/json</td>
  </tr>
</table>

**Request body:**

Object which contains user's phone and password.

**Responses:**

<table border=3>
<tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>200</th>
  <td>User successfully logged in. 
  
  Returns:

  1) object with short term access token used for requests authorization.
  2) object with long term refresh token used for getting new access token.</td>
  </tr>

  <tr>
  <td>400</th>
  <td>Email or password are not correct.</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'POST' \
    'api/v1/auth/login' \
    -H 'Content-Type: application/json' \
    -d '{
        "phone": "53245234523",
        "password": "greenpass789",
    }'
```

**Response body**
```sh
    {
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImlhdCI6IkZyaSBKdWwgMTIgMjAyNCAxMjoyNzo1MiBHTVQrMDMwMCAoRWFzdGVybiBFdXJvcGVhbiBTdW1tZXIgVGltZSkiLCJleHAiOiIxbSJ9.eyJpZCI6MjAsIm5hbWUiOiJDaHJpc3RvcGhlciIsInN1cm5hbWUiOiJHcmVlbiIsInNleCI6Ik0iLCJhZ2UiOjM3LCJwaG9uZSI6IjY2Njc3Nzg4ODIifQ.6__HjLeclq5Vf1Oue5R4-cnaqWcBCQuIeM8tusBFjck",
        "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImlhdCI6IkZyaSBKdWwgMTIgMjAyNCAxMjoyNzo1MiBHTVQrMDMwMCAoRWFzdGVybiBFdXJvcGVhbiBTdW1tZXIgVGltZSkiLCJleHAiOiIzZCJ9.eyJwaG9uZSI6IjY2Njc3Nzg4ODIifQ.BN1IPBCfcbaeoollARNd4VJp0WJssVU5lDJ0sQ5If5s"
    }
```

***
#### POST `api/v1/auth/refresh`
**Purpose:** Get new access token.

**Request headers:**

<table border=3>
<tr>
  <th style="width:20%;">Header name</th>
  <th>Header value</th>
  </tr>
  <tr>
  <td>Content-Type</th>
  <td>application/json</td>
  </tr>
</table>

**Request body:**

Object which contains user's refresh token.

**Responses:**

<table border=3>
<tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>200</th>
  <td> New access token is generated and returned.
  </td>
  </tr>
  <tr>
  <td>400</th>
  <td>Refresh token is not valid.</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'POST' \
    'api/v1/auth/refresh' \
    -H 'Content-Type: application/json' \
    -d '{
        "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImlhdCI6IldlZCBKdWwgMjQgMjAyNCAxOTo1OTo0NiBHTVQrMDMwMCAoRWFzdGVybiBFdXJvcGVhbiBTdW1tZXIgVGltZSkiLCJleHAiOiIzZCJ9.eyJpZCI6ImYxY2M0NTliLTQxNTItNDU2MC05NmQ3LTQ4NWNkYzNmY2IyMCJ9.lBSMqquCRP5YQ5JiyWkm5JXUM33utIQcL2qa27R1-rs"
    }'
```

**Response body**
```sh
      {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImlhdCI6IldlZCBKdWwgMjQgMjAyNCAxOTo1OTo1OSBHTVQrMDMwMCAoRWFzdGVybiBFdXJvcGVhbiBTdW1tZXIgVGltZSkiLCJleHAiOiIxbSJ9.eyJmaXJzdE5hbWUiOiJDaHJpc3RvcGhlciIsImxhc3ROYW1lIjoiR3JlZW4iLCJwaG9uZSI6IjY2Njc3Nzg4ODIiLCJwYXNzd29yZCI6ImdyZWVucGFzczc4OSIsImFnZSI6MzcsInNleCI6Ik0iLCJpZCI6ImYxY2M0NTliLTQxNTItNDU2MC05NmQ3LTQ4NWNkYzNmY2IyMCJ9.EN8OFvjGycT9KiHWydSY09_Keq5gAqrOEkS7RHiWYf8"
      }
```

### 2. Endpoint `api/v1/users/`:

***
#### GET `api/v1/users`
**Purpose:** Get all users.

**Request headers:**

<table border=3>
<tr>
  <th style="width:20%;">Header name</th>
  <th>Header value</th>
  </tr>

  <tr>
  <td>Authorization</th>
  <td>Access token generated for user.</td>
  </tr>
</table>

**Request body:**

Empty

**Responses:**

<table border=3>
<tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>200</th>
  <td>Returns all user records, which include id, name, phone, bio, profile picture URL.</td>
  </tr>
</table>

**Query Parameters**:

<table border=3>
  <tr>
    <th style="width: 10%;">
    Parameter name</th>
    <th style="width: 10%;">
    Patameter type</th>
    <th style="width: 60%;">
    Parameter description</th>
  </tr>
  <tr>
    <td><b>name</b></td>
    <td>string</td>
    <td>part of users' name</td>
  </tr>
  <tr>
    <td><b>phone</b></td>
    <td>string</td>
    <td>part of users' phone</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'GET' \
    'api/v1/users' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```

**Response body**
```sh
    [{
        "id": "d9b1d7e3-f9c2-4efc-a5b0-33ed95b47226",
        "phone": "54332141234"
        "name": "Alice Johnson",
        "bio": "Hello, I am Alice Johnson",
        "picturePath": "/pictures/AliceJohnson.png"
    },
    {
        "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        "phone": "89532485342"
        "name": "Bob Smith",
        "bio": "Hello, I am Bob Smith",
        "picturePath": "/pictures/BobSmith.png"
    }
    ]
```

***
#### GET `api/v1/users/{userId}`
**Purpose:** Get a user by ID. 

**Request headers:**

<table border=3>
<tr>
  <th style="width:20%;">Header name</th>
  <th>Header value</th>
  </tr>

  <tr>
  <td>Authorization</th>
  <td>Access token generated for user.</td>
  </tr>
</table>

**Request body:**

Empty

**Responses:**

<table border=3>
    <tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>200</th>
  <td>Returns one user record, which includes id, name, phone, bio, profile picture URL.</td>
  </tr>

  <tr>
  <td>404</th>
  <td>There is no such user found.</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'GET' \
    'api/v1/users/8a9e4d28-fb9b-4f80-b25c-7b93e8c1c1e4' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```

**Response body**
```sh
    {
    "id": "8a9e4d28-fb9b-4f80-b25c-7b93e8c1c1e4",
    "name": "Liam O'Connor",
    "phone": "324523461234"
    "bio": "Hello, I am Liam O'Connor",
    "picturePath": "/pictures/LiamO'Connor.png"
    }
```

***
#### GET `api/v1/users/{userId}/animals`
**Purpose:** Get user's animals by user's ID. 

**Request headers:**

<table border=3>
<tr>
  <th style="width:20%;">Header name</th>
  <th>Header value</th>
  </tr>

  <tr>
  <td>Authorization</th>
  <td>Access token generated for user.</td>
  </tr>
</table>

**Request body:**

Empty

**Responses:**

<table border=3>
    <tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>200</th>
  <td>Returns animal records, which include id, owner id, name, bio, sex, species, breed, date of birth, photo.</td>
  </tr>

  <tr>
  <td>404</th>
  <td>There is no such user found.</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'GET' \
    'api/v1/users/8a9e4d28-fb9b-4f80-b25c-7b93e8c1c1e4/animals' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```

**Response body**
```sh
    [{
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "ownerId": "987e6543-e21b-32d1-b654-426614174000",
      "name": "Buddy",
      "bio": "Friendly golden retriever",
      "sex": "M",
      "species": "dog",
      "breed": "Golden Retriever",
      "dateOfBirth": "2018-05-10",
      "photo": "/images/animals/123e4567-e89b-12d3-a456-426614174000.jpg"
    },
    {
      "id": "123e4567-e89b-12d3-a456-426614174001",
      "ownerId": "987e6543-e21b-32d1-b654-426614174001",
      "name": "Whiskers",
      "bio": "Loves to chase mice",
      "sex": "F",
      "species": "cat",
      "breed": "Siamese",
      "dateOfBirth": "2017-09-15",
      "photo": "/images/animals/123e4567-e89b-12d3-a456-426614174001.jpg"
    }]
```


***
#### POST `api/v1/users` 

**Purpose:** Create new user record and put it to the DB.

**Request headers:**

<table border=3>
<tr>
  <th style="width:20%;">Header name</th>
  <th>Header value</th>
  </tr>

  <tr>
  <td>Authorization</th>
  <td>Access token generated for user.</td>
  </tr>
  <tr>
  <td>Content-Type</th>
  <td>application/json</td>
  </tr>
</table>

**Request body:**

User object with name, phone, bio, password.

**Responses:**

<table border=3>
    <tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>201</th>
  <td>New user created and their record with ID is returned.</td>
  </tr>

  <tr>
  <td>400</th>
  <td>User object misses fields or their data is invalid.</td>
  </tr>

  <tr>
  <td>409</th>
  <td>There is already a user with such a phone.</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'POST' \
    'api/v1/users' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
    -H 'Content-Type: application/json' \
    -d '{
    "name": "Sophia Lee",
    "phone": "751234234213"
    "password": "password789",
    "bio": "Hello, I am Sophia Lee",
    "picturePath": "/pictures/SophiaLee.png"
    }'
```

**Response body**
```sh
    {
        "id": "e6b7b6d5-8e54-4f56-9d8e-3b8a1c64e5c3",
        "name": "Sophia Lee",
        "phone": "751234234213"
        "bio": "Hello, I am Sophia Lee",
        "picturePath": "/pictures/SophiaLee.png"
    }
```

***
#### PUT `api/v1/users/{userId}` 

**Purpose:** Update record about a user in the DB.

**Request headers:**

<table border=3>
<tr>
  <th style="width:20%;">Header name</th>
  <th>Header value</th>
  </tr>

  <tr>
  <td>Authorization</th>
  <td>Access token generated for user.</td>
  </tr>
</table>

**Request body:**

Object with user's ID and updated information needed for a user.

**Responses:**

<table border=3>
    <tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>200</th>
  <td>User is updated and their updated record is returned.</td>
  </tr>

  <tr>
  <td>204</th>
  <td>ID is valid, but there is no data in request body to update.</td>

  <tr>
  <td>400</th>
  <td>Some of updated data is invalid.</td>
  </tr>

  <tr>
  <td>404</th>
  <td>User with specified ID was not found.</td>
  </tr>

  <tr>
  <td>409</th>
  <td>Unique phone constraint is violated.</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'PUT' \
    'api/v1/users/a1c2e3d4-5f67-8a9b-0cde-1f23456789ab' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
    -H 'Content-Type: application/json' \
    -d '{
        "name": "Jackson Smith",
    }'
```

**Response body**
```sh
    {
        "id": "a1c2e3d4-5f67-8a9b-0cde-1f23456789ab",
        "name": "Jackson Smith",
        "phone": "213412384213",
        "bio": "Hello, I am Jackson Smith",
        "picturePath": "/pictures/JacksonSmith.png"
    }
```

***
#### DELETE `api/v1/users/{userId}` 

**Purpose:** Delete record about a user from the DB.

**Request headers:**

<table border=3>
<tr>
  <th style="width:20%;">Header name</th>
  <th>Header value</th>
  </tr>

  <tr>
  <td>Authorization</th>
  <td>Access token generated for user.</td>
  </tr>
</table>

**Request body:**

Empty

**Responses:**

<table border=3>
    <tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>204</th>
  <td>User is deleted, nothing is returned.</td>
  </tr>

  <tr>
  <td>404</th>
  <td>User with specified ID was not found.</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'DELETE' \
    'api/v1/users/b3d4e5f6-7a8b-9c0d-1e2f-3g456h789i0j' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```

**Response body**
```sh
    Empty
```

### 3. Endpoint `api/v1/animals/`:

***
#### GET `api/v1/animals`
**Purpose:** Get all animals.

**Request headers:**

<table border=3>
<tr>
  <th style="width:20%;">Header name</th>
  <th>Header value</th>
  </tr>

  <tr>
  <td>Authorization</th>
  <td>Access token generated for user.</td>
  </tr>
</table>

**Request body:**

Empty

**Responses:**

<table border=3>
<tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>200</th>
  <td>Returns all animals records, which include id, owner id, name, bio, sex, species, breed, date of birth, photo.</td>
  </tr>
</table>

**Query Parameters**:

<table border=3>
  <tr>
    <th style="width: 10%;">
    Parameter name</th>
    <th style="width: 10%;">
    Patameter type</th>
    <th style="width: 60%;">
    Parameter description</th>
  </tr>
  <tr>
    <td><b>name</b></td>
    <td>string</td>
    <td>part of animals' name</td>
  </tr>
  <tr>
    <td><b>sex</b></td>
    <td>string</td>
    <td>animals' sex</td>
  </tr>
  <tr>
    <td><b>species</b></td>
    <td>string</td>
    <td>animals' species</td>
  </tr>
  <tr>
    <td><b>breed</b></td>
    <td>string</td>
    <td>animals' breed</td>
  </tr>
  <tr>
    <td><b>bio</b></td>
    <td>string</td>
    <td>part of animals' bio</td>
  </tr>
  <tr>
    <td><b>bornBefore</b></td>
    <td>string</td>
    <td>date before which animals were born</td>
  </tr>
  <tr>
    <td><b>bornAfter</b></td>
    <td>string</td>
    <td>date after which animals were born</td>
  </tr>
  <tr>
    <td><b>hasPhoto</b></td>
    <td>boolean</td>
    <td>records which</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'GET' \
    'api/v1/animals' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```

**Response body**
```sh
    [{
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "ownerId": "987e6543-e21b-32d1-b654-426614174000",
      "name": "Buddy",
      "bio": "Friendly golden retriever",
      "sex": "M",
      "species": "dog",
      "breed": "Golden Retriever",
      "dateOfBirth": "2018-05-10",
      "photo": "/images/animals/123e4567-e89b-12d3-a456-426614174000.jpg"
    },
    {
      "id": "123e4567-e89b-12d3-a456-426614174001",
      "ownerId": "987e6543-e21b-32d1-b654-426614174001",
      "name": "Whiskers",
      "bio": "Loves to chase mice",
      "sex": "F",
      "species": "cat",
      "breed": "Siamese",
      "dateOfBirth": "2017-09-15",
      "photo": "/images/animals/123e4567-e89b-12d3-a456-426614174001.jpg"
    }]
```

***
#### GET `api/v1/animals/{animalId}`
**Purpose:** Get an animal by ID. 

**Request headers:**

<table border=3>
<tr>
  <th style="width:20%;">Header name</th>
  <th>Header value</th>
  </tr>

  <tr>
  <td>Authorization</th>
  <td>Access token generated for user.</td>
  </tr>
</table>

**Request body:**

Empty

**Responses:**

<table border=3>
    <tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>200</th>
  <td>Returns one animal record, which includes id, owner id, name, bio, sex, species, breed, date of birth, photo.</td>
  </tr>

  <tr>
  <td>404</th>
  <td>There is no such animal found.</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'GET' \
    'api/v1/animals/123e4567-e89b-12d3-a456-426614174000' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```

**Response body**
```sh
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "ownerId": "987e6543-e21b-32d1-b654-426614174000",
      "name": "Buddy",
      "bio": "Friendly golden retriever",
      "sex": "M",
      "species": "dog",
      "breed": "Golden Retriever",
      "dateOfBirth": "2018-05-10",
      "photo": "/images/animals/123e4567-e89b-12d3-a456-426614174000.jpg"
    }
```

***
#### GET `api/v1/animals/{animalId}/photos`
**Purpose:** Get animal photos by its ID. 

**Request headers:**

<table border=3>
<tr>
  <th style="width:20%;">Header name</th>
  <th>Header value</th>
  </tr>

  <tr>
  <td>Authorization</th>
  <td>Access token generated for user.</td>
  </tr>
</table>

**Request body:**

Empty

**Responses:**

<table border=3>
    <tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>200</th>
  <td>Returns photo URLs for animal's photos.</td>
  </tr>

  <tr>
  <td>404</th>
  <td>There is no such animal found.</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'GET' \
    'api/v1/animals/123e4567-e89b-12d3-a456-426614174000/photos' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```

**Response body**
```sh
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "animalId": "987e6543-e21b-32d1-b654-426614174000",
    "photoURL": "/images/animals/123e4567-e89b-12d3-a456-426614174000.jpg",
    "uploadedAt": "28.09.2023 14:51:17"
  },
  {
    "id": "223e4567-e89b-12d3-a456-426614174111",
    "animalId": "987e6543-e21b-32d1-b654-426614174000",
    "photoURL": "/images/animals/223e4567-e89b-12d3-a456-426614174111.jpg",
    "uploadedAt": "29.09.2023 10:35:12"
  }
]
```

***
#### GET `api/v1/animals/{animalId}/documents`
**Purpose:** Get animal documents by its ID. 

**Request headers:**

<table border=3>
<tr>
  <th style="width:20%;">Header name</th>
  <th>Header value</th>
  </tr>

  <tr>
  <td>Authorization</th>
  <td>Access token generated for user.</td>
  </tr>
</table>

**Request body:**

Empty

**Responses:**

<table border=3>
    <tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>200</th>
  <td>Returns document URLs for animal's documents.</td>
  </tr>

  <tr>
  <td>404</th>
  <td>There is no such animal found.</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'GET' \
    'api/v1/animals/123e4567-e89b-12d3-a456-426614174000/documents' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```

**Response body**
```sh
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "animalId": "987e6543-e21b-32d1-b654-426614174000",
    "name": "Passport",
    "documentURL": "/documents/animals/document1.pdf",
    "uploadedAt": "28.09.2023 14:51:17"
  },
  {
    "id": "223e4567-e89b-12d3-a456-426614174111",
    "animalId": "987e6543-e21b-32d1-b654-426614174000",
    "name": "Diploma",
    "documentURL": "/documents/animals/document2.pdf",
    "uploadedAt": "29.09.2023 10:35:12"
  }
]
```

***
#### GET `api/v1/animals/{animalId}/pedigree`
**Purpose:** Get animal pedigree by animal's ID. 

**Request headers:**

<table border=3>
<tr>
  <th style="width:20%;">Header name</th>
  <th>Header value</th>
  </tr>

  <tr>
  <td>Authorization</th>
  <td>Access token generated for user.</td>
  </tr>
</table>

**Request body:**

Empty

**Responses:**

<table border=3>
    <tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>200</th>
  <td>Returns URL for animal's pedigree copy and GEDCOM file.</td>
  </tr>

  <tr>
  <td>404</th>
  <td>There is no such animal found.</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'GET' \
    'api/v1/animals/123e4567-e89b-12d3-a456-426614174000/pedigree' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```

**Response body**
```sh
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "animalId": "987e6543-e21b-32d1-b654-426614174000",
    "name": "Passport",
    "pedigreeURL": "/gedcoms/animals/123e4567-e89b-12d3-a456-426614174000.ged",
    "copyURL": "/pedigrees/animals/123e4567-e89b-12d3-a456-426614174000_pedigree.pdf"
  }
```

***
#### POST `api/v1/animals` 

**Purpose:** Create a new animal record and put it to the DB.

**Request headers:**

<table border=3>
<tr>
  <th style="width:20%;">Header name</th>
  <th>Header value</th>
  </tr>

  <tr>
  <td>Authorization</th>
  <td>Access token generated for user.</td>
  </tr>
  <tr>
  <td>Content-Type</th>
  <td>application/json</td>
  </tr>
</table>

**Request body:**

Animal object with owner id, name, bio, sex, species, breed, date of birth.

**Responses:**

<table border=3>
    <tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>201</th>
  <td>New animal created and their record with ID is returned.</td>
  </tr>

  <tr>
  <td>400</th>
  <td>Animal object misses fields or their data is invalid.</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'POST' \
    'api/v1/animals' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
    -H 'Content-Type: application/json' \
    -d '{
      "ownerId": "987e6543-e21b-32d1-b654-426614174000",
      "name": "Buddy",
      "bio": "Friendly golden retriever",
      "sex": "M",
      "species": "dog",
      "breed": "Golden Retriever",
      "dateOfBirth": "2018-05-10",
      "photo": "/images/animals/123e4567-e89b-12d3-a456-426614174000.jpg"
    }'
```

**Response body**
```sh
    {
      "id": "e6b7b6d5-8e54-4f56-9d8e-3b8a1c64e5c3",
      "ownerId": "987e6543-e21b-32d1-b654-426614174000",
      "name": "Buddy",
      "bio": "Friendly golden retriever",
      "sex": "M",
      "species": "dog",
      "breed": "Golden Retriever",
      "dateOfBirth": "2018-05-10",
      "photo": "/images/animals/123e4567-e89b-12d3-a456-426614174000.jpg"
    }
```

***
#### PUT `api/v1/animals/{animalId}` 

**Purpose:** Update record about a user in the DB.

**Request headers:**

<table border=3>
<tr>
  <th style="width:20%;">Header name</th>
  <th>Header value</th>
  </tr>

  <tr>
  <td>Authorization</th>
  <td>Access token generated for user.</td>
  </tr>
</table>

**Request body:**

Object with animal's ID and updated information needed for an animal.

**Responses:**

<table border=3>
    <tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>200</th>
  <td>Animal is updated and their updated record is returned.</td>
  </tr>

  <tr>
  <td>204</th>
  <td>ID is valid, but there is no data in request body to update.</td>

  <tr>
  <td>400</th>
  <td>Some of updated data is invalid.</td>
  </tr>

  <tr>
  <td>404</th>
  <td>Animal with specified ID was not found.</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'PUT' \
    'api/v1/animals/e6b7b6d5-8e54-4f56-9d8e-3b8a1c64e5c3' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
    -H 'Content-Type: application/json' \
    -d '{
        "name": "Blacky",
    }'
```

**Response body**
```sh
    {
      "id": "e6b7b6d5-8e54-4f56-9d8e-3b8a1c64e5c3",
      "ownerId": "987e6543-e21b-32d1-b654-426614174000",
      "name": "Blacky",
      "bio": "Friendly golden retriever",
      "sex": "M",
      "species": "dog",
      "breed": "Golden Retriever",
      "dateOfBirth": "2018-05-10",
      "photo": "/images/animals/123e4567-e89b-12d3-a456-426614174000.jpg"
    }
```

***
#### DELETE `api/v1/animals/{animalId}` 

**Purpose:** Delete record about an animal from the DB.

**Request headers:**

<table border=3>
<tr>
  <th style="width:20%;">Header name</th>
  <th>Header value</th>
  </tr>

  <tr>
  <td>Authorization</th>
  <td>Access token generated for user.</td>
  </tr>
</table>

**Request body:**

Empty

**Responses:**

<table border=3>
    <tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>204</th>
  <td>Animal is deleted, nothing is returned.</td>
  </tr>

  <tr>
  <td>404</th>
  <td>Animal with specified ID was not found.</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'DELETE' \
    'api/v1/animals/b3d4e5f6-7a8b-9c0d-1e2f-3g456h789i0j' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```

**Response body**
```sh
    Empty
```


