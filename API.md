# API Documentation

The Primetrade AI backend operates on a dedicated `v1` RESTful API structure, built seamlessly into Next.js App Router API Routes.

**Base URL:**
`/api/v1`

## Standard Responses & Global Headers

- Responses with body content return standard JSON. 
- Custom caching headers (`X-Cache: HIT | MISS`) exist exclusively on GET `/api/v1/signals` for performance debugging.

---

## 🔐 Authentication Endpoints

### 1. Register a User
Create a new User account, defaulting to the regular `'user'` role.

*   **Endpoint:** `POST /api/v1/auth/register`
*   **Body (JSON):**
    ```json
    {
      "username": "trader1",
      "email": "trader1@example.com",
      "password": "strongPassword123!"
    }
    ```
*   **Response (201 Created):**
    ```json
    {
      "message": "User registered successfully",
      "user": {
        "id": "603f...",
        "username": "trader1",
        "email": "trader1@example.com",
        "role": "user"
      }
    }
    ```
*   **Errors (400 Bad Request):** Returns Zod validation errors if the email format is invalid or if the user already exists.

---

### 2. Login
Authenticate an existing account to receive a JWT access token.

*   **Endpoint:** `POST /api/v1/auth/login`
*   **Body (JSON):**
    ```json
    {
      "email": "trader1@example.com",
      "password": "strongPassword123!"
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "token": "eyJhbGciOiJIUz...",
      "user": {
        "id": "...",
        "username": "trader1",
        "role": "user"
      }
    }
    ```
*   **Errors (401 Unauthorized):** "Invalid credentials".

---

## 📡 Signals Management

All endpoints require the Authorization header format `Bearer <TOKEN>`.

### 3. Fetch Signals
Retrieves trade signals based on role constraints. 
**Behavior:**
- *Users* receive an array of their created signals.
- *Admins* receive an array of every user's signals.
*(Supports Redis Caching!)*

*   **Endpoint:** `GET /api/v1/signals`
*   **Headers:** `Authorization: Bearer <TOKEN>`
*   **Query Params (Optional):** `?status=pending|approved|rejected` filters records by status.
*   **Response (200 OK):**
    ```json
    {
      "signals": [
        {
          "_id": "604d...",
          "title": "ETH Surge Expected",
          "symbol": "ETH/USD",
          "type": "BUY",
          "confidence": "High",
          "status": "pending",
          "userId": {
            "_id": "603f...",
            "username": "trader1"
          },
          "createdAt": "2026-03-20T..."
        }
      ]
    }
    ```

---

### 4. Create Signal
Creates a new trade signal under the authenticated user's ID. Initially defaults to `"pending"`.

*   **Endpoint:** `POST /api/v1/signals`
*   **Headers:** `Authorization: Bearer <TOKEN>`
*   **Body (JSON):**
    ```json
    {
      "title": "BTC Bull Run",
      "symbol": "BTC/USDT",
      "type": "BUY",
      "confidence": "High"
    }
    ```
    *Note: `type` must be `'BUY'` or `'SELL'`. `confidence` must be `'Low'`, `'Medium'`, or `'High'`.*
*   **Response (201 Created):**
    ```json
    {
      "message": "Signal created successfully",
      "signal": {
        "_id": "...",
        "title": "BTC Bull Run",
        "status": "pending",
        ...
      }
    }
    ```

---

### 5. Update Signal Status (Admin Only)
Modify the moderation status of an existing signal. *This endpoint triggers strict Role Middleware rejection if attempting to use a regular User token.*

*   **Endpoint:** `PATCH /api/v1/signals/:id`
*   **Headers:** `Authorization: Bearer <TOKEN>`
*   **Body (JSON):**
    ```json
    {
      "status": "approved"
    }
    ```
    *Note: `status` must be `'pending'`, `'approved'`, or `'rejected'`.*
*   **Response (200 OK):**
    ```json
    {
      "message": "Signal marked as approved",
      "signal": {
        "_id": "...",
        "status": "approved"
      }
    }
    ```
*   **Errors (403 Forbidden):** "Access denied. Requires admin role."

---

### 6. Delete Signal
Remove a target signal entirely. Allowed exclusively for the User that originally created the signal, or an Admin bypassing ownership checks.

*   **Endpoint:** `DELETE /api/v1/signals/:id`
*   **Headers:** `Authorization: Bearer <TOKEN>`
*   **Response (200 OK):**
    ```json
    {
      "message": "Signal deleted successfully"
    }
    ```
*   **Errors (403 Forbidden):** "Forbidden: Cannot delete this signal". Or (404 Not Found) if the ID pointer fails.
