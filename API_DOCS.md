# API Documentation

## Description
This project is an app for animal breeders. The application has the functionality to add, update, delete, and get information about appointments, patients, doctors, their specializations, symptoms, and organs they work with. App supports authorization using JWT (JSON Web Token).

## Technical Requirements
- **Programming Language**: JavaScript
- **Backend Framework**: Express.js
- **Frontend Framework**: React.js
- **Database**: PostgreSQL
- **Containerization**: Docker

## Base URL
`http://localhost:3000`

## API Endpoints

### 1. Endpoint `api/v1/authorization/`:

***
#### POST `api/v1/authorization/login`
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
  <td>Phone number or password are not correct.</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'POST' \
    'api/v1/authorization/login' \
    -H 'Content-Type: application/json' \
    -d '{
        "phone": "6667778882",
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
#### POST `api/v1/authorization/refresh`
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
    'api/v1/authorization/refresh' \
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
  <td>Returns all user records, which include id, phone, first name, last name, age and sex.</td>
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
    <td><b>firstName</b></td>
    <td>string</td>
    <td>part of users' first name</td>
  </tr>
  <tr>
    <td><b>lastName</b></td>
    <td>string</td>
    <td>part of users' last name</td>
  </tr>
  <tr>
    <td><b>minAge</b></td>
    <td>integer</td>
    <td>bottom border for users' age</td>
  </tr>
  <tr>
    <td><b>maxAge</b></td>
    <td>integer</td>
    <td>top border for users' age</td>
  </tr>
  <tr>
    <td><b>sex</b></td>
    <td>string</td>
    <td>user's sex</td>
  </tr>
  <tr>
    <td><b>phone</b></td>
    <td>string</td>
    <td>part of users' phone number</td>
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
        "phone": "+1-555-123-4567",
        "firstName": "Alice",
        "lastName": "Johnson",
        "age": 26,
        "sex": "F",
    },
    {
        "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        "phone": "+1-555-456-7890",
        "firstName": "Bob",
        "lastName": "Smith",
        "age": 30,
        "sex": "M"
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
  <td>Returns one user record, which includes id, phone, first name, last name, age and sex.</td>
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
    "firstName": "Liam",
    "lastName": "O'Connor",
    "age": 34,
    "sex": "M",
    "phone": "+1-555-567-8901"
    }
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

User object with first name, last name, age, sex, password.

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
  <td>There is already a user with such a phone number.</td>
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
        "firstName": "Sophia",
        "lastName": "Lee",
        "age": 19,
        "sex": "F",
        "password": "password789",
        "phone": "+1-555-678-9012"
    }'
```

**Response body**
```sh
    {
        "id": "e6b7b6d5-8e54-4f56-9d8e-3b8a1c64e5c3",
        "firstName": "Sophia",
        "lastName": "Lee",
        "age": 19,
        "sex": "F",
        "phone": "+1-555-678-9012"
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
  <td>Unique phone number constraint is violated.</td>
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
        "firstName": "Jackson",
    }'
