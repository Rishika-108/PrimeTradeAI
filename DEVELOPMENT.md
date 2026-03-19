# Primetrade AI – Signal Management System

**Note to Developers:** Please read this entire document thoroughly before making any changes to the codebase to ensure consistency with project standards and logic.

## 1. Project Overview & Identity
**Primetrade AI** is a dark-themed, full-stack application designed for managing AI-generated trade signals. The system allows users to register, log in, and create trading signals, while administrators have the authority to manage, approve, or reject all signals across the platform.

*   **Primary Goal**: Provide a streamlined interface for signal creation and administrative oversight.
*   **Target Users**: Individual traders (Users) and platform moderators (Admins).
*   **Deployment Environment**: Next.js Fullstack environment (recommended with Docker).

## 2. Technical Stack
| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js (Fullstack), Dark Theme UI |
| **Backend/API** | Next.js API Routes (with Versioning) |
| **Database** | MongoDB with Mongoose |
| **Authentication** | JWT (jsonwebtoken) & bcrypt for password hashing |
| **Validation** | Zod or Joi |
| **Optional/Bonus** | Redis (Caching), Docker (Containerization) |

## 3. User Role Definitions
The system utilizes granular role-based access control (RBAC) to manage permissions:

*   **User**:
    *   Can register and log in.
    *   Can create signals with "fake AI confidence".
    *   Can view, update, and delete only their own signals.
*   **Admin**:
    *   Has full visibility of all signals across the system.
    *   Responsible for signal moderation (Approve/Reject).
    *   Can access administrative-only routes.

## 4. Business Logic & System Rules
*   **Signal Entity**: Must contain a title, symbol, type, confidence level, status, and the associated userId.
*   **Approval Workflow**: New signals are created by users; admins use dedicated `PATCH` endpoints to transition signal status to "approved" or "rejected".
*   **Authentication Middleware**: All protected routes must use `authMiddleware` to verify JWTs from headers and attach the user object to the request.
*   **Role Middleware**: Explicitly restricts admin routes to users with the `admin` role.

## 5. Design System & Tokens
Primetrade AI follows a strict **Dark Theme** visual guide and the **60-30-10 color rule**:

*   **Color Palette**:
    *   **Dominant (60%)**: Black / Dark Gray for backgrounds.
    *   **Secondary (30%)**: Slightly lighter gray for cards and UI components.
    *   **Accents (10%)**: Green for "BUY" actions/signals and Red for "SELL" actions/signals.
*   **Typography**:
    *   **Body Text**: Use a 1.5x multiplier for line height to ensure readability.
    *   **Headers**: Use a 1.2x - 1.3x multiplier for line height to maintain a tight, professional look.
*   **Spacing & Grid**:
    *   Use a **4-pixel grid** for mobile and an **8-column vertical grid** for desktop.
    *   Standard screen margins must be set to **16px or 20px** consistently.

## 6. Component & UI Conventions
*   **Consistency**: Maintain identical corner radiuses and padding rules across all buttons, cards, and inputs.
*   **Interactive Elements**: Ensure proper tappability by spacing filters and buttons far enough apart to prevent accidental clicks.
*   **Iconography**: Use icons from the same family; do not mix solid and line styles.
*   **States**: Always include UI designs for empty states, 404 errors, and input validation errors (e.g., incorrect passwords).

## 7. Implementation Guidelines
*   **API Versioning**: All API endpoints must be versioned (e.g., `/api/v1/...`).
*   **Standard Status Codes**:
    *   `200/201`: Success/Created.
    *   `400`: Bad Request (Validation failure).
    *   `401/403`: Unauthorized/Forbidden.
*   **Routing**: Protected routes must be strictly enforced on both the frontend and backend.
*   **Documentation**: Provide a Postman collection or Swagger UI for API testing.

## 8. Practical "Do's and Don'ts"
*   **Do**: Use Zod/Joi for all input validation to prevent dirty data.
*   **Do**: Preview designs at 100% scale to ensure icons and buttons are sized correctly for real-world use.
*   **Don't**: Mix icon styles or font families within the same project.
*   **Don't**: Deploy without password hashing (bcrypt) or JWT protection—security is mandatory.
*   **Do**: Prioritize actual product functionality and user flows over aesthetic landing pages.

## 9. Non-Functional Requirements
*   **Security**: Mandatory bcrypt hashing and JWT authentication for all user sessions.
*   **Performance**: If possible, implement Redis to cache `GET /signals` requests.
*   **Accessibility**: Ensure sufficient contrast in the dark theme and clear labels for all input fields.
*   **Deployment**: Use Docker to containerize the application for consistent environment behavior.
