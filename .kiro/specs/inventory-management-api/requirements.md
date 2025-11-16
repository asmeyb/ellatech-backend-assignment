# Requirements Document

## Introduction

This document specifies the requirements for a containerized backend service that manages users, products, and inventory transactions. The system provides a RESTful API for creating users and products, adjusting product inventory with full transaction history tracking, and querying product status and transaction records. The service uses NestJS, TypeORM, and PostgreSQL, and must be fully operable via Docker Compose.

## Glossary

- **API Service**: The NestJS backend application that exposes RESTful endpoints
- **Database Service**: The PostgreSQL database container that persists all application data
- **User**: An entity representing a person in the system with a unique email address
- **Product**: An entity representing an inventory item with a name and quantity
- **Transaction**: A historical record of an inventory change (inbound or outbound)
- **Inventory Adjustment**: The process of increasing or decreasing a product's quantity
- **DTO**: Data Transfer Object used for request validation and data transformation
- **TypeORM Transaction**: A database transaction that ensures atomicity of operations
- **Migration**: A versioned database schema change managed by TypeORM

## Requirements

### Requirement 1: Container Orchestration

**User Story:** As a developer, I want to run the entire application stack using Docker Compose, so that I can easily set up and deploy the service without manual configuration.

#### Acceptance Criteria

1. THE API Service SHALL be built from a Dockerfile and expose port 3000
2. THE Database Service SHALL use a PostgreSQL image and persist data via a Docker volume
3. THE API Service SHALL connect to the Database Service using environment variables
4. WHEN the docker-compose command is executed, THE API Service SHALL wait for the Database Service to be healthy before starting
5. THE API Service SHALL automatically run database migrations on startup

### Requirement 2: User Management

**User Story:** As an API consumer, I want to create users with validated information, so that I can maintain a registry of system users.

#### Acceptance Criteria

1. WHEN a POST request is sent to /users with valid name and email, THE API Service SHALL create a new User and return HTTP status 201
2. THE API Service SHALL validate that the email field contains a valid email format
3. THE API Service SHALL enforce email uniqueness and return HTTP status 400 if a duplicate email is provided
4. THE API Service SHALL validate that the name field is not empty
5. THE API Service SHALL return standardized error responses for validation failures

### Requirement 3: Product Creation

**User Story:** As an inventory manager, I want to create products with unique names, so that I can track different inventory items.

#### Acceptance Criteria

1. WHEN a POST request is sent to /products with a valid name, THE API Service SHALL create a new Product with quantity 0 and return HTTP status 201
2. THE API Service SHALL enforce product name uniqueness and return HTTP status 400 if a duplicate name is provided
3. WHERE an initial quantity is provided, THE API Service SHALL validate that the quantity is a non-negative integer
4. THE API Service SHALL validate that the name field is not empty
5. THE API Service SHALL return standardized error responses for validation failures

### Requirement 4: Inventory Adjustment with Transaction Recording

**User Story:** As an inventory manager, I want to adjust product quantities with automatic transaction recording, so that I can maintain accurate inventory levels and a complete audit trail.

#### Acceptance Criteria

1. WHEN a PUT request is sent to /products/adjust with a valid productId and positive changeAmount, THE API Service SHALL increase the product quantity and create an INBOUND transaction
2. WHEN a PUT request is sent to /products/adjust with a valid productId and negative changeAmount, THE API Service SHALL decrease the product quantity and create an OUTBOUND transaction
3. THE API Service SHALL use a TypeORM Transaction to ensure atomicity of the quantity update and transaction record creation
4. IF the adjustment would result in a negative product quantity, THEN THE API Service SHALL reject the request and return HTTP status 400 with a descriptive error message
5. WHEN the productId does not exist, THE API Service SHALL return HTTP status 404
6. THE API Service SHALL validate that changeAmount is a non-zero integer
7. THE Transaction record SHALL include the productId, transaction type, quantity changed, and timestamp

### Requirement 5: Product Status Query

**User Story:** As an inventory manager, I want to check the current status of a product, so that I can view its name and available quantity.

#### Acceptance Criteria

1. WHEN a GET request is sent to /status/:productId with a valid UUID, THE API Service SHALL return the product name and current quantity with HTTP status 200
2. WHEN the productId does not exist, THE API Service SHALL return HTTP status 404 with a descriptive error message
3. THE API Service SHALL validate that the productId is a valid UUID format

### Requirement 6: Transaction History Query

**User Story:** As an inventory manager, I want to retrieve the complete transaction history with pagination, so that I can audit all inventory changes.

#### Acceptance Criteria

1. WHEN a GET request is sent to /transactions, THE API Service SHALL return a paginated list of all transactions with HTTP status 200
2. THE API Service SHALL include the associated product name in each transaction record
3. THE API Service SHALL support pagination parameters (limit and page or offset)
4. THE API Service SHALL return transactions ordered by timestamp in descending order (most recent first)
5. WHERE no pagination parameters are provided, THE API Service SHALL use default values (e.g., limit 10, page 1)

### Requirement 7: Database Schema Management

**User Story:** As a developer, I want to use TypeORM migrations to manage database schema changes, so that I can version control and reliably deploy schema updates.

#### Acceptance Criteria

1. THE API Service SHALL define TypeORM entities for User, Product, and Transaction
2. THE API Service SHALL include migration files that create the users, products, and transactions tables
3. THE API Service SHALL provide npm scripts to generate, run, and revert migrations
4. THE Product entity SHALL enforce a non-negative quantity constraint at the database level
5. THE Transaction entity SHALL have a foreign key relationship to the Product entity with cascade delete

### Requirement 8: Validation and Error Handling

**User Story:** As an API consumer, I want to receive clear, standardized error responses, so that I can understand what went wrong and how to fix it.

#### Acceptance Criteria

1. THE API Service SHALL use class-validator for DTO validation on all POST and PUT endpoints
2. THE API Service SHALL return HTTP status 400 for validation errors with details about which fields failed validation
3. THE API Service SHALL return HTTP status 404 when a requested resource is not found
4. THE API Service SHALL return HTTP status 500 for unexpected server errors
5. THE API Service SHALL use NestJS exception filters to standardize error response format across all endpoints

### Requirement 9: Code Organization and Architecture

**User Story:** As a developer, I want the codebase to follow NestJS best practices, so that the application is maintainable and scalable.

#### Acceptance Criteria

1. THE API Service SHALL organize code into separate modules (UserModule, ProductModule, TransactionModule)
2. THE API Service SHALL implement dependency injection for all services and repositories
3. THE API Service SHALL separate business logic into service classes
4. THE API Service SHALL use controllers only for request handling and response formatting
5. THE API Service SHALL define DTOs for all request and response payloads

### Requirement 10: Documentation and Deployment

**User Story:** As a developer, I want comprehensive documentation, so that I can understand how to run, test, and use the API.

#### Acceptance Criteria

1. THE project SHALL include a README.md file with step-by-step Docker Compose setup instructions
2. THE README.md SHALL document how to run TypeORM migrations
3. THE README.md SHALL include API documentation with example curl commands for all five endpoints
4. THE README.md SHALL document any assumptions made during development
5. THE README.md SHALL document trade-offs considered (e.g., performance vs. simplicity)
