---

# Authentication Services API Documentation

This structured API documentation includes endpoints, methods, request payloads, response formats for each operation related to user authentication, pharmacy management, order handling, and admin operations. The table of contents helps users navigate directly to the relevant sections they are interested in. Adjust the placeholders (`user_id_here`, `pharmacy_id_here`, etc.) with actual values as per your system's implementation.
## Table of Contents

1. [User Authentication and Management](#user-authentication-and-management)
   - [1.1 Register User](#register-user)
   - [1.2 Login User](#login-user)
   
2. [Pharmacy Management](#pharmacy-management)
   - [2.1 Add Pharmacy](#add-pharmacy)
   - [2.2 Get Pharmacy Details](#get-pharmacy-details)
   
3. [Order Management](#order-management)
   - [3.1 Place Order](#place-order)
   - [3.2 Track Order](#track-order)
   
4. [Admin Operations](#admin-operations)
   - [4.1 Login Admin](#login-admin)
   - [4.2 Get All Users](#get-all-users)

---

## User Authentication and Management

### 1.1 Register User

- **Method:** `POST`
- **Endpoint:** `/api/v1/register`
- **Description:** Registers a new user and creates a corresponding pharmacy record.
- **Request Payload:**
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "9876543210",
    "dateOfBirth": "1990-01-01",
    "gender": "male",
    "password": "password123"
  }
  ```
- **Response:**
  - **Success (201):**
    ```json
    {
      "type": "success",
      "message": "Account created, OTP sent to mobile number",
      "data": {
        "userId": "user_id_here",
        "pharmacyId": "pharmacy_id_here"
      }
    }
    ```
  - **Error (400/500):**
    ```json
    {
      "type": "error",
      "message": "Error message here"
    }
    ```

### 1.2 Login User

- **Method:** `POST`
- **Endpoint:** `/api/v1/login`
- **Description:** Logs in a user by sending an OTP to their registered phone number.
- **Request Payload:**
  ```json
  {
    "phone": "9876543210"
  }
  ```
- **Response:**
  - **Success (200):**
    ```json
    {
      "type": "success",
      "message": "OTP sent to your registered phone number",
      "data": {
        "userId": "user_id_here"
      }
    }
    ```
  - **Error (400/500):**
    ```json
    {
      "type": "error",
      "message": "Error message here"
    }
    ```

---

## Pharmacy Management

### 2.1 Add Pharmacy

- **Method:** `POST`
- **Endpoint:** `/api/v1/pharmacy/add`
- **Description:** Adds a new pharmacy.
- **Request Payload:**
  ```json
  {
    "name": "Pharmacy Name",
    "address": "123 Main St, City",
    "phone": "9876543210"
  }
  ```
- **Response:**
  - **Success (201):**
    ```json
    {
      "type": "success",
      "message": "Pharmacy added successfully",
      "data": {
        "pharmacyId": "pharmacy_id_here"
      }
    }
    ```
  - **Error (400/500):**
    ```json
    {
      "type": "error",
      "message": "Error message here"
    }
    ```

### 2.2 Get Pharmacy Details

- **Method:** `GET`
- **Endpoint:** `/api/v1/pharmacy/{pharmacyId}`
- **Description:** Retrieves details of a specific pharmacy.
- **Response:**
  - **Success (200):**
    ```json
    {
      "type": "success",
      "data": {
        "pharmacyId": "pharmacy_id_here",
        "name": "Pharmacy Name",
        "address": "123 Main St, City",
        "phone": "9876543210"
      }
    }
    ```
  - **Error (404):**
    ```json
    {
      "type": "error",
      "message": "Pharmacy not found"
    }
    ```

---

## Order Management

### 3.1 Place Order

- **Method:** `POST`
- **Endpoint:** `/api/v1/order/place`
- **Description:** Places a new order.
- **Request Payload:**
  ```json
  {
    "userId": "user_id_here",
    "pharmacyId": "pharmacy_id_here",
    "items": [
      {
        "productId": "product_id_here",
        "quantity": 2
      }
    ]
  }
  ```
- **Response:**
  - **Success (201):**
    ```json
    {
      "type": "success",
      "message": "Order placed successfully",
      "data": {
        "orderId": "order_id_here"
      }
    }
    ```
  - **Error (400/500):**
    ```json
    {
      "type": "error",
      "message": "Error message here"
    }
    ```

### 3.2 Track Order

- **Method:** `GET`
- **Endpoint:** `/api/v1/order/track/{orderId}`
- **Description:** Retrieves tracking information for a specific order.
- **Response:**
  - **Success (200):**
    ```json
    {
      "type": "success",
      "data": {
        "orderId": "order_id_here",
        "status": "shipped",
        "trackingNumber": "1234567890"
      }
    }
    ```
  - **Error (404):**
    ```json
    {
      "type": "error",
      "message": "Order not found"
    }
    ```

---

## Admin Operations

### 4.1 Login Admin

- **Method:** `POST`
- **Endpoint:** `/api/v1/admin/login`
- **Description:** Logs in an admin user and returns a JWT token.
- **Request Payload:**
  ```json
  {
    "username": "admin_username",
    "password": "admin_password"
  }
  ```
- **Response:**
  - **Success (200):**
    ```json
    {
      "type": "success",
      "token": "jwt_token_here"
    }
    ```
  - **Error (400/500):**
    ```json
    {
      "type": "error",
      "message": "Login failed"
    }
    ```

### 4.2 Get All Users

- **Method:** `GET`
- **Endpoint:** `/api/v1/admin/users`
- **Description:** Retrieves a list of all registered users.
- **Response:**
  - **Success (200):**
    ```json
    {
      "type": "success",
      "data": [
        {
          "userId": "user_id_here",
          "name": "John Doe",
          "email": "john.doe@example.com",
          "phone": "9876543210"
        },
        {
          "userId": "another_user_id_here",
          "name": "Jane Smith",
          "email": "jane.smith@example.com",
          "phone": "1234567890"
        }
      ]
    }
    ```
  - **Error (500):**
    ```json
    {
      "type": "error",
      "message": "Internal server error"
    }
    ```

---