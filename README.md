# Staffoods - E-Commerce Grocery Platform

## 🎯 Project Overview
Staffoods is a modern e-commerce platform for selling fresh fruits, juices, and groceries in Kenya. Built with React (Vite) frontend and Express.js backend with MySQL database.

## 🎨 Brand Identity
- **Primary Color**: Yellowish (#FFCC00)
- **Background**: #b1ab36
- **Design**: Modern, responsive, premium feel with micro-animations

## 📋 Completed Features

### Frontend (React + Vite)
#### User-Facing Pages
1. **Home Page** (`/`)
   - Hero section with custom background image
   - Featured products display (fetched from API)
   - Smooth scroll to shop section
   - Responsive design
   - **✅ Navbar included**

2. **Shop Page** (`/products`)
   - Category filtering (All, Fruits, Juices, Groceries)
   - Alphabetical product sorting
   - **✅ Products fetched from MySQL database via API**
   - Loading, error, and empty states
   - 2-column grid on mobile
   - Product cards with hover effects
   - **✅ Navbar included**

3. **Cart Page** (`/cart`)
   - Add/remove items
   - Quantity adjustment
   - Optional delivery fee toggle (Ksh 100)
   - Subtotal and total calculation
   - Empty cart state
   - Responsive layout
   - **✅ Navbar included**

4. **Checkout Page** (`/checkout`) - **🔒 Protected Route**
   - M-Pesa phone number input
   - Simulated STK push
   - Order confirmation
   - Cart clearing on success
   - **✅ Navbar included**

5. **Order History** (`/history`) - **🔒 Protected Route**
   - Mock order display
   - Order status tracking
   - Date and amount information
   - **✅ Navbar included**

6. **Profile Page** (`/profile`) - **🔒 Protected Route**
   - **✅ User data fetched from MySQL database**
   - Editable fields (username, email, phone)
   - Points system display
   - Total orders and spending statistics
   - Edit/save functionality with API integration
   - **✅ Navbar included**

7. **Authentication Pages**
   - **Login** (`/login`) - JWT authentication
   - **Register** (`/register`) - User registration with password hashing
   - **Admin Login** (`/admin-login`) - Separate admin authentication
   - Responsive design with brand colors
   - Password visibility toggle
   - Error handling and validation

#### Admin Panel
1. **Dashboard** (`/admin`)
   - Revenue, orders, users, products stats
   - Recent orders table
   - Horizontal scrollable table on mobile
   - Color-coded stat cards
   - Mobile header with menu toggle

2. **Products Management** (`/admin/products`)
   - View all products in table
   - Add new products
   - Edit existing products
   - Delete products
   - Search functionality
   - Category filtering (All, Fruits, Juices, Groceries)
   - CRUD operations
   - Mobile responsive with header

3. **Orders Management** (`/admin/orders`)
   - View all orders in card layout
   - Filter by status (All, Pending, Processing, Completed, Cancelled)
   - Search by order ID, customer, phone
   - Process/complete order actions
   - Status badges
   - Mobile responsive with header

4. **Users Management** (`/admin/users`)
   - View all registered users
   - User details (email, phone, location)
   - Points and spending statistics
   - Search functionality
   - Mobile responsive with header

#### Components
- **Navbar**: Fixed navigation with mobile hamburger menu
  - **✅ Conditional rendering based on authentication**
  - **✅ Login/Signup buttons for unauthenticated users**
  - **✅ Profile icon and Orders link for authenticated users**
  - **✅ Logout functionality**
- **ProductCard**: Reusable product display component
- **ProtectedRoute**: Authentication guard for protected pages
- **Mobile Menu**: Sliding sidebar with overlay

#### State Management
- **ShopContext**: Global cart state using React Context API
- **AuthContext**: **✅ JWT-based authentication state management**
  - User login/logout
  - Token storage in localStorage
  - Persistent authentication
  - User data management
- **LocalStorage**: Cart and auth persistence across sessions
- **Functions**: addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount

### Backend (Express.js + MySQL) - **✅ FULLY IMPLEMENTED**

#### API Endpoints
**Authentication** (`/api/auth`)
- ✅ `POST /api/auth/register` - User registration with bcrypt hashing
- ✅ `POST /api/auth/login` - User login with JWT token generation
- ✅ `POST /api/auth/admin-login` - Admin authentication

**Products** (`/api/products`) - **✅ NEW**
- ✅ `GET /api/products` - Fetch all products (with optional category filter)
- ✅ `GET /api/products/:id` - Fetch single product
- ✅ `POST /api/products` - Create product (admin)
- ✅ `PUT /api/products/:id` - Update product (admin)
- ✅ `DELETE /api/products/:id` - Delete product (admin)

**Users** (`/api/users`) - **✅ NEW**
- ✅ `GET /api/users/profile/:userId` - Fetch user profile with points
- ✅ `PUT /api/users/profile/:userId` - Update user profile

#### Database Schema (MySQL)
- **✅ users** - User accounts (id, username, email, phone, password, created_at, updated_at)
- **✅ products** - Product catalog (id, name, category, price, image, description, stock_quantity, is_available)
- **✅ user_points** - Loyalty program (user_id, points, total_spent, total_orders)
- **✅ admin_users** - Admin accounts (id, username, email, password, role, is_active)
- **📋 orders** - Order tracking (planned)
- **📋 order_items** - Order details (planned)

#### Security Features
- ✅ Password hashing with bcrypt
- ✅ JWT token authentication (7-day expiration)
- ✅ Protected routes with authentication middleware
- ✅ CORS enabled for frontend communication
- ✅ Environment variables for sensitive data

### Styling & Responsiveness
- Custom CSS with utility classes
- Mobile-first responsive design
- Breakpoints: 480px, 768px, 1024px
- Fixed navbar on mobile
- 2-column product grid on mobile
- Horizontal scrollable tables
- Touch-friendly interactions

### Product Inventory
- **28 Products** including:
  - Fruits: Apple Mangoes, Ngowe Mangoes, Kent Mangoes, Bananas, Avocados, Passion Fruits, Pineapple, Pawpaw, etc.
  - Juices: Mango, Passion, Orange, Watermelon, Pineapple Mint, Beetroot Carrot, etc.
  - Groceries: Rice, Cooking Oil, Matoke

## 🚀 Current Implementation Status

### ✅ Completed
- [x] Frontend UI/UX design
- [x] Product catalog with 28+ items
- [x] Shopping cart functionality
- [x] Admin panel (Dashboard, Products, Orders, Users)
- [x] Mobile responsiveness with headers on all pages
- [x] Category filtering
- [x] Search functionality
- [x] Optional delivery fee
- [x] Profile management
- [x] **JWT-based authentication system**
- [x] **User registration and login**
- [x] **Admin authentication**
- [x] **Protected routes (/profile, /history, /checkout)**
- [x] **MySQL database integration**
- [x] **Products API (CRUD operations)**
- [x] **Users API (profile management)**
- [x] **Products fetched from database**
- [x] **User profile data from database**
- [x] **Conditional navbar rendering**
- [x] **Persistent authentication**

### 🔄 In Progress
- [ ] Orders API implementation
- [ ] M-Pesa payment integration
- [ ] Admin panel API integration

## 📝 Next Steps (Immediate)

### 1. Orders Management Backend
- Create orders API endpoints
  - POST /api/orders (create order)
  - GET /api/orders (admin - all orders)
  - GET /api/orders/user/:userId (user orders)
  - PUT /api/orders/:id/status (update status)
- Connect frontend checkout to orders API
- Implement order history from database

### 2. Admin Panel Backend Integration
- Connect admin dashboard to real statistics
- Integrate admin products page with products API
- Connect admin orders page to orders API
- Link admin users page to users API
- Add authentication middleware for admin routes

### 3. M-Pesa Integration
- Daraja API setup
- STK Push implementation
- Payment verification
- Callback handling
- Order status updates

### 4. Image Management
- Set up image upload functionality
- Store product images in public folder
- Update image paths in database
- Implement image optimization

## 🔮 Future Enhancements

### Phase 1: Core Features
1. **Real M-Pesa Integration**
   - Daraja API integration
   - STK Push implementation
   - Payment verification
   - Callback handling

2. **Order Tracking**
   - Real-time order status updates
   - Email/SMS notifications
   - Delivery tracking

3. **User Features**
   - Wishlist functionality
   - Product reviews and ratings
   - Order history with details
   - Reorder functionality

### Phase 2: Advanced Features
1. **Loyalty Program**
   - Points accumulation system
   - Rewards redemption
   - Tier-based benefits
   - Referral program

2. **Inventory Management**
   - Stock tracking
   - Low stock alerts
   - Automatic reordering
   - Supplier management

3. **Analytics Dashboard**
   - Sales reports
   - Revenue analytics
   - Customer insights
   - Product performance

4. **Marketing Tools**
   - Promotional codes/coupons
   - Flash sales
   - Email campaigns
   - Push notifications

### Phase 3: Scaling
1. **Performance Optimization**
   - Image optimization (WebP, lazy loading)
   - CDN integration
   - Caching strategies
   - Database indexing

2. **Multi-vendor Support**
   - Vendor registration
   - Vendor dashboards
   - Commission management
   - Vendor analytics

3. **Mobile App**
   - React Native app
   - Push notifications
   - Offline mode
   - Biometric authentication

4. **Advanced Search**
   - Elasticsearch integration
   - Filters (price, rating, availability)
   - Auto-suggestions
   - Voice search

## 🛠️ Technology Stack

### Frontend
- React 18
- Vite
- React Router DOM
- Lucide React (icons)
- Context API (state management)
- CSS3 (custom styling)

### Backend
- Node.js
- Express.js
- MySQL2
- CORS
- dotenv
- bcryptjs (planned)
- jsonwebtoken (planned)

### Database
- MySQL 8.0+

### Deployment (Planned)
- Frontend: Vercel
- Backend: Railway/Render/AlwaysData
- Database: PlanetScale/Railway

## 📁 Project Structure
```
Staffood/
├── frontend/
│   ├── public/
│   │   ├── hero.png
│   │   ├── mangoes.png
│   │   └── [product images]
│   ├── src/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminProducts.jsx
│   │   │   ├── AdminOrders.jsx
│   │   │   └── AdminUsers.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProductCard.jsx
│   │   ├── context/
│   │   │   └── ShopContext.jsx
│   │   ├── data/
│   │   │   └── products.js
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Shop.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── OrderHistory.jsx
│   │   │   └── Profile.jsx
│   │   ├── App.jsx
│   │   └── index.css
│   ├── vercel.json
│   └── package.json
├── backend/
│   ├── server.js
│   ├── .env
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- MySQL 8.0+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Staffood
```

2. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

3. **Backend Setup**
```bash
cd backend
npm install
# Create .env file with database credentials
npm start
```

4. **Database Setup**
- Create MySQL database
- Run SQL schema files
- Update .env with credentials

### Environment Variables

**Backend (.env)**
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=staffoods
JWT_SECRET=your_secret_key
```

## 📱 Responsive Design
- Mobile: < 768px (2-column grid)
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🎨 Design Features
- Yellowish brand color (#FFCC00)
- Smooth animations
- Hover effects
- Card-based layouts
- Fixed navigation
- Mobile hamburger menu
- Sliding admin sidebar

## 👥 Contributors
- Development Team

## 📄 License
MIT License

## 📞 Support
For issues and questions, please open an issue in the repository.

---
**Last Updated**: January 2026
**Version**: 1.0.0 (Development)
