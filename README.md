# Inventory Management System - NestJS/TypeORM

A robust, containerized backend service for managing users, products, and inventory transactions using NestJS, TypeORM, and PostgreSQL.

## Features

- **User Management**: Create and manage users with unique email validation
- **Product Management**: Create products with unique names and track inventory
- **Inventory Transactions**: Historical record of all inventory changes (INBOUND/OUTBOUND)
- **Atomic Operations**: Database transactions ensure data consistency
- **Stock Validation**: Prevents negative inventory levels
- **Pagination**: Transaction history with configurable pagination
- **Docker Support**: Fully containerized with Docker Compose

## Tech Stack

- **Framework**: NestJS 11.x
- **ORM**: TypeORM 0.3.x
- **Database**: PostgreSQL 16
- **Validation**: class-validator & class-transformer
- **Containerization**: Docker & Docker Compose

## Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local development)
- npm 10+

## Quick Start with Docker

### 1. Clone the repository

```bash
git clone https://github.com/asmeyb/ellatech-backend-assignment.git
cd ellatech-backend-assignment
```

### 2. Start the application

```bash
docker-compose up --build
```

This command will:
- Build the NestJS API Docker image
- Start PostgreSQL database with persistent volume
- Run database migrations automatically
- Start the API on http://localhost:3000

### 3. Verify the application is running

```bash
curl http://localhost:3000
```

### 4. Stop the application

```bash
docker-compose down
```

To remove volumes (database data):
```bash
docker-compose down -v
```

## Local Development Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the root directory:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres / Your Database user name
DB_PASSWORD=postgres / Your Database password
DB_NAME=inventory_db / Your Database name
PORT=3000
```

### 3. Start PostgreSQL (if not using Docker)

```bash
# Using Docker for database only
docker run --name postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=inventory_db -p 5432:5432 -d postgres:16-alpine
```

### 4. Run migrations

```bash
npm run migration:run
```

### 5. Start the development server

```bash
npm run start:dev
```

The API will be available at http://localhost:3000

## Database Migrations

### Run migrations

```bash
npm run migration:run
```

### Revert last migration

```bash
npm run migration:revert
```

### Generate new migration (after entity changes)

```bash
npm run migration:generate -- src/migrations/MigrationName
```

## API Documentation

### Base URL
```
http://localhost:3000
```

### Endpoints

#### 1. Create User

**POST** `/users`

Creates a new user with unique email validation.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'
```

**Error Responses:**
- `400 Bad Request`: Invalid email format or missing fields
- `409 Conflict`: Email already exists

---

#### 2. Create Product

**POST** `/products`

Creates a new product with unique name. Initial quantity defaults to 0 if not provided.

**Request Body:**
```json
{
  "name": "Laptop",
  "quantity": 10
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "name": "Laptop",
  "quantity": 10
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop","quantity":10}'
```

**Error Responses:**
- `400 Bad Request`: Invalid data or negative quantity
- `409 Conflict`: Product name already exists

---

#### 3. Adjust Product Inventory

**PUT** `/products/adjust`

Adjusts product inventory atomically. Positive values increase stock (INBOUND), negative values decrease stock (OUTBOUND).

**Request Body:**
```json
{
  "productId": "uuid",
  "changeAmount": 5
}
```

For stock-out (negative value):
```json
{
  "productId": "uuid",
  "changeAmount": -3
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "Laptop",
  "quantity": 15
}
```

**cURL Examples:**
```bash
# Stock IN (add 5 units)
curl -X PUT http://localhost:3000/products/adjust \
  -H "Content-Type: application/json" \
  -d '{"productId":"<uuid>","changeAmount":5}'

# Stock OUT (remove 3 units)
curl -X PUT http://localhost:3000/products/adjust \
  -H "Content-Type: application/json" \
  -d '{"productId":"<uuid>","changeAmount":-3}'
```

**Error Responses:**
- `400 Bad Request`: Insufficient stock (would result in negative quantity)
- `404 Not Found`: Product not found

---

#### 4. Get Product Status

**GET** `/products/status/:productId`