```

**Response body**
```sh
    {
        "id": "a1c2e3d4-5f67-8a9b-0cde-1f23456789ab",
        "firstName": "Jackson",
        "lastName": "Smith",
        "age": 22,
        "sex": "M",
        "phone": "+1-555-789-0123"
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

### 3. Endpoint `api/v1/patients/`:

***
#### GET `api/v1/patients`

**Purpose:** Get all patients.

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
  <td>Returns all patient records, which include user or their id, insurance number and provider name.</td>
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
    <td><b>insuranceNumber</b></td>
    <td>string</td>
    <td>part of patient's insurance number</td>
  </tr>
  <tr>
    <td><b>insuranceProvider</b></td>
    <td>string</td>
    <td>part of patient's insurance provider name</td>
  </tr>
  <tr>
    <td><b>nestUser</b></td>
    <td>boolean</td>
    <td>true if returned patient object should include nested user record, false if only id</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'GET' \
    'api/v1/patients' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```

**Response body**
```sh
    [{
        "user": {"id":"a3b9c5d7-8e2f-4a6b-9c3d-8e2f7a9b0c1d"},
        "insuranceNumber": "INS123456789",
        "insuranceProvider": "HealthPlus"
    },
    {
        "user": {"id":"b4c8d6e1-9f2a-4b7c-8d9e-0a1b2c3d4e5f"},
        "insuranceNumber": "INS987654321",
        "insuranceProvider": "CareCo"
    }]
```
***
#### GET `api/v1/patients/{patientId}` 

**Purpose:** Get a patient by ID.

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
  <td>Returns one patient record, which includes user id or record, insurance number and insurance provider name.</td>
  </tr>

  <tr>
  <td>404</th>
  <td>There is no such patient found.</td>
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
    <td><b>nestUser</b></td>
    <td>boolean</td>
    <td>true if returned patient object should include nested user record, false if only id</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'GET' \
    'api/v1/patients/f9d4a1b2-3c56-4d78-a9b0-1e2f3c4d5e6f' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```
**Response body**
```sh
    {
    "user": {"id":"f9d4a1b2-3c56-4d78-a9b0-1e2f3c4d5e6f"},
    "insuranceNumber": "INS456789012",
    "insuranceProvider": "MedCare"
    }
```
***
#### POST `api/v1/patients` 

**Purpose:** Create new patient record for user and put it to the DB.

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

Patient object with information needed for a new patient, such as user's id, insurance number, insurance provider name.

**Responses:**

<table border=3>
    <tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>201</th>
  <td>New patient record created for user and their record is returned.</td>
  </tr>

  <tr>
  <td>400</th>
  <td>Patient object misses fields or their data is invalid.</td>
  </tr>

  <tr>
  <td>409</th>
  <td>There is already a patient record for this user.</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'POST' \
    'api/v1/patients' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
    -H 'Content-Type: application/json' \
    -d '{
        "userId": "b5e1c7d8-9f0a-4b2c-8d1e-2f3a4b5c6d7e",
        "insuranceNumber": "INS234567890",
        "insuranceProvider": "SecureHealth"
    }'
```
**Response body**
```sh
    {
        "user": {"id":"b5e1c7d8-9f0a-4b2c-8d1e-2f3a4b5c6d7e"},
        "insuranceNumber": "INS234567890",
        "insuranceProvider": "SecureHealth"
    }
```
***
#### PUT `api/v1/patients/{patientId}`

**Purpose:** Update record about a patient in the DB.

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

Object with patient's ID and updated information needed for a patient.

**Responses:**

<table border=3>
    <tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>200</th>
  <td>Patient is updated and their updated record is returned.</td>
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
  <td>User or patient record for the specified ID was not found.</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'PUT' \
    'api/v1/patients/d7e9c8f2-5a3b-4d6e-8f1a-9b0c2d3e4f5g' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
    -H 'Content-Type: application/json' \
    -d '{
        "insuranceNumber": "INS345678901",
        "insuranceProvider": "PrimeCare"
    }'
```
**Response body**
```sh
    {
        "user": {"id":"d7e9c8f2-5a3b-4d6e-8f1a-9b0c2d3e4f5g"},
        "insuranceNumber": "INS345678901",
        "insuranceProvider": "PrimeCare"
    }
```
***
#### DELETE `api/v1/patients/{patientId}` 

**Purpose:** Delete record about a patient from the DB.

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
  <td>Patient record is deleted, nothing is returned.</td>
  </tr>

  <tr>
  <td>404</th>
  <td>User or their patient record for the specified ID was not found.</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'DELETE' \
    'api/v1/patients/e8f7d6b2-4c9a-1d0e-8f3b-5a6c7d8e9f0g' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```

**Response body**
```sh
    Empty
```

### 4. Endpoint `api/v1/symptoms/`:

***
#### GET `api/v1/symptoms` 

**Purpose:** Get all symptoms.

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
  <td>Returns all symptom records, which include id, name and description.</td>
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
    <td>part of symptom's name</td>
  </tr>
  <tr>
    <td><b>description</b></td>
    <td>string</td>
    <td>part of symptom's description</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'GET' \
    'api/v1/symptoms' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```
**Response body**
```sh
    [
    {
        "id": 1,
        "name": "Headache",
        "description": "A continuous pain in the head."
    },
    {
        "id": 2,
        "name": "Fever",
        "description": "An abnormally high body temperature."
    }
    ]
```
***
#### GET `api/v1/symptoms/{symptomId}`

**Purpose:** Get a symptom by ID.

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
  <td>Returns one symptom record, which includes id, name and description.</td>
  </tr>

  <tr>
  <td>404</th>
  <td>There is no such symptom found.</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'GET' \
    'api/v1/symptoms/1' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```

**Response body**
```sh
    {
        "id": 1,
        "name": "Headache",
        "description": "A continuous pain in the head."
    }
