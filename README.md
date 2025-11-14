&lt;p align="center"&gt;
  &lt;a href="http://nestjs.com/" target="blank"&gt;&lt;img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /&gt;&lt;/a&gt;
&lt;/p&gt;

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  &lt;p align="center"&gt;A progressive &lt;a href="http://nodejs.org" target="_blank"&gt;Node.js&lt;/a&gt; framework for building efficient and scalable server-side applications.&lt;/p&gt;
    &lt;p align="center"&gt;
&lt;a href="https://www.npmjs.com/~nestjscore" target="_blank"&gt;&lt;img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /&gt;&lt;/a&gt;
&lt;a href="https://www.npmjs.com/~nestjscore" target="_blank"&gt;&lt;img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /&gt;&lt;/a&gt;
&lt;a href="https://www.npmjs.com/~nestjscore" target="_blank"&gt;&lt;img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /&gt;&lt;/a&gt;
&lt;a href="https://circleci.com/gh/nestjs/nest" target="_blank"&gt;&lt;img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /&gt;&lt;/a&gt;
&lt;a href="https://discord.gg/G7Qnnhy" target="_blank"&gt;&lt;img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/&gt;&lt;/a&gt;
&lt;a href="https://opencollective.com/nest#backer" target="_blank"&gt;&lt;img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /&gt;&lt;/a&gt;
&lt;a href="https://opencollective.com/nest#sponsor" target="_blank"&gt;&lt;img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /&gt;&lt;/a&gt;
  &lt;a href="https://paypal.me/kamilmysliwiec" target="_blank"&gt;&lt;img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/&gt;&lt;/a&gt;
    &lt;a href="https://opencollective.com/nest#sponsor"  target="_blank"&gt;&lt;img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"&gt;&lt;/a&gt;
  &lt;a href="https://twitter.com/nestframework" target="_blank"&gt;&lt;img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter" /&gt;&lt;/a&gt;
&lt;/p&gt;

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
$ git clone https://github.com/your-username/your-repo-name.git
$ cd your-repo-name

# Install dependencies
$ npm install