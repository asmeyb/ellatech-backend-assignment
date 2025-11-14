## Description

This repository contains a **NestJS-based REST API** that manages **users**, **products**, and **transaction history**. It uses **PostgreSQL** as the database and **TypeORM** for data modeling and migrations. The service is containerized using **Docker Compose** for easy local development and testing.

## Project Overview

### Features
- Manage users and products
- Track product adjustments and transaction history
- RESTful API with proper validation and HTTP status codes
- Dockerized local environment
- TypeORM migrations for schema versioning

### API Endpoints

| Method | Endpoint                  | Description                               |
|--------|---------------------------|-------------------------------------------|
| POST   | `/users`                  | Create a new user                         |
| POST   | `/products`               | Create a new product                      |
| PUT    | `/products/adjust`        | Adjust product quantity                   |
| GET    | `/status/:productId`      | Get current status of a product           |
| GET    | `/transactions`           | Get all transaction history               |

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

## Project Setup

```bash
# Clone the repository
$ git clone https://github.com/asmeyb/ellatech-backend-assignment.git
$ cd your-project-folder

# Install dependencies
$ npm install