```
***
#### POST `api/v1/symptoms` 

**Purpose:** Create new symptom record and put it to the DB.

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

Symptom object with information needed for a new symptom, such as name and description.

**Responses:**

<table border=3>
    <tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>201</th>
  <td>New symptom record created and its record is returned.</td>
  </tr>

  <tr>
  <td>400</th>
  <td>Symptom object misses fields or its data is invalid.</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'POST' \
    'api/v1/symptoms' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
    -H 'Content-Type: application/json' \
    -d '{
        "name": "Cough",
        "description": "A sudden, forceful hacking sound to release air and clear an irritation in the throat or airway.",
    }'
```
**Response body**
```sh
    {
        "id": 3,
        "name": "Cough",
        "description": "A sudden, forceful hacking sound to release air and clear an irritation in the throat or airway.",
    }
```

***
#### PUT `api/v1/symptoms/{symptomId}` 

**Purpose:** Update record about a symptom in the DB.

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

Object with symptom's ID and updated information needed for a symptom.

**Responses:**

<table border=3>
    <tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>200</th>
  <td>Symptom is updated and its updated record is returned.</td>
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
  <td>Symptom record for the specified ID was not found.</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'PUT' \
    'api/v1/symptoms/4' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
    -H 'Content-Type: application/json' \
    -d '{
        "name": "Fatigue",
        "description": "A feeling of extreme tiredness and lack of energy.",
    }'
```
**Response body**
```sh
    {
        "id": 1,
        "name": "Fatigue",
        "description": "A feeling of extreme tiredness and lack of energy.",
    }
```

***
#### DELETE `api/v1/symptoms/{symptomId}`

**Purpose:** Delete record about a symptom from the DB.

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
  <td>Symptom record is deleted, nothing is returned.</td>
  </tr>

  <tr>
  <td>404</th>
  <td>Symptom record for the specified ID was not found.</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'DELETE' \
    'api/v1/symptoms/1' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```

**Response body**
```sh
    Empty
```

### 5. Endpoint `api/v1/organs/`:

***
#### GET `api/v1/organs` 

**Purpose:** Get all organs.

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
  <td>Returns all organ records, which include id, name and description.</td>
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
    <td>part of organ's name</td>
  </tr>
  <tr>
    <td><b>description</b></td>
    <td>string</td>
    <td>part of organ's description</td>
  </tr>
</table>


***Example***

**Request**
```sh
    curl -X 'GET' \
    'api/v1/organs' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```
 ​
**Response body**
```sh
    [{
        "id": 1,
        "name": "Heart",
        "description": "A muscular organ that pumps blood through the circulatory system."
    },
    {
        "id": 2,
        "name": "Lungs",
        "description": "A pair of respiratory organs responsible for inhaling oxygen and exhaling carbon dioxide."
    },]
```
***
#### GET `api/v1/organs/{organId}` 

**Purpose:** Get a organ by ID.

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
  <td>Returns one organ record, which includes id, name and description.</td>
  </tr>

  <tr>
  <td>404</th>
  <td>There is no such organ found.</td>
  </tr>
</table>


***Example***

**Request**
```sh
    curl -X 'GET' \
    'api/v1/organs/1' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```

**Response body**
```sh
    {
        "id": 1,
        "name": "Heart",
        "description": "A muscular organ that pumps blood through the circulatory system.",
    }
```
***
#### POST `api/v1/organs`

**Purpose:** Create new organ record and put it to the DB.

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

Organ object with information needed for a new organ, such as name and description.

**Responses:**

<table border=3>
    <tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>201</th>
  <td>New organ record created and its record is returned.</td>
  </tr>

  <tr>
  <td>400</th>
  <td>Organ object misses fields or its data is invalid.</td>
  </tr>
</table>


***Example***

**Request**
```sh
    curl -X 'POST' \
    'api/v1/organs' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
    -H 'Content-Type: application/json' \
    -d '{
        "name": "Liver",
        "description": "A large organ that processes nutrients, detoxifies harmful substances, and produces bile.",
    }'
```
**Response body**
```sh
    {
        "id": 3,
        "name": "Liver",
        "description": "A large organ that processes nutrients, detoxifies harmful substances, and produces bile."
    },
```
***
#### PUT `api/v1/organs/{organId}` 

