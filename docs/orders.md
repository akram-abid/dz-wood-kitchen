# Order Management API Documentation

## Base URL
All endpoints are prefixed with `/api/v1/orders`


## Response Format
All successful responses follow this format:
```json
{
  "status": "success",
  "message": "OK",
  "data": {}
}
```

Error responses:
```json
{
  "status": "error",
  "error": "ErrorName",
  "message": "Error description"
}
```

## Endpoints

### 1. Create Order
**POST** `/orders`

Creates a new order with optional file uploads.

**Content-Type:** `multipart/form-data`

**Request Body:**
```json
{
  "title": "string (optional)",
  "description": "string (required)",
  "woodType": "string (optional)",
  "daira": "string (required)",
  "street": "string (required)",
  "baladia": "string (required)",
  "wilaya": "string (required)",
  "phoneNumber": "string (required)",
  "postId": "uuid (optional)",
  "files": "File[] (max 10 files, optional)"
}
```

**Response (201):**
```json
{
  "status": "success",
  "message": "Created",
  "data": {
    "order": {
      "id": "uuid",
      "title": "string",
      "description": "string",
      "woodType": "string",
      "daira": "string",
      "street": "string",
      "baladia": "string",
      "wilaya": "string",
      "phoneNumber": "string",
      "mediaUrls": ["string[]"],
      "postId": "uuid",
      "userId": "uuid",
      "status": "string",
      "offer": "number",
      "isValidated": "boolean",
      "installments": "array",
      "articles": "array"
    }
  }
}
```

---

### 2. Update Order
**PATCH** `/orders/:orderId`

Updates an existing order with optional file uploads.

**Content-Type:** `multipart/form-data`

**Request Body:** (All fields optional)
```json
{
  "title": "string",
  "description": "string",
  "woodType": "string",
  "daira": "string",
  "street": "string",
  "baladia": "string",
  "wilaya": "string",
  "phoneNumber": "string",
  "postId": "uuid",
  "files": "File[]"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "OK",
  "data": {
    "order": {}
  }
}
```

---

### 3. Get All Orders
**GET** `/orders`

Retrieves orders with optional filtering.

**Query Parameters:**
- `status` (optional): Filter by order status
- `validated` (optional): `true` or `false` to filter by validation status

**Examples:**
- `GET /orders` - Get all orders
- `GET /orders?status=pending` - Get pending orders
- `GET /orders?validated=true` - Get validated orders

**Response (200):**
```json
{
  "status": "success",
  "message": "OK",
  "data": []
}
```

---

### 4. Get Order by ID
**GET** `/orders/:id`

Retrieves a specific order by ID.

**Response (200):**
```json
{
  "status": "success",
  "message": "OK",
  "data": {
    "order": {}
  }
}
```

---

### 5. Update Order Status
**PATCH** `/orders/:id/status`

Updates the status of an order. **Admin only**.

**Request Body:**
```json
{
  "status": "string"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "OK"
}
```

---

### 6. Update Order Offer
**PATCH** `/orders/:id/offer`

Updates the offer amount for an order.

**Request Body:**
```json
{
  "offer": "number"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "OK"
}
```

---

### 7. Toggle Order Validation
**PATCH** `/orders/:id/validate`

Validates or invalidates an order. **Admin only**.

**Request Body:**
```json
{
  "validate": "boolean"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "OK",
  "data": {
    "is_validated": "Order validated"
  }
}
```

---

### 8. Add Installment
**PATCH** `/orders/:id/installments`

Adds a new installment to an order.

**Request Body:**
```json
{
  "newInstallment": {
    "date": "string (YYYY-MM-DD)",
    "amount": "number"
  }
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "OK",
  "data": [
    {
      "date": "string",
      "amount": "number"
    }
  ]
}
```

---

### 9. Set Order Articles
**POST** `/orders/:id/articles`

Sets articles for a completed order.

**Request Body:**
```json
{
  "articles": ["array of any type"]
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "OK",
  "data": {
    "articles": ["array"]
  }
}
```

---

### 10. Delete Order
**DELETE** `/orders/:id`

Deletes an order by ID.

**Response (200):**
```json
{
  "status": "success",
  "message": "OK",
  "data": {
    "order": {}
  }
}
```

---

## Error Codes

- **400** - Bad Request (validation errors)
- **401** - Unauthorized (missing or invalid token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found (order doesn't exist)
- **500** - Internal Server Error

## Notes

1. **File Uploads**: When uploading files, use `multipart/form-data` and include files in the `files` field
2. **Admin Routes**: Routes marked as "Admin only" require admin role
3. **UUID Format**: All IDs should be valid UUIDs
4. **Date Format**: Dates should be in ISO format (YYYY-MM-DD)
5. **Media URLs**: Uploaded files are automatically converted to URLs in the format `/pictures/orders/{filename}`
