# Watch Catalog API

Welcome to the **Watch Catalog API** — a RESTful API built with [NestJS](https://nestjs.com/) to manage and explore a luxurious collection of watches. This API provides endpoints for authentication, catalog management, and querying watch data with ease.

---

## Table of Contents

- [Watch Catalog API](#watch-catalog-api)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Clone the Repository](#clone-the-repository)
  - [API Documentation](#api-documentation)
  - [Environment Variables](#environment-variables)
  - [Step to run this project](#step-to-run-this-project)
  - [Development](#development)
    - [Code Formatting and Linting](#code-formatting-and-linting)
    - [Testing](#testing)
  - [License](#license)

---

## Features

- **Authentication**: Secure sign in and sign up with JWT.
- **Swiping Profile**:
  - Users can view another user profile and swipe them
  - Free acount only has limit of 10 profile view a day
  - Users can purchase a premium package to get unlimited profile view

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Docker** and **Docker compose**: To run the dev server.

Since the development is containerized, we don't need to worry about NodeJS version or the PostgreSQL version that are installed direcly on the host

### Clone the Repository

```bash
git clone https://github.com/aliefdany/dealls-backend-dating-api.git
cd dealls-backend-dating-api
```

---

## API Documentation

This project is documented using [OpenAPI](https://swagger.io/). You can access the live documentation in your local environment after running the application:

- **Swagger UI**: `http://localhost:3000/swagger`

---

## Environment Variables

To run this project, you need to set up the following environment variables in a `.env` file:

```env
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_jwt_secret
```

---

## Step to run this project

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the Docker Compose:

   ```bash
   docker compose up
   ```

3. Apply database migrations (note: before executing this, change the host in POSTGRES_URL to 'localhost', and after migrations or seeding, change it back to 'database'):

   ```bash
   npx prisma migrate dev
   ```

4. Seed the database:
   ```bash
   npx prisma db seed
   ```

---

## Development

### Code Formatting and Linting

- Format code:
  ```bash
  npm run format
  ```
- Lint code:
  ```bash
  npm run lint
  ```

### Testing

- Run the unit tests using Jest:

```bash
npm run test
```

---

## License

This project is licensed under the **UNLICENSED** license. Feel free to contact the author for more details.

---
