# Node.js REST API with TypeScript, Redis & Docker

Production-grade REST API built with Node.js, TypeScript, Express, MongoDB, and Redis.

## 🚀 Features

- **TypeScript** - Type-safe development
- **Express.js** - Fast, unopinionated web framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **Redis** - In-memory caching and session management
- **Docker** - Containerized deployment
- **JWT Authentication** - Secure token-based auth
- **Rate Limiting** - Redis-based distributed rate limiting
- **Security** - Helmet, CORS, input validation
- **Logging** - Morgan for HTTP request logging

## 📋 Prerequisites

- Node.js >= 18.0.0
- Docker & Docker Compose
- npm >= 9.0.0

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd node-rest-api-typescript
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```bash
# Application
NODE_ENV=development
PORT=3000

# Database
MONGODB_URI=mongodb://admin:password123@mongodb:27017/myapp?authSource=admin
MONGO_USERNAME=admin
MONGO_PASSWORD=password123

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=redis_secret_password

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
```

## 🐳 Docker Setup

### Development Mode

```bash
# Start all services (MongoDB, Redis, App, Admin UIs)
npm run docker:dev

# Or manually
docker-compose -f docker-compose.dev.yml up -d

# View logs
npm run docker:logs
```

**Services available:**
- API: http://localhost:3000
- MongoDB: mongodb://localhost:27017
- Redis: localhost:6379
- Mongo Express: http://localhost:8082
- Redis Commander: http://localhost:8081

### Production Mode

```bash
# Build production image
npm run docker:build

# Start production services
npm run docker:prod

# Stop services
npm run docker:down
```

## 💻 Local Development (Without Docker)

### 1. Start MongoDB and Redis locally

```bash
# Using Homebrew (macOS)
brew install mongodb-community redis
brew services start mongodb-community
brew services start redis

# Or use Docker for just MongoDB and Redis
docker run -d -p 27017:27017 --name mongodb mongo:7.0
docker run -d -p 6379:6379 --name redis redis:7-alpine
```

### 2. Update .env for local development

```bash
MONGODB_URI=mongodb://localhost:27017/myapp
REDIS_HOST=localhost
```

### 3. Run the application

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
📦 NODE-MONGOOSE-JWT-APIS-TS
│
├── .dockerignore
├── .eslintignore
├── .env
├── .gitignore
├── .prettierrc
├── LICENSE
├── docker-compose.yml
├── docker-compose.dev.yml
├── Dockerfile
├── eslint.config.js
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.json
├── tsconfig.build.json
│
├── .vscode/
│   └── settings.json
│
├── logs/                           # Runtime logs (ignored by Git)
│
├── src/
│   ├── server.ts                   # Application entry point
│   │
│   ├── config/                     # Configuration files
│   │   ├── db.ts                   # MongoDB connection setup
│   │   └── redis.ts                # Redis client setup
│   │
│   ├── controllers/                # Route controllers
│   │   ├── auth.controller.ts
│   │   └── user.controller.ts
│   │
│   ├── middleware/                 # Custom middlewares
│   │   ├── auth.middleware.ts
│   │   ├── cache.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── redisRateLimiter.middleware.ts
│   │
│   ├── models/                     # Database models
│   │   └── user.model.ts
│   │
│   ├── routes/                     # Express route definitions
│   │   ├── auth.routes.ts
│   │   └── user.routes.ts
│   │
│   ├── services/                   # Business logic layer
│   │   ├── auth.service.ts
│   │   ├── cache.service.ts
│   │   └── user.service.ts
│   │
│   ├── types/                      # Type definitions
│   │   └── express.d.ts
│   │
│   ├── utils/                      # Reusable utility functions
│   │   ├── ApiError.ts
│   │   ├── asyncHandler.ts
│   │   ├── generateToken.ts
│   │   └── redisUtils.ts
│   │
│   └── validations/                # Joi/Zod schema validations
│       ├── auth.validation.ts
│       └── user.validation.ts
│
└── tests/                          # Jest or Mocha test cases
    ├── auth.test.ts
    └── user.test.ts


```

## 🔑 Redis Usage Examples

### Caching

```typescript
import { cacheService } from './services/cache.service';

// Cache user data
await cacheService.cacheUser(userId, userData, 3600);

// Get cached user
const user = await cacheService.getCachedUser(userId);

// Cache query results
await cacheService.cacheQuery('allUsers', users);
```

### Rate Limiting

```typescript
import { redisRateLimiter } from './middleware/redisRateLimiter.middleware';

// Custom rate limiter
app.use('/api/expensive', redisRateLimiter({
  windowMs: 60000,  // 1 minute
  max: 10,          // 10 requests per minute
}));
```

### Session Management

```typescript
// Create session
await cacheService.createSession(sessionId, userId, 86400);

// Get session
const session = await cacheService.getSession(sessionId);

// Delete session
await cacheService.deleteSession(sessionId);
```

## 🔒 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users` - Get all users (cached)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Health Check
- `GET /health` - Server health status

## 📊 Monitoring

### Redis Commander
Access Redis GUI at http://localhost:8081
- View all keys
- Monitor memory usage
- Execute Redis commands

### Mongo Express
Access MongoDB GUI at http://localhost:8082
- Browse collections
- Run queries
- Manage documents

## 🧪 Testing

```bash
npm test
```

## 📝 Scripts

```bash
npm run dev          # Development mode with hot reload
npm run build        # Build TypeScript to JavaScript
npm start            # Start production server
npm run lint         # Lint code
npm run lint:fix     # Fix linting errors
npm run format       # Format code with Prettier

# Docker scripts
npm run docker:dev   # Start development environment
npm run docker:prod  # Start production environment
npm run docker:down  # Stop all containers
npm run docker:logs  # View container logs
npm run docker:build # Build Docker images
```

## 🚢 Deployment

### Docker Production Deployment

1. **Build the image:**
```bash
docker build -t your-api:latest .
```

2. **Push to registry:**
```bash
docker tag your-api:latest your-registry/your-api:latest
docker push your-registry/your-api:latest
```

3. **Deploy to server:**
```bash
docker-compose -f docker-compose.yml up -d
```

### Environment Variables for Production

Ensure these are set in production:
- Generate strong `JWT_SECRET`
- Use secure database passwords
- Set `NODE_ENV=production`
- Configure proper `CORS_ORIGIN`

## 🔐 Security Features

- ✅ Helmet.js for security headers
- ✅ CORS configuration
- ✅ Rate limiting with Redis
- ✅ JWT token authentication
- ✅ Password hashing with Argon2
- ✅ Input validation with Joi
- ✅ Token blacklisting for logout
- ✅ Graceful shutdown handling

## 📚 Technologies

- **Node.js** - Runtime environment
- **TypeScript** - Type safety
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Redis** - Caching & sessions
- **Docker** - Containerization
- **JWT** - Authentication
- **Argon2** - Password hashing

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT

## 👨‍💻 Author

Your Name

---

Made with ❤️ and TypeScript