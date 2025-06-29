# 📦 Service Post API

## Base URL

`/api/v1/posts`

---

## POST `/posts`

Create a new post (admin only, requires file upload).

**Request (Form-Data):**
- Fields (from `addPostSchema`)
- Images: Up to 15 image files

**Response:**
```json
{
  "status": "success",
  "message": "Created",
  "data": {
    "id": "string",
    "title": "Wooden Desk",
    "description": "Handmade desk for home office",
    "woodType": "cedar",
    "items": ["drawer", "shelf"],
    "imageUrls": ["/pictures/services/desk1.jpg", "/pictures/services/desk2.jpg"],
    "createdBy": "admin-uuid-1234",
    "createdAt": "ISO Date",
    "updatedAt": "ISO Date"
  }
}
```

**Auth:** Required (`admin`)
**Upload:** Yes

---

## PATCH `/posts/:postId`

Update an existing post (admin only).

**Request (Form-Data):**
- Partial fields from `addPostSchema` except `adminId`
- Optional new images

**Response:**
```json
{
  "status": "success",
  "message": "OK",
  "data": {
    "post": {
      "...": "updated post fields"
    }
  }
}
```

**Auth:** Required (`admin`)

---

## DELETE `/posts/:id`

Delete a post by ID (admin only).

**Response:**
```json
{
  "status": "success",
  "message": "OK",
  "data": {
    "...": "deleted post data"
  }
}
```

**Auth:** Required (`admin`)

---

## GET `/posts`

Get paginated posts (for admin dashboard or service listing).

**Query:**
```json
{
  "page": 1,
  "limit": 15
}
```

**Response:**
```json
{
  "status": "success",
  "message": "OK",
  "data": {
    "posts": [
      {
        "id": "string",
        "title": "string",
        "description": "string",
        "woodType": "string",
        "...": "etc."
      }
    ]
  }
}
```

**Auth:** None

---

## GET `/posts/filter`

Filter posts by wood type.

**Query:**
```json
{
  "woodType": "oak",
  "page": 1
}
```

**Response:**
```json
{
  "status": "success",
  "message": "OK",
  "data": {
    "result": [
      {
        "id": "string",
        "woodType": "oak",
        "...": "other post fields"
      }
    ]
  }
}
```

**Auth:** None

---

## GET `/posts/:postId`

Get a post by its ID.

**Response:**
```json
{
  "status": "success",
  "message": "OK",
  "data": {
    "id": "string",
    "title": "string",
    "...": "full post fields"
  }
}
```

**Auth:** None

---

