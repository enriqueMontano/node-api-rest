# node-api-rest

Simple API REST with JWT authentication, role authorization and database access using Node.js

## How to install

1. Clone the project on your computer:

```bash
git clone https://github.com/enriqueMontano/node-api-rest.git
```

2. Install dependencies:

On project root directory launch the following commands:
```bash
npm i
```


3. Set environment variables:

- Create a .env file in the project root directory

```bash
touch .env
```

- Set environment variables:

```
MONGO_URI="mongodb://127.0.0.1/"
MONGO_DB_NAME="test"
JWT_SECRET="default_secret"
JWT_EXPIRATION="5m"
NODE_ENV="development"
PORT=8443
```

3. Configure an SSL certificate and a private key files to configure https server:

_We need two files, which for this test will be located in the root of the project.
You can generate them using a tool like OpenSSL, as I show below, if you dont have this already installed, you can install it through a package manager such as Homebrew (on macOS) or apt-get (on Linux):_

On project root directory launch the following commands:

- Generate the private.key file

```bash
openssl genrsa -out private.key 2048
```

- Generate the CSR file (Certificate Signing Request)

_There are quite a few fields, but you can leave them blank by pressing enter._

```bash
openssl req -new -key private.key -out request.crt
```

- Sign the certificate with your own authority

_Sign your own certificate for development or testing purposes, you can. Run the following command:_

```bash
openssl x509 -req -in request.crt -signkey private.key -out certificate.crt
```

4. Seed the Mongo database with an admin user:

On project root directory launch the following command:

```bash
node src/scripts/mongoSeed.js
```

## How to run

To launch the server in development mode, on the project root directory

```bash
npm run dev
```

## How to use

Check if everything has gone well and the server is listening

1. Server status request:

Server is using a self-signed certificate, to force curl to ignore the certificate verification, using the -k or –insecure flag, as the following example:

```bash
curl -k GET https://localhost:8443/api/status
```

Sample response:
```bash
{"status":"OK","uptime":110.359981506,"timestamp":"2024-05-28T12:56:58.651Z"}
```

2. Login as administrator user:

Credentials
```
"email": "admin@gmail.com"
"password": "0000"
```

```bash
curl -k --location 'https://localhost:8443/api/auth/sign-in' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "admin@gmail.com",
    "password": "0000"
}'
```

Sample response:
```bash
{"message":"Successful login","accesToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjU0OGM5MjMxMGMwOWM2YmYzZGM5OGUiLCJpYXQiOjE3MTY5MDE2MTAsImV4cCI6MTcxNjkwNTIxMH0.VmYZ5pxQBwCHvhlwTxoco1yl0iF-bzvCYfu8d5DplZA"}
```

### Endpoints

>For the above examples and to properly test the rest of the endpoints, it is recommended to use Postman or a similar tool.
>
>You will also need to disable SSL certificate verification, to disable it in Postman you can follow this [guide](https://learning.>postman.com/docs/sending-requests/authorization/certificates/#troubleshooting-certificate-errors).
>
>It is important to note that disabling SSL certificate verification in a production environment is a bad security practice and can expose the system to significant risks, such as Man-in-the-Middle attacks. Therefore, this practice should be strictly limited to controlled development and test environments. 


_All routes require JWT authentication._

| Method | Path                 | Description                | Only admin |
|--------|----------------------|----------------------------|------------|
| POST   | /api/auth/sign-in    | Login route                |            |
| POST   | /api/auth/sign-up    | Registration route         |            |
| GET    | /api/users/get       | Get all users created      | X          |
| DELETE | /api/users/:id       | Delete a user by id        | X          |
| GET    | /api/products        | Get all products created   | X          |
| GET    | /api/products/search | Search a product           |            |
| GET    | /api/products/user   | Get all products of a user |            |
| GET    | /api/products/:id    | Get a product by id        |            |
| POST   | /api/products        | Create a product           |            |
| PATCH  | /api/products/:id    | Update a product by id     |            |
| DELETE | /api/products/:id    | Delete a product by id     |            |

- Search endpoint (GET /api/products/search):

_First, we will have to create some products because this collection is initially empty. Then, we can perform a search query, as in the following example where we are filtering by {"price"=33}_
_(We can filter by "name", "description", "category" and "price)_


```bash
curl -k --location --globoff 'https://localhost:443/api/products/search?filters={%22price%22%3A33}' \                                   
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjU0OGM5MjMxMGMwOWM2YmYzZGM5OGUiLCJpYXQiOjE3MTY5MDM1MTMsImV4cCI6MTcxNjkwNzExM30.L5icpzPilIeUlk2jDRIZCvOWL_GLPNlrAAtCZSJnODk'
```

Sample response:
```bash
{
  "products": [
    {
      "_id": "66546e3b07ee13fb4d6fe799",
      "name": "product4",
      "description": "test 4 description",
      "category": "TEST category",
      "price": 33,
      "user": "66539c7186aac18f80c53d47",
      "createdAt": "2024-05-27T11:27:55.335Z",
      "updatedAt": "2024-05-27T11:27:55.335Z",
      "__v": 0
    },
    {
      "_id": "66546e4007ee13fb4d6fe79c",
      "name": "product5",
      "description": "test 5 description",
      "category": "TEST category",
      "price": 33,
      "user": "66539c7186aac18f80c53d47",
      "createdAt": "2024-05-27T11:28:00.232Z",
      "updatedAt": "2024-05-27T11:28:00.232Z",
      "__v": 0
    }
  ],
  "count": 2,
  "total": 2
}
```

## Test

To run the tests, in the root directory launch the following command:

```bash
npm test
```

## Project structure

The project is organized as follows:

```bash
/src
  /configs        # Configuration files for different environments, dbs configurations, and other settings.
  /controllers    # Controller functions that handle incoming requests and return responses.
  /interfaces     # TypeScript interfaces and types that define the structure of data used throughout the application.
  /middlewares    # Middleware functions for processing requests before they reach the controllers (e.g., authentication, logging).
  /models         # Database models or ORM entities representing the data schema.
  /repositories   # Repositories that abstract the data access layer and provide methods to interact with the data source.
  /routes         # Route definitions mapping URLs to controller functions.
  /scripts        # Standalone scripts for database migrations, seeders, or other maintenance tasks.
  /services       # Business logic and services that encapsulate the core functionality of the application.
  /utils          # Helper and utility functions used throughout the application.
  /validations    # Schema validations for request data.
  index.ts        # The main entry point of the application.
/test
  /unit           # Unit tests for individual functions.
  /integration    # Integration tests that verify the interaction between different parts of the application.
```

## Main technologies

- Node: v20.12.12
- Express: v4.19.2
- Typescript: 5.4.5
- Mongoose: 8.4.0
- Jest: v29.7.0

### Others

- [helmet](https://github.com/helmetjs/helmet): middleware that focuses on the security of HTTP headers
- [cors](https://github.com/expressjs/cors): middleware that focuses on controlling access to resources from other domains in the context of a web application

