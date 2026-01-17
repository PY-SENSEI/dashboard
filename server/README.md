# CRM Backend API

Express.js + MongoDB backend for the CRM application.

## Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB connection string and JWT secret:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/crm
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

4. Start MongoDB (if running locally):
```bash
mongod
```

5. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Leads

All lead endpoints require authentication (Bearer token in Authorization header)

- `GET /api/leads` - Get all leads (supports query params: status, search, sortBy, order)
- `GET /api/leads/:id` - Get single lead
- `POST /api/leads` - Create new lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead
- `GET /api/leads/stats/overview` - Get lead statistics

### Health Check

- `GET /api/health` - Server health check

## Usage Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Create Lead
```bash
curl -X POST http://localhost:5000/api/leads \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@company.com",
    "company": "Tech Corp",
    "phone": "+1234567890",
    "status": "new",
    "value": 50000,
    "source": "Website"
  }'
```

### Get All Leads
```bash
curl -X GET http://localhost:5000/api/leads \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Filter and Search Leads
```bash
# Filter by status
curl -X GET "http://localhost:5000/api/leads?status=qualified" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Search by name/email/company
curl -X GET "http://localhost:5000/api/leads?search=jane" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Sort by value
curl -X GET "http://localhost:5000/api/leads?sortBy=value&order=desc" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Data Models

### User
```javascript
{
  email: String (required, unique),
  password: String (required, hashed),
  name: String (required),
  role: String (admin/user, default: user),
  createdAt: Date,
  updatedAt: Date
}
```

### Lead
```javascript
{
  name: String (required),
  email: String (required),
  phone: String,
  company: String,
  status: String (new/contacted/qualified/proposal/negotiation/won/lost),
  value: Number,
  source: String,
  notes: String,
  assignedTo: ObjectId (ref: User),
  createdBy: ObjectId (ref: User, required),
  createdAt: Date,
  updatedAt: Date
}
```

## Security

- Passwords are hashed using bcrypt
- JWT tokens expire after 7 days
- All lead endpoints require authentication
- Input validation on all routes
- MongoDB injection protection via Mongoose

## Error Handling

The API returns consistent error responses:

```javascript
{
  "message": "Error description",
  "errors": [] // Optional array of validation errors
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request (validation errors)
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error
