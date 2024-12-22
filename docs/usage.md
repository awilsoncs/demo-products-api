
## Authentication

### Sign Up

**Endpoint:** `/auth/signup`

**Method:** `POST`

**Request Body:**

\```json
{
  "username": "string",
  "password": "string",
  "email": "string"
}
\```

**Response:**

\```json
{
  "message": "User signed up successfully"
}
\```

### Log In

**Endpoint:** `/auth/login`

**Method:** `POST`

**Request Body:**

\```json
{
  "username": "string",
  "password": "string"
}
\```

**Response:**

\```json
{
  "token": "jwt-token"
}
\```

## Products

### Get All Products

**Endpoint:** `/products`

**Method:** `GET`

**Response:**

\```json
[
  {
    "productId": "string",
    "name": "string",
    "price": "number",
    "description": "string"
  }
]
\```

### Add a New Product

**Endpoint:** `/products`

**Method:** `POST`

**Request Body:**

\```json
{
  "name": "string",
  "price": "number",
  "description": "string"
}
\```

**Response:**

\```json
{
  "message": "Product added successfully"
}
\```

### Get Product by ID

**Endpoint:** `/products/{productId}`

**Method:** `GET`

**Response:**

\```json
{
  "productId": "string",
  "name": "string",
  "price": "number",
  "description": "string"
}
\```

### Update Product by ID

**Endpoint:** `/products/{productId}`

**Method:** `PUT`

**Request Body:**

\```json
{
  "name": "string",
  "price": "number",
  "description": "string"
}
\```

**Response:**

\```json
{
  "message": "Product updated successfully"
}
\```

### Delete Product by ID

**Endpoint:** `/products/{productId}`

**Method:** `DELETE`

**Response:**

\```json
{
  "message": "Product deleted successfully"
}
\```

## Users

### Get All Users

**Endpoint:** `/users`

**Method:** `GET`

**Response:**

\```json
[
  {
    "userId": "string",
    "username": "string",
    "role": "string"
  }
]
\```

### Update User Role

**Endpoint:** `/users/{userId}`

**Method:** `PUT`

**Request Body:**

```json
{
  "role": "string"
}
```

**Response:**

```json
{
  "message": "User role updated successfully"
}
```

### Delete User by ID

**Endpoint:** `/users/{userId}`

**Method:** `DELETE`

**Response:**

```json
{
  "message": "User deleted successfully"
}
```

## Error Handling

All error responses will have the following structure:

```json
{
  "error": "string",
  "message": "string"
}
```

## Conclusion

This document provides a comprehensive guide to using the Inventory Management API. For any further questions or issues, please refer to the project documentation or contact the support team.