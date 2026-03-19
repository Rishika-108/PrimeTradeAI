# Primetrade AI – Signal Management System

**Primetrade AI** is a dark-themed, full-stack application designed for managing AI-generated trade signals. The system allows users to register, log in, and create trading signals, while administrators have the authority to manage, approve, or reject all signals across the platform.

## Features

- **Role-Based Access Control**: Separate workflows for 'User' and 'Admin' roles.
- **Trading Signals**: Create, read, and delete specific trade signals with "fake AI confidence".
- **Admin Moderation**: Admins can oversee all signals and change their statuses (Approve/Reject).
- **Dark Theme Interface**: Sleek 60-30-10 dark theme design with responsive grid system layouts.
- **Caching**: Redis implementation for blazingly fast `GET /signals` responses.
- **Secure Authentication**: Built with JWT and bcrypt for safe session and password management.
- **Robust Validation**: Zod schemas to ensure absolute data integrity.
- **Docker Ready**: Provides a seamless containerized setup out-of-the-box.

## Tech Stack

- **Frontend/Backend**: Next.js (App Router, API Routes v1)
- **Database**: MongoDB (via Mongoose)
- **Caching Layer**: Redis
- **Styling**: Tailwind CSS (Dark Mode logic)
- **Authentication**: JsonWebToken (JWT), Bcrypt
- **Validation**: Zod
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB connection string
- Redis Server (local or cloud)
- Docker & Docker Compose (optional for containerized setup)

### Environment Variables

Create a `.env.local` file in the root directory and add the following keys:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
REDIS_URL=redis://localhost:6379 
NEXT_PUBLIC_API_URL=http://localhost:3000
```

*Note: In Docker mode, Redis connects via the hostname `redis` as specified in the docker-compose file.*

### Local Installation

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) using your browser.

### Docker Deployment

To spin up the entire application along with MongoDB and Redis using Docker Compose:

```bash
docker-compose up --build
```
This will start:
- Next.js Web App on `http://localhost:3000`
- Redis server on `localhost:6379`
- MongoDB on `localhost:27017`

---

## Architecture Insights

The project enforces Strict Client / Server separation via Next.js 14 API routes functioning autonomously from UI Components.
- Data fetching goes through unified API calls inside `useEffect`.
- Caching strategy heavily guards MongoDB cluster from repeated similar queries by matching parameters. Cache invalidates perfectly upon POST/PATCH updates.

---

## Scalability Notes

When preparing Primetrade AI for a high-traffic production environment, consider the following scalability upgrades:

1. **Database Sharding & Replication:** 
   Our current architecture relies on a single MongoDB connection instance. As user data and signals scale, deploying MongoDB across a replicated cluster or sharding by `userId` or `createdAt` time-series will vastly improve read/write distribution.
2. **Advanced Caching Layout (Redis):**
   While Redis handles general GET caching currently, high-throughput scenarios would benefit from caching user sessions via Redis instead of stateless JWT validations alone. Pub/Sub mechanics could be hooked for real-time Signal updates rather than relying solely on REST polling.
3. **Microservices Migration Path:** 
   The Next.js App router API is fantastic for unified builds, however at massive volumes, peeling off the `/api/v1/auth` and `/api/v1/signals` routines into separate Node/Go microservices managed by an API Gateway (like Kong/Nginx) will ensure CPU intense validation/hashing flows don't block Frontend SSR pages.
4. **Queue Processing:**
   Presently, signal moderation statuses are updated synchronously. Implementing message queues (e.g., RabbitMQ, Celery, or BullMQ) to handle heavy status updates or massive email notifications will detach the heavy lifting from the main API thread.
5. **Horizontal Scaling & Load Balancing:**
   Because the Next.js frontend is fundamentally stateless aside from Redis, setting up a Load Balancer to spin up multiple instances of the Node.js Next container in Kubernetes (K8S) or AWS ECS will drastically improve concurrent traffic limits.
