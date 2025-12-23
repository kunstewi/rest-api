# REST API with Authentication

A complete RESTful API built with Node.js, Express, TypeScript, and MongoDB featuring user authentication and CRUD operations.

## Features

- 🔐 User authentication with session tokens
- 🍪 Cookie-based session management
- 🔒 Protected routes with middleware
- 👤 User CRUD operations
- 🔑 Password hashing with crypto
- 📝 TypeScript for type safety
- 🗄️ MongoDB database

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: Custom session-based auth with crypto

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/kunstewi/rest-api.git
cd rest-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/rest-api
SECRET=your-secret-key-here
```

## Running the Application

### Development Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or your configured PORT).

## API Endpoints

### Authentication

#### Register a New User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response**: Sets a session cookie `KUNSTEWI-AUTH`

#### Logout
```http
POST /auth/logout
```

**Note**: Requires authentication cookie

---

### User Management

All user endpoints require authentication (session cookie).

#### Get All Users
```http
GET /users
Cookie: KUNSTEWI-AUTH=<session-token>
```

#### Get User by ID
```http
GET /users/:id
Cookie: KUNSTEWI-AUTH=<session-token>
```

#### Update User
```http
PATCH /users/:id
Cookie: KUNSTEWI-AUTH=<session-token>
Content-Type: application/json

{
  "username": "new_username"
}
```

**Note**: Users can only update their own profile

#### Delete User
```http
DELETE /users/:id
Cookie: KUNSTEWI-AUTH=<session-token>
```

**Note**: Users can only delete their own account

## Project Structure

```
rest-api/
├── src/
│   ├── controllers/
│   │   ├── authenticationController.ts  # Auth logic
│   │   └── userController.ts            # User CRUD logic
│   ├── db/
│   │   ├── db.ts                        # Database connection
│   │   └── users.ts                     # User model & queries
│   ├── helpers/
│   │   └── helper.ts                    # Crypto utilities
│   ├── middlewares/
│   │   ├── isAuthenticated.ts           # Auth middleware
│   │   └── isOwner.ts                   # Ownership middleware
│   ├── router/
│   │   ├── authenticationRouter.ts      # Auth routes
│   │   ├── userRouter.ts                # User routes
│   │   └── router.ts                    # Main router
│   ├── index.ts                         # App entry point
│   └── types.ts                         # TypeScript types
├── .env.example                         # Environment template
├── .gitignore
├── nodemon.json
├── package.json
└── tsconfig.json
```

## Middleware

### `isAuthenticated`
Verifies that the user has a valid session token in their cookies. Attaches the user object to `req.identity`.

### `isOwner`
Verifies that the authenticated user owns the resource they're trying to modify (based on URL parameter ID).

## Security Features

- Passwords are hashed using HMAC-SHA256 with unique salts
- Session tokens are generated using crypto random bytes
- Authentication state is maintained via HTTP-only cookies
- Protected routes require valid session tokens
- Ownership verification prevents unauthorized modifications

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"test123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}' \
  -c cookies.txt
```

### Get All Users (with auth)
```bash
curl -X GET http://localhost:5000/users \
  -b cookies.txt
```

### Update User (with auth)
```bash
curl -X PATCH http://localhost:5000/users/<user-id> \
  -H "Content-Type: application/json" \
  -d '{"username":"newusername"}' \
  -b cookies.txt
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/rest-api` |
| `SECRET` | Secret key for hashing | `your-secret-key` |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC

## Author

kunstewi

## Repository

[https://github.com/kunstewi/rest-api](https://github.com/kunstewi/rest-api)