**Purpose:** Update record about an organ in the DB.

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

Object with organ's ID and updated information needed for an organ.

**Responses:**

<table border=3>
    <tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>200</th>
  <td>Organ is updated and its updated record is returned.</td>
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
  <td>Organ record for the specified ID was not found.</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'PUT' \
    'api/v1/organs/4' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
    -H 'Content-Type: application/json' \
    -d '{
        "name": "Kidneys",
        "description": "A pair of organs that filter blood to remove waste and excess fluid, forming urine.",
    }'
```
**Response body**
```sh
    {
        "id": 4,
        "name": "Kidneys",
        "description": "A pair of organs that filter blood to remove waste and excess fluid, forming urine.",
    }
```
***
#### DELETE `api/v1/organs/{organId}` 

**Purpose:** Delete record about an organ from the DB.

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
  <td>Organ record is deleted, nothing is returned.</td>
  </tr>

  <tr>
  <td>404</th>
  <td>Organ record for the specified ID was not found.</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'DELETE' \
    'api/v1/organs/1' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```

**Response body**
```sh
    Empty
```

### 6. Endpoint `api/v1/specializations/`:

***
#### GET `api/v1/specializations` 

**Purpose:** Get all specializations.

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
  <td>Returns all specialization records, which include id, name and description.</td>
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
    <td>part of specialization's name</td>
  </tr>
  <tr>
    <td><b>description</b></td>
    <td>string</td>
    <td>part of specialization's description</td>
  </tr>
  <tr>
    <td><b>nestOrgans</b></td>
    <td>boolean</td>
    <td>true if returned specialization object should include organs' whole objects, false if only ids</td>
  </tr>
  <tr>
    <td><b>nestSymptoms</b></td>
    <td>boolean</td>
    <td>true if returned specialization object should include symptoms' whole objects, false if only ids</td>
  </tr>
  <tr>
    <td><b>symptomId</b></td>
    <td>number</td>
    <td>Id of symptom specialization should include</td>
  </tr>
  <tr>
    <td><b>organId</b></td>
    <td>number</td>
    <td>Id of organ specialization should include</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'GET' \
    'api/v1/specializations' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```
 ​
**Response body**
```sh
    [{
        "id": 1,
        "name": "Cardiologist",
        "description": "A doctor who specializes in diagnosing and treating heart conditions.",
        "organs": [1],
        "symptoms": [1, 4]
    },
    {
        "id": 2,
        "name": "Pulmonologist",
        "description": "A doctor who specializes in diagnosing and treating lung conditions.",
        "organs": [2],
        "symptoms": [2, 3]
    }]
```
***
#### GET `api/v1/specializations/{specializationId}` 

**Purpose:** Get a specialization by ID.

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
  <td>Returns one specialization record, which includes id, name and description.</td>
  </tr>

  <tr>
  <td>404</th>
  <td>There is no such specialization found.</td>
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
    <td><b>nestOrgans</b></td>
    <td>boolean</td>
    <td>true if returned specialization object should include organs' whole objects, false if only ids</td>
  </tr>
   <tr>
    <td><b>nestSymptoms</b></td>
    <td>boolean</td>
    <td>true if returned specialization object should include symptoms' whole objects, false if only ids</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'GET' \
    'api/v1/specializations/1' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```

**Response body**
```sh
    {
        "id": 1,
        "name": "Cardiologist",
        "description": "A doctor who specializes in diagnosing and treating heart conditions.",
        "organs": [1],
        "symptoms": [1, 4]
    }
```
***
#### POST `api/v1/specializations`

**Purpose:** Create new specialization record and put it to the DB.

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

Specialization object with information needed for a new specialization, such as name and description.

**Responses:**

<table border=3>
    <tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>201</th>
  <td>New specialization record created and its record is returned.</td>
  </tr>

  <tr>
  <td>400</th>
  <td>Specialization object misses fields or its data is invalid.</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'POST' \
    'api/v1/specializations' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
    -H 'Content-Type: application/json' \
    -d '{
        "name": "Nephrologist",
        "description": "A doctor who specializes in diagnosing and treating kidney conditions.",
        "organs": [4],
        "symptoms": [4, 5],
    }'
```
**Response body**
```sh
    {
        "id": 3,
        "name": "string",
        "description": "string",
    }
