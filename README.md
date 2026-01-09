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
   - Featured products display
   - Smooth scroll to shop section
   - Responsive design

2. **Shop Page** (`/products`)
   - Category filtering (All, Fruits, Juices, Groceries)
   - Alphabetical product sorting
   - Search functionality
   - 2-column grid on mobile
   - Product cards with hover effects

3. **Cart Page** (`/cart`)
   - Add/remove items
   - Quantity adjustment
   - Optional delivery fee toggle (Ksh 100)
   - Subtotal and total calculation
   - Empty cart state
   - Responsive layout

4. **Checkout Page** (`/checkout`)
   - M-Pesa phone number input
   - Simulated STK push
   - Order confirmation
   - Cart clearing on success

5. **Order History** (`/history`)
   - Mock order display
   - Order status tracking
   - Date and amount information

6. **Profile Page** (`/profile`)
   - User information display
   - Editable fields (name, phone, email, location)
   - Points system display
   - Edit/save functionality

#### Admin Panel
1. **Dashboard** (`/admin`)
   - Revenue, orders, users, products stats
   - Recent orders table
   - Horizontal scrollable table on mobile
   - Color-coded stat cards

2. **Products Management** (`/admin/products`)
   - View all products in table
   - Add new products
   - Edit existing products
   - Delete products
   - Search functionality
   - Category filtering (All, Fruits, Juices, Groceries)
   - CRUD operations

3. **Orders Management** (`/admin/orders`)
   - View all orders in card layout
   - Filter by status (All, Pending, Processing, Completed, Cancelled)
   - Search by order ID, customer, phone
   - Process/complete order actions
   - Status badges

4. **Users Management** (`/admin/users`)
   - View all registered users
   - User details (email, phone, location)
   - Points and spending statistics
   - Search functionality

#### Components
- **Navbar**: Fixed navigation with mobile hamburger menu
- **ProductCard**: Reusable product display component
- **Mobile Menu**: Sliding sidebar with overlay

#### State Management
- **ShopContext**: Global cart state using React Context API
- **LocalStorage**: Cart persistence across sessions
- **Functions**: addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount

### Backend (Express.js + MySQL)
- Basic Express server setup
- CORS enabled
- Body parser middleware
- Environment variables support (.env)
- Port: 5000 (configurable)

### Database (MySQL)
- **Users Table**: id, username, email, phone, password, created_at, updated_at
- Products table (to be created)
- Orders table (planned)

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
- [x] Mobile responsiveness
- [x] Category filtering
- [x] Search functionality
- [x] Optional delivery fee
- [x] Profile management
- [x] Basic Express server

### 🔄 In Progress
- [ ] MySQL database integration
- [ ] User authentication (login/registration)
- [ ] Admin authentication
- [ ] Backend API endpoints
- [ ] M-Pesa payment integration

## 📝 Next Steps (Immediate)

### 1. Database Schema Creation
- Create products table
- Create orders table
- Create order_items table
- Set up relationships

### 2. Authentication System
- User registration endpoint
- User login endpoint
- Admin login endpoint
- JWT token generation
- Password hashing (bcrypt)
- Protected routes

### 3. Backend API Development
- **Products API**
  - GET /api/products (fetch all)
  - GET /api/products/:id (fetch single)
  - POST /api/products (admin only)
  - PUT /api/products/:id (admin only)
  - DELETE /api/products/:id (admin only)

- **Orders API**
  - POST /api/orders (create order)
  - GET /api/orders (admin - all orders)
  - GET /api/orders/user/:userId (user orders)
  - PUT /api/orders/:id/status (update status)

- **Users API**
  - POST /api/auth/register
  - POST /api/auth/login
  - POST /api/auth/admin-login
  - GET /api/users/profile
  - PUT /api/users/profile

### 4. Frontend Integration
- Connect Shop page to products API
- Connect Cart to orders API
- Implement real authentication
- Add loading states
- Error handling
- Toast notifications

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
