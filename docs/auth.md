Authentication API Documentation
Base UR# Authentication API Documentation

## Base URL
```
/api/v1/auth
```

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "status": "success",
  "message": "OK",
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "status": "error",
  "error": "ErrorName",
  "message": "Error description",
  "stack": "Error stack trace (development only)"
}
```

## Endpoints

### 1. User Registration

**Endpoint:** `POST /signup`

**Description:** Register a new user account.

#### Request Body
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "fullName": "John Doe",
  "phoneNumber": "+1234567890"
}
```

#### Success Response (201 Created)
```json
{
  "status": "success",
  "message": "Created",
  "data": {
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "user"
    },
    "accessToken": "jwt-access-token",
    "refreshToken": "jwt-refresh-token"
  }
}
```

#### Error Responses
- **409 Conflict:** User already exists
```json
{
  "status": "error",
  "error": "ConflictError",
  "message": "USER_ALREADY_EXISTS"
}
```

---

### 2. User Login

**Endpoint:** `POST /login`

**Description:** Authenticate user with email and password.

#### Request Body
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

#### Success Response (200 OK)
```json
{
  "status": "success",
  "message": "OK",
  "data": {
    "message": "Login successful",
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "fullName": "John Doe"
    },
    "accessToken": "jwt-access-token"
  }
}
```

#### Cookies Set
- `accessToken`: HTTP-only cookie, expires in 4 days
- `refreshToken`: HTTP-only cookie, expires in 7 days

#### Error Responses
- **401 Unauthorized:** Invalid credentials
```json
{
  "status": "error",
  "error": "UnauthorizedError",
  "message": "INVALID_CREDENTIALS"
}
```

---

### 3. Google OAuth Callback

**Endpoint:** `GET /google/callback`

**Description:** Handle Google OAuth authentication callback.

#### Parameters
This endpoint is called by Google after user authorization. No manual parameters needed.

#### Success Response (200 OK)
```json
{
  "status": "success",
  "message": "OK",
  "data": {
    "message": "Login successful",
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "fullName": "John Doe"
    }
  }
}
```

#### Cookies Set
- `accessToken`: HTTP-only cookie, expires in 4 days
- `refreshToken`: HTTP-only cookie, expires in 7 days

#### Error Responses
- **401 Unauthorized:** Authentication failed
- **400 Bad Request:** Missing required profile data
- **409 Conflict:** OAuth parse error

---

### 4. Facebook OAuth Callback

**Endpoint:** `GET /facebook/callback`

**Description:** Handle Facebook OAuth authentication callback.

#### Parameters
This endpoint is called by Facebook after user authorization. No manual parameters needed.

#### Success Response (200 OK)
```json
{
  "status": "success",
  "message": "OK",
  "data": {
    "message": "Login successful",
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "fullName": "John Doe"
    }
  }
}
```

#### Cookies Set
- `accessToken`: HTTP-only cookie, expires in 4 days
- `refreshToken`: HTTP-only cookie, expires in 7 days

#### Error Responses
- **401 Unauthorized:** Authentication failed
- **400 Bad Request:** Missing required profile data
- **409 Conflict:** OAuth parse error

---

### 5. Update User Information

**Endpoint:** `GET /update`

**Description:** Update authenticated user's profile information.

#### Authentication Required
This endpoint requires a valid JWT token. Include the token in cookies or Authorization header.

#### Request Body
```json
{
  "fullName": "Updated Name",
  "email": "newemail@example.com",
  "phoneNumber": "+9876543210"
}
```

**Note:** All fields are optional. Only provided fields will be updated.

#### Success Response (200 OK)
```json
{
  "status": "success",
  "message": "OK",
  "data": {}
}
```

#### Error Responses
- **400 Bad Request:** No fields provided to update
- **401 Unauthorized:** Invalid or missing authentication token

---