```
***
#### PUT `api/v1/specializations/{specializationId}` 

**Purpose:** Update record about a specialization in the DB.

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

Object with specialization's ID and updated information needed for a specialization.

**Responses:**

<table border=3>
    <tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>200</th>
  <td>Specialization is updated and its updated record is returned.</td>
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
  <td>Specialization record for the specified ID was not found.</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'PUT' \
    'api/v1/specializations/4' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
    -H 'Content-Type: application/json' \
    -d '{
        "name": "Gastroenterologist",
        "description": "A doctor who specializes in diagnosing and treating stomach and digestive system conditions.",
        "organs": [5],
        "symptoms": [4, 5]
    }'
```
**Response body**
```sh
    {
        "id": 4,
        "name": "Gastroenterologist",
        "description": "A doctor who specializes in diagnosing and treating stomach and digestive system conditions.",
        "organs": [5],
        "symptoms": [4, 5]
    }
```
***
#### DELETE `api/v1/specializations/{specializationId}` 

**Purpose:** Delete record about a specialization from the DB.

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
  <td>Specialization record is deleted, nothing is returned.</td>
  </tr>

  <tr>
  <td>404</th>
  <td>Specialization record for the specified ID was not found.</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'DELETE' \
    'api/v1/specializations/1' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```

**Response body**
```sh
    Empty
```

### 7. Endpoint `api/v1/doctors/`:

***
#### GET `api/v1/doctors`

**Purpose:** Get all doctors.

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
  <td>Returns all doctor records, which include user or their id, specialization or its id, patient load, start time of workday, end time of workday.</td>
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
    <td><b>specializationId</b></td>
    <td>integer</td>
    <td>doctor's specialization id</td>
  </tr>
  <tr>
    <td><b>nestUser</b></td>
    <td>boolean</td>
    <td>true if returned doctor object should include nested user record, false if only id</td>
  </tr>

  <tr>
    <td><b>nestSpecialization</b></td>
    <td>boolean</td>
    <td>true if returned doctor object should include nested specialization record, false if only id</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'GET' \
    'api/v1/doctors' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```

**Response body**
```sh
    [{
        "user": {"id":"123e4567-e89b-12d3-a456-426614174000"},
        "specialization": {"id":3},
        "patientLoad": 1,
        "workdayStart": "08:00:00",
        "workdayEnd": "18:00:00"
    },
    {
        "user": {"id":"123e4567-e89b-12d3-a456-426614174001"},
        "specialization": {"id":1},
        "patientLoad": 5,
        "workdayStart": "08:00:00",
        "workdayEnd": "17:00:00"
    }]
```
***
#### GET `api/v1/doctors/{doctorId}` 

**Purpose:** Get a doctor by ID.

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
  <td>Returns one doctor record, which includes user id or record, specialization or its id, patient load, start time of workday, end time of workday.</td>
  </tr>

  <tr>
  <td>404</th>
  <td>There is no such doctor found.</td>
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
    <td><b>nestUser</b></td>
    <td>boolean</td>
    <td>true if returned doctor object should include nested user record, false if only id</td>
  </tr>
  <tr>
    <td><b>nestSpecialization</b></td>
    <td>boolean</td>
    <td>true if returned doctor object should include nested specialization record, false if only id</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'GET' \
    'api/v1/doctors/123e4567-e89b-12d3-a456-426614174002' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```
**Response body**
```sh
    {
        "user":{"id":"123e4567-e89b-12d3-a456-426614174002"} ,
        "specialization": {"id":2},
        "patientLoad": 3,
        "workdayStart": "09:00:00",
        "workdayEnd": "18:00:00"
    }
```
***
#### POST `api/v1/doctors` 

**Purpose:** Create new doctor record for user and put it to the DB.

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

Doctor object which includes user or their id, specialization or its id, patient load, start time of workday, end time of workday.

**Responses:**

<table border=3>
    <tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>201</th>
  <td>New doctor record created for user and their record is returned.</td>
  </tr>

  <tr>
  <td>400</th>
  <td>Doctor object misses fields or their data is invalid.</td>
  </tr>

  <tr>
  <td>409</th>
  <td>There is already a doctor record for this user.</td>
  </tr>
</table>


***Example***

**Request**
```sh
    curl -X 'POST' \
    'api/v1/doctors' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
    -H 'Content-Type: application/json' \
    -d '{
        "userId": "123e4567-e89b-12d3-a456-426614174003",
        "specializationId": 4,
        "patientLoad": 4,
        "workdayStart": "08:30:00",
        "workdayEnd": "17:30:00"
    }'