Retrieves current product information including name and quantity.

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "Laptop",
  "quantity": 15
}
```

**cURL Example:**
```bash
curl http://localhost:3000/products/status/<uuid>
```

**Error Responses:**
- `404 Not Found`: Product not found

---

#### 5. Get Transaction History

**GET** `/transactions?limit=10&offset=0`

Retrieves paginated transaction history with product details.

**Query Parameters:**
- `limit` (optional): Number of records per page (default: 10)
- `offset` (optional): Number of records to skip (default: 0)

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "uuid",
      "productId": "uuid",
      "productName": "Laptop",
      "type": "INBOUND",
      "quantityChanged": 5,
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
  ],
  "total": 100,
  "limit": 10,
  "offset": 0
}
```

**cURL Example:**
```bash
curl "http://localhost:3000/transactions?limit=20&offset=0"
```

---

## Project Structure

```
src/
├── entities/           # TypeORM entities
│   ├── user.entity.ts
│   ├── product.entity.ts
│   └── transaction.entity.ts
├── users/             # User module
│   ├── dto/
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── products/          # Product module
│   ├── dto/
│   ├── products.controller.ts
│   ├── products.service.ts
│   └── products.module.ts
├── transactions/      # Transaction module
│   ├── transactions.controller.ts
│   ├── transactions.service.ts
│   └── transactions.module.ts
├── migrations/        # Database migrations
├── data-source.ts     # TypeORM configuration
├── app.module.ts      # Root module
└── main.ts           # Application entry point
```

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `name` (VARCHAR(100))
- `email` (VARCHAR, Unique)

### Products Table
- `id` (UUID, Primary Key)
- `name` (VARCHAR(100), Unique)
- `quantity` (INTEGER, >= 0)

### Transactions Table
- `id` (UUID, Primary Key)
- `productId` (UUID, Foreign Key)
- `type` (ENUM: 'INBOUND', 'OUTBOUND')
- `quantityChanged` (INTEGER)
- `timestamp` (TIMESTAMP)

## Design Decisions & Trade-offs

### 1. UUID vs Auto-increment IDs
**Decision**: Used UUIDs for all primary keys
**Rationale**: 
- Better for distributed systems
- No sequential ID exposure
- Easier data migration between environments

**Trade-off**: Slightly larger storage and index size

### 2. Pessimistic Locking
**Decision**: Used pessimistic write locks for inventory adjustments
**Rationale**: 
- Prevents race conditions in concurrent requests
- Ensures data consistency
- Simple to implement and understand

**Trade-off**: Reduced concurrency, but acceptable for inventory operations

### 3. Transaction History
**Decision**: Immutable transaction records with product relationship
**Rationale**: 
- Complete audit trail
- Historical data preservation
- Easy to query and analyze

**Trade-off**: Additional storage, but essential for business requirements

### 4. Synchronize: false
**Decision**: Disabled TypeORM auto-synchronization
**Rationale**: 
- Production-safe approach
- Explicit migration control
- Prevents accidental schema changes

**Trade-off**: Requires manual migration management

### 5. Single changeAmount field
**Decision**: Used positive/negative integers instead of separate type field
**Rationale**: 
- Simpler API
- More intuitive for clients
- Reduces validation complexity

**Trade-off**: None significant

## Assumptions

1. **Authentication**: Not implemented (out of scope). In production, add JWT/OAuth.
2. **Authorization**: No role-based access control. All endpoints are public.
3. **Soft Deletes**: Not implemented. Products and users are hard-deleted.
4. **Product Variants**: Single product entity without variants/SKUs.
5. **Concurrent Requests**: Handled via database-level pessimistic locking.
6. **Timezone**: All timestamps stored in UTC.
7. **Validation**: Basic validation only. Production would need more business rules.
8. **Error Logging**: Basic console logging. Production needs proper logging service.

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Production Considerations

1. **Environment Variables**: Use secrets management (AWS Secrets Manager, Vault)
2. **Database**: Use managed PostgreSQL (AWS RDS, Google Cloud SQL)
3. **Migrations**: Run migrations as part of CI/CD pipeline
4. **Monitoring**: Add APM (New Relic, DataDog) and logging (ELK, CloudWatch)
5. **Rate Limiting**: Implement rate limiting for API endpoints
6. **CORS**: Configure CORS for frontend applications
7. **Health Checks**: Add `/health` endpoint for load balancers
8. **Documentation**: Add Swagger/OpenAPI documentation

## License

MIT
