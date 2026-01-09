# Staffoods Backend Setup Guide

## Prerequisites
- Node.js 16+ installed
- MySQL 8.0+ installed and running
- npm or yarn package manager

## Step-by-Step Setup

### 1. Database Setup

**Create the database:**
```sql
CREATE DATABASE staffoods CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**Run the schema file:**
```bash
mysql -u root -p staffoods < backend/database/schema.sql
```

Or manually execute the SQL file in your MySQL client (phpMyAdmin, MySQL Workbench, etc.)

### 2. Environment Configuration

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=staffoods

# JWT Secret (Change this to a random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Node Environment
NODE_ENV=development
```

**Important:** Change the `JWT_SECRET` to a strong random string in production!

### 3. Install Dependencies

```bash
cd backend
npm install
```

Dependencies installed:
- express
- cors
- body-parser
- dotenv
- mysql2
- bcryptjs
- jsonwebtoken
- nodemon (dev dependency)

### 4. Create Default Admin User

After running the schema, you need to hash a password for the admin user.

**Option 1: Use Node.js REPL**
```bash
node
```

```javascript
const bcrypt = require('bcryptjs');
const password = 'admin123'; // Change this!
bcrypt.hash(password, 10).then(hash => console.log(hash));
```

Copy the hashed password and update the admin_users table:

```sql
UPDATE admin_users 
SET password = 'your_hashed_password_here' 
WHERE email = 'admin@staffoods.com';
```

**Option 2: Create admin via SQL**
```sql
INSERT INTO admin_users (username, email, password, role) VALUES
('admin', 'admin@staffoods.com', '$2a$10$YourHashedPasswordHere', 'super_admin');
```

### 5. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:5000`

### 6. Test the API

**Test server:**
```bash
curl http://localhost:5000
```

Expected response:
```json
{"message": "Staffoods API Server Running"}
```

**Test user registration:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "phone": "+254712345678",
    "password": "password123",
    "location": "Nairobi"
  }'
```

**Test user login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Test admin login:**
```bash
curl -X POST http://localhost:5000/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@staffoods.com",
    "password": "admin123"
  }'
```

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

### 3. Test Authentication

1. Navigate to `http://localhost:5173/register`
2. Create a new account
3. Login at `http://localhost:5173/login`
4. Access admin panel at `http://localhost:5173/admin-login`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/admin-login` - Admin login

### Products (To be implemented)
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders (To be implemented)
- `POST /api/orders` - Create order
- `GET /api/orders` - Get all orders (admin)
- `GET /api/orders/user/:userId` - Get user orders
- `PUT /api/orders/:id/status` - Update order status (admin)

### Users (To be implemented)
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - Get all users (admin)

## Troubleshooting

### Database Connection Error
- Verify MySQL is running
- Check database credentials in `.env`
- Ensure database `staffoods` exists

### Port Already in Use
Change the PORT in `.env` file:
```env
PORT=5001
```

### CORS Errors
The backend is configured to allow all origins in development. For production, update CORS settings in `server.js`:
```javascript
app.use(cors({
  origin: 'https://your-frontend-domain.com'
}));
```

### JWT Token Errors
- Ensure JWT_SECRET is set in `.env`
- Token expires after 7 days by default
- Clear localStorage if experiencing auth issues

## Production Deployment

### Backend (Railway/Render)
1. Push code to GitHub
2. Connect repository to Railway/Render
3. Set environment variables
4. Deploy

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Deploy

### Database (PlanetScale/Railway)
1. Create MySQL database
2. Import schema
3. Update backend .env with production credentials

## Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT_SECRET
- [ ] Enable HTTPS in production
- [ ] Set proper CORS origins
- [ ] Use environment variables for secrets
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Sanitize user inputs
- [ ] Enable SQL injection protection
- [ ] Add request logging

## Next Steps

1. Implement product API endpoints
2. Implement order API endpoints
3. Add authentication middleware
4. Integrate M-Pesa payment
5. Add email notifications
6. Implement file upload for product images
7. Add admin dashboard API
8. Implement search functionality
9. Add pagination
10. Set up automated backups

## Support

For issues, check:
- Server logs in terminal
- Browser console for frontend errors
- MySQL error logs
- Network tab in browser DevTools

---
**Last Updated:** January 2026