```
**Response body**
```sh
    {
        "user": {"id":"123e4567-e89b-12d3-a456-426614174003"},
        "specialization": {"id":4},
        "patientLoad": 4,
        "workdayStart": "08:30:00",
        "workdayEnd": "17:30:00"
    }
```
***
#### PUT `api/v1/doctors/{doctorId}`

**Purpose:** Update record about a doctor in the DB.

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

Object with doctor's ID and updated information needed for a doctor.

**Responses:**

<table border=3>
    <tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>200</th>
  <td>Doctor is updated and their updated record is returned.</td>
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
  <td>User or doctor record for the specified ID was not found.</td>
  </tr>
</table>


***Example***

**Request**
```sh
    curl -X 'PUT' \
    'api/v1/doctors/123e4567-e89b-12d3-a456-426614174004' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
    -H 'Content-Type: application/json' \
    -d '{
        "userId": "123e4567-e89b-12d3-a456-426614174004",
        "specializationId": 5,
        "patientLoad": 2,
        "workdayStart": "07:00:00",
        "workdayEnd": "15:00:00"
    }'
```
**Response body**
```sh
     {
        "user": {"id":"123e4567-e89b-12d3-a456-426614174004"},
        "specialization": {"id":5},
        "patientLoad": 2,
        "workdayStart": "07:00:00",
        "workdayEnd": "15:00:00"
    }
```
***
#### DELETE `api/v1/doctors/{doctorId}` 


**Purpose:** Delete record about a doctor from the DB.

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
  <td>Doctor record is deleted, nothing is returned.</td>
  </tr>

  <tr>
  <td>404</th>
  <td>User or their doctor record for the specified ID was not found.</td>
  </tr>
</table>


***Example***

**Request**
```sh
    curl -X 'DELETE' \
    'api/v1/doctors/123e4567-e89b-12d3-a456-426614174004' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```

**Response body**
```sh
    Empty
```

### 8. Endpoint `/api/v1/appointments`

***
#### GET `/api/v1/appointments`

**Purpose:** Get all appointments.

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
  <td>Returns all appointment records, which include id, patient record or their id, doctor record or their id, appointment time, duration and additional info.</td>
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
    <td><b>patientId</b></td>
    <td>uuid</td>
    <td>ID of the patient who signed up for the appointment</td>
  </tr>
  <tr>
    <td><b>doctorId</b></td>
    <td>uuid</td>
    <td>ID of the doctor who signed up for the appointment</td>
  </tr>
  <tr>
    <td><b>nestDoctor</b></td>
    <td>boolean</td>
    <td>true if returned appointment object should include nested doctor record, false if only id</td>
  </tr>
  <tr>
    <td><b>nestPatient</b></td>
    <td>boolean</td>
    <td>true if returned appointment object should include nested patient record, false if only id</td>
  </tr>
  <tr>
    <td><b>startBefore</b></td>
    <td>string</td>
    <td>time before which appointments occur</td>
  </tr>
  <tr>
    <td><b>startAfter</b></td>
    <td>string</td>
    <td>time after which appointments occur</td>
  </tr>
  <tr>
    <td><b>endBefore</b></td>
    <td>string</td>
    <td>time before which appointments end</td>
  </tr>
  <tr>
    <td><b>endAfter</b></td>
    <td>string</td>
    <td>time after which appointments end</td>
  </tr>

</table>

***Example***

**Request**:
```sh
    curl -X 'GET' \
    '/api/v1/appointments'\
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```
**Response body**
```sh
    [{
        "id": 1,
        "patient":{"id": "123e4567-e89b-12d3-a456-426614174011"},
        "doctor": {"id":"123e4567-e89b-12d3-a456-426614174012"},
        "time": "2024-07-24T09:00:00",
        "duration": "01:00:00",
        "description": "Regular check-up"
    },
    {
        "id": 2,
        "patient":{"id": "123e4567-e89b-12d3-a456-426614174013"},
        "doctor": {"id":"123e4567-e89b-12d3-a456-426614174014"},
        "time": "2024-07-24T10:00:00",
        "duration": "00:30:00",
        "description": "Follow-up visit"
    }] 
