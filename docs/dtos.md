# API Types & DTOs

This section documents the request/response structures used throughout the API.

---

## 🧾 Auth DTOs

### SignupData

```json
{
  "email": "user@example.com",
  "password": "strongpassword",
  "fullName": "John Doe",
}
```

### LoginData

```json
{
  "email": "user@example.com",
  "password": "strongpassword"
}
```

### OAuthProfile

```json
{
  "id": "oauth_user_id",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "provider": "google",
  "avatar": "https://example.com/avatar.jpg"
}
```

### UpdateUserBody

```json
{
  "fullName": "John Smith",
  "email": "john.smith@example.com",
  "phoneNumber": "0555123456"
}
```

### GrantSessionData

```json
{
  "response": {
    "access_token": "access.token.value",
    "refresh_token": "refresh.token.value",
    "raw": "raw response string"
  }
}
```

---

## 📦 Order DTOs

### createOrderDto

```json
{
  "title": "Custom Table",
  "description": "A detailed wooden table.",
  "woodType": "oak",
  "daira": "Bab El Oued",
  "street": "123 Main St",
  "baladia": "Algiers Center",
  "wilaya": "Algiers",
  "phoneNumber": "0555123456",
  "mediaFilenames": ["img1.jpg", "img2.jpg"],
  "postId": "post-uuid-1234",
  "userId": "user-uuid-5678"
}
```

### updateOrderDto

Partial version of `createOrderDto`. Any subset of its fields can be included.

### addInstallmentDto

```json
{
  "newInstallment": {
    "date": "2025-06-01",
    "amount": 15000
  }
}
```

### updateStatusDto

```json
{
  "status": "validated"
}
```

### updateOfferDto

```json
{
  "offer": 35000
}
```

### toggleValidationDto

```json
{
  "validate": true
}
```

### setArticlesDto

```json
{
  "articles": [{}, {}, {}]
}
```

### orderIdParamDto

```json
{
  "id": "order-uuid-1234"
}
```

---

## 🛠 Service/Post DTOs

### addPostSchema

```json
{
  "title": "Wooden Desk",
  "description": "Handmade desk for home office",
  "price": "45000",
  "items": ["drawer", "shelf"],
  "woodType": "cedar",
  "estimatedTime": "3 weeks",
  "adminId": "admin-uuid-1234",
  "imageFilenames": ["desk1.jpg", "desk2.jpg"]
}
```

### deletePostParamsSchema

```json
{
  "id": "post-uuid-1234"
}
```

### getByAdminParamsSchema

```json
{
  "page": 1,
  "limit": 15
}
```

### getPostByIdSchema

```json
{
  "postId": "post-uuid-1234"
}
```

---
