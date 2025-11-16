# Implementation Plan

- [ ] 1. Implement User Management Module
  - Create DTOs for user creation with validation rules (name, email)
  - Implement UsersService.create() method with duplicate email handling
  - Implement UsersController.create() endpoint (POST /users)
  - Add error handling for unique constraint violations
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 8.1, 8.2, 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 2. Implement Product Creation
  - Create DTOs for product creation with validation (name, optional quantity)
  - Implement ProductsService.create() method with duplicate name handling
  - Implement ProductsController.create() endpoint (POST /products)
  - Ensure default quantity is 0 when not provided
  - Add error handling for unique constraint violations
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 8.1, 8.2, 9.5_

- [ ] 3. Implement Inventory Adjustment with Transaction Recording
- [ ] 3.1 Create DTOs for inventory adjustment
  - Create AdjustInventoryDto with productId (UUID) and changeAmount (integer) validation
  - Add validation to ensure changeAmount is non-zero
  - _Requirements: 4.6, 8.1, 9.5_

- [ ] 3.2 Implement atomic inventory adjustment logic
  - Implement ProductsService.adjustInventory() using TypeORM QueryRunner for transaction management
  - Add logic to find product by ID and handle not found case (404)
  - Calculate new quantity and validate it's non-negative
  - Reject adjustments that would result in negative quantity with 400 error
  - Update product quantity within transaction
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 8.2, 8.3, 9.2_

- [ ] 3.3 Integrate transaction recording
  - Call TransactionsService.create() within the same database transaction
  - Determine transaction type (INBOUND for positive, OUTBOUND for negative changeAmount)
  - Commit transaction only if both operations succeed
  - Ensure rollback on any error
  - _Requirements: 4.3, 4.7, 7.5_

- [ ] 3.4 Implement inventory adjustment endpoint
  - Implement ProductsController.adjustInventory() endpoint (PUT /products/adjust)
  - Return updated product with 200 status on success
  - Return appropriate error responses (400, 404)
  - _Requirements: 4.1, 4.2, 4.4, 4.5, 8.2, 8.3, 9.4_

- [ ] 4. Implement Product Status Query
  - Create ProductStatusDto for response formatting
  - Implement ProductsService.findOne() method
  - Implement ProductsController.getStatus() endpoint (GET /status/:productId)
  - Add UUID validation using ParseUUIDPipe
  - Return 404 when product not found
  - _Requirements: 5.1, 5.2, 5.3, 8.3, 9.4, 9.5_

- [ ] 5. Implement Transaction History Query
- [ ] 5.1 Create pagination DTOs
  - Create PaginationDto with page and limit validation
  - Set default values (page: 1, limit: 10)
  - Add max limit constraint (e.g., 100)
  - Use @Type() decorator for query parameter transformation
  - _Requirements: 6.3, 6.5, 8.1, 9.5_

- [ ] 5.2 Implement transaction query logic
  - Implement TransactionsService.findAll() with pagination support
  - Use TypeORM relations to include product name in results
  - Order transactions by timestamp DESC
  - Calculate total count for pagination metadata
  - Return paginated response with data and metadata
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 5.3 Implement transaction history endpoint
  - Implement TransactionsController.findAll() endpoint (GET /transactions)
  - Accept pagination query parameters
  - Return paginated transaction list with 200 status
  - _Requirements: 6.1, 9.4_

- [ ] 6. Verify and Update Database Migrations
  - Review existing migration file (1700000000000-InitialSchema.ts)
  - Ensure migration creates users, products, and transactions tables
  - Verify Product table has CHECK constraint for non-negative quantity
  - Verify Transaction table has foreign key to Product with CASCADE delete
  - Verify unique constraints on User.email and Product.name
  - Confirm migrationsRun: true is set in TypeOrmModule configuration
  - _Requirements: 1.5, 7.1, 7.2, 7.4, 7.5_