```

***
#### GET `api/v1/appointments/{appointmetId}`

**Purpose:** Get an appointment by ID.

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
  <td>Returns one appointment record, which includes id, patient record or their id, doctor record or their id, appointment time, duration and additional info.</td>
  </tr>

  <tr>
  <td>404</th>
  <td>There is no such appointment found.</td>
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
    <td><b>nestDoctor</b></td>
    <td>boolean</td>
    <td>true if returned appointment object should include nested doctor record, false if only id</td>
  </tr>
  <tr>
    <td><b>nestPatient</b></td>
    <td>boolean</td>
    <td>true if returned appointment object should include nested patient record, false if only id</td>
  </tr>
</table>

***Example***

**Request**
```sh
    curl -X 'GET' \
    'api/v1/appointments/1' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```

**Response body**
```sh
    {
        "id": 1,
        "patient": {"id":"123e4567-e89b-12d3-a456-426614174011"},
        "doctor": {"id":"123e4567-e89b-12d3-a456-426614174012"},
        "time": "2024-07-24T09:00:00",
        "duration": "01:00:00",
        "description": "Regular check-up"
    }
```

***
#### POST `api/v1/appointments`

**Purpose:** Create new appointment record and put it to the DB.

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

Appointment record, which includes id, patient record or their id, doctor record or their id, appointment time, duration and additional info.

**Responses:**

<table border=3>
    <tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>201</th>
  <td>New appointment record is created and returned.</td>
  </tr>

  <tr>
  <td>400</th>
  <td>Appointment object misses fields or their data is invalid.</td>
  </tr>

  <tr>
  <td>409</th>
  <td>There is already an appointment record at this time for these doctor and patient.</td>
  </tr>
</table>


***Example***

**Request**
```sh
    curl -X 'POST' \
    'api/v1/appointments' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
    -H 'Content-Type: application/json' \
    -d '{
        "patientId": "123e4567-e89b-12d3-a456-426614174015",
        "doctorId": "123e4567-e89b-12d3-a456-426614174016",
        "time": "2024-07-24T11:00:00",
        "duration": "01:00:00",
        "description": "Consultation for respiratory issues"
    }'
```

**Response body**
```sh
    {
        "id": 3,
        "patient": {"id":"123e4567-e89b-12d3-a456-426614174015"},
        "doctor": {"id":"123e4567-e89b-12d3-a456-426614174016"},
        "time": "2024-07-24T11:00:00",
        "duration": "01:00:00",
        "description": "Consultation for respiratory issues"
    }
```

***
#### PUT `api/v1/appointments/{appointmetId}`

**Purpose:** Update record about an appointment in the DB.

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

Object with appointment's ID and updated information needed for an appointment.

**Responses:**

<table border=3>
    <tr>
  <th style="width:20%;">Status code</th>
  <th>Response</th>
  </tr>

  <tr>
  <td>200</th>
  <td>Appointment is updated and its updated record is returned.</td>
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
  <td>Appointment record for the specified ID was not found.</td>
  </tr>
</table>


***Example***

**Request**
```sh
    curl -X 'PUT' \
    'api/v1/appointments/1' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
    -H 'Content-Type: application/json' \
    -d '{
        "id": 4,
        "patientId": "123e4567-e89b-12d3-a456-426614174017",
        "doctorId": "123e4567-e89b-12d3-a456-426614174018",
        "time": "2024-07-24T12:00:00",
        "duration": "00:45:00",
        "description": "Kidney function tests"
    }'
```
**Response body**
```sh
    {
        "id": 4,
        "patient": {"id":"123e4567-e89b-12d3-a456-426614174017"},
        "doctor": {"id":"123e4567-e89b-12d3-a456-426614174018"},
        "time": "2024-07-24T12:00:00",
        "duration": "00:45:00",
        "description": "Kidney function tests"
    }
```

***
#### DELETE `api/v1/appointments/{appointmetId}`


**Purpose:** Delete record about an appointment from the DB.

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
  <td>Apointment record is deleted, nothing is returned.</td>
  </tr>

  <tr>
  <td>404</th>
  <td>Apointment record for the specified ID was not found.</td>
  </tr>
</table>


***Example***

**Request**
```sh
    curl -X 'DELETE' \
    'api/v1/appointments/1' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMjN9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
```

**Response body**
```sh
    Empty
```
