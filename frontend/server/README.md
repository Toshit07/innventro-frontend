# Innoventure Backend

Complete Node.js + Express backend for the Innoventure luxury perfume store.

## Features

- ✅ User authentication (Register, Login, JWT)
- ✅ Product management with filtering & search
- ✅ Shopping cart functionality
- ✅ Order management & tracking
- ✅ Stripe payment integration
- ✅ Product reviews & ratings
- ✅ Admin dashboard
- ✅ MongoDB database
- ✅ Role-based access control

## Setup

### 1. Install Dependencies

\`\`\`bash
cd server
npm install
\`\`\`

### 2. Configure Environment

Copy `.env.example` to `.env` and update values:

\`\`\`bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/innoventure
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=your_stripe_key
\`\`\`

### 3. MongoDB Setup

**Option A: Local MongoDB**
```bash
# Install MongoDB Community Edition
# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas (Cloud)**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/innoventure
```

### 4. Seed Database

\`\`\`bash
npm run seed
\`\`\`

### 5. Run Server

**Development:**
\`\`\`bash
npm run dev
\`\`\`

**Production:**
\`\`\`bash
npm start
\`\`\`

Server runs on http://localhost:5000

## API Endpoints

### Authentication
- \`POST /api/auth/register\` - Register new user
- \`POST /api/auth/login\` - User login
- \`POST /api/auth/verify\` - Verify token

### Products
- \`GET /api/products\` - Get all products (with filters: family, occasion, sort)
- \`GET /api/products/:id\` - Get single product
- \`GET /api/products/search/query?q=perfume\` - Search products
- \`POST /api/products/:id/reviews\` - Add review

### Users
- \`GET /api/users/profile\` - Get user profile (requires auth)
- \`PUT /api/users/profile\` - Update profile
- \`PUT /api/users/change-password\` - Change password

### Cart
- \`GET /api/cart\` - Get cart (requires auth)
- \`POST /api/cart/add\` - Add to cart
- \`PUT /api/cart/item/:productId\` - Update item quantity
- \`DELETE /api/cart/item/:productId\` - Remove item
- \`DELETE /api/cart\` - Clear cart

### Orders
- \`GET /api/orders\` - Get user orders (requires auth)
- \`GET /api/orders/:id\` - Get order details
- \`POST /api/orders\` - Create order from cart
- \`PUT /api/orders/:id/cancel\` - Cancel order

### Payments
- \`POST /api/payments/create-intent\` - Create Stripe payment intent
- \`POST /api/payments/confirm\` - Confirm payment
- \`POST /api/payments/webhook\` - Stripe webhook

### Admin
- \`GET /api/admin/stats\` - Dashboard statistics
- \`GET /api/admin/users\` - Get all users
- \`GET /api/admin/orders\` - Get all orders
- \`PUT /api/admin/orders/:id\` - Update order status
- \`POST /api/admin/products\` - Create product
- \`PUT /api/admin/products/:id\` - Update product
- \`DELETE /api/admin/products/:id\` - Delete product

## Authentication

Send JWT token in Authorization header:
\`\`\`
Authorization: Bearer <token>
\`\`\`

## Frontend Integration

Update your frontend API base URL:

\`\`\`javascript
const API_URL = 'http://localhost:5000/api';
\`\`\`

## Default Admin Credentials

Email: admin@innoventure.com
Password: admin123

⚠️ Change these in production!

## Stripe Setup

1. Get API keys from [Stripe Dashboard](https://dashboard.stripe.com)
2. Update \`.env\` with \`STRIPE_SECRET_KEY\`
3. For webhooks, use: \`http://localhost:5000/api/payments/webhook\`

## Database Models

- **User** - Customer profiles
- **Product** - Perfume products
- **Cart** - Shopping carts
- **Order** - Customer orders
- **Review** - Product reviews

## Project Structure

\`\`\`
server/
├── index.js              # Main server file
├── package.json
├── .env.example
├── middleware/           # Auth middleware
├── models/              # Database schemas
├── routes/              # API routes
├── scripts/             # Utilities (seeding)
└── README.md
\`\`\`

## License

MIT