- [ ] 7. Enhance Error Handling and Validation
  - Verify ValidationPipe is configured globally in main.ts
  - Create custom exception filter for standardized error responses (if needed)
  - Ensure all DTOs use class-validator decorators
  - Add specific error messages for business rule violations
  - Test error responses for all failure scenarios (400, 404, 500)
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 8. Verify Docker Configuration
  - Review docker-compose.yml for correct service configuration
  - Verify postgres service has health check configured
  - Verify api service depends on postgres health check
  - Verify environment variables are correctly passed to api service
  - Verify postgres volume is configured for data persistence
  - Test docker-compose up builds and starts both services
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 9. Create Comprehensive Documentation
- [ ] 9.1 Write README.md setup instructions
  - Document prerequisites (Docker, Docker Compose)
  - Provide step-by-step instructions to run with docker-compose up
  - Document how to stop and clean up containers
  - Document how to view logs
  - _Requirements: 10.1_

- [ ] 9.2 Document migration commands
  - Document npm run migration:generate command
  - Document npm run migration:run command
  - Document npm run migration:revert command
  - Explain automatic migration on startup
  - _Requirements: 10.2, 7.3_

- [ ] 9.3 Create API documentation
  - Document POST /users endpoint with curl example
  - Document POST /products endpoint with curl example
  - Document PUT /products/adjust endpoint with curl example
  - Document GET /status/:productId endpoint with curl example
  - Document GET /transactions endpoint with curl example and pagination
  - Include request/response examples for success and error cases
  - _Requirements: 10.3_

- [ ] 9.4 Document assumptions and trade-offs
  - Document concurrency assumptions
  - Document authentication/authorization assumptions
  - Document pagination strategy trade-offs
  - Document transaction management approach
  - Document any other design decisions
  - _Requirements: 10.4, 10.5_

- [ ] 10. Write Unit Tests
- [ ] 10.1 Write UsersService unit tests
  - Test create user with valid data
  - Test duplicate email handling
  - Mock TypeORM repository
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 10.2 Write ProductsService unit tests
  - Test create product with default quantity
  - Test create product with initial quantity
  - Test duplicate name handling
  - Test adjustInventory for inbound transactions
  - Test adjustInventory for outbound transactions
  - Test rejection of negative quantity adjustments
  - Test product not found scenarios
  - Mock TypeORM repository and QueryRunner
  - _Requirements: 3.1, 3.2, 4.1, 4.2, 4.4_

- [ ] 10.3 Write TransactionsService unit tests
  - Test create transaction record
  - Test findAll with pagination
  - Test product relationship loading
  - Mock TypeORM repository
  - _Requirements: 6.1, 6.2, 6.3_

- [ ] 11. Write E2E Tests
- [ ] 11.1 Write user endpoint E2E tests
  - Test POST /users with valid data returns 201
  - Test POST /users with duplicate email returns 400
  - Test POST /users with invalid email returns 400
  - Test POST /users with missing fields returns 400
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 11.2 Write product endpoint E2E tests
  - Test POST /products creates product with quantity 0
  - Test POST /products with initial quantity
  - Test POST /products with duplicate name returns 400
  - Test GET /status/:id returns product details
  - Test GET /status/:id with invalid UUID returns 400
  - Test GET /status/:id with non-existent ID returns 404
  - _Requirements: 3.1, 3.2, 3.3, 5.1, 5.2, 5.3_

- [ ] 11.3 Write inventory adjustment E2E tests
  - Test PUT /products/adjust increases quantity (inbound)
  - Test PUT /products/adjust decreases quantity (outbound)
  - Test PUT /products/adjust rejects negative quantity with 400
  - Test PUT /products/adjust with non-existent product returns 404
  - Verify transaction record is created after adjustment
  - Test atomicity by simulating failure scenarios
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [ ] 11.4 Write transaction history E2E tests
  - Test GET /transactions returns paginated results
  - Test GET /transactions with custom page and limit
  - Verify transactions include product names
  - Verify transactions are ordered by timestamp DESC
  - Test pagination metadata (total, page, limit)
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
