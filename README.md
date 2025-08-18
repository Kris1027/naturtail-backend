# NaturTail Backend API

E-commerce backend API for pet products built with Node.js, Express, and TypeScript.

## Features

- 🛍️ Product management (CRUD operations)
- 👤 User management with role-based access (admin/user)
- 📦 Order processing with status tracking
- ⚙️ Configurable settings (shipping, store info, etc.)
- 🔒 Security features (Helmet, CORS, rate limiting)
- 📝 Input validation and sanitization
- 🚀 Production-ready error handling

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger
- **Express Rate Limit** - Rate limiting

## Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Run in development mode
pnpm run dev

# Build for production
pnpm run build

# Run in production mode
pnpm run start
```

## Environment Variables

```env
NODE_ENV=development
PORT=3000
API_PREFIX=/api
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## API Endpoints

### Health Check
- `GET /` - API info
- `GET /health` - Server health status

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/role/:role` - Get users by role
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders/user/:userId` - Get user orders
- `GET /api/orders/status/:status` - Get orders by status
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order
- `PUT /api/orders/:id/cancel` - Cancel order

### Settings
- `GET /api/settings` - Get all settings
- `GET /api/settings/shipping` - Get shipping settings
- `PUT /api/settings` - Update settings
- `PUT /api/settings/shipping` - Update shipping settings
- `POST /api/settings/reset` - Reset to defaults

## Data Models

### Product
```typescript
{
  id: string
  name: string
  slug: string
  priceCents: number
  description: string
  imageUrl: string
  gallery: string[]
  categoryId: string
  brand: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
```

### User
```typescript
{
  id: string
  email: string
  password: string (hashed)
  firstName: string
  lastName: string
  role: 'admin' | 'user'
  phone?: string
  address?: Address
  isActive: boolean
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Order
```typescript
{
  id: string
  userId: string
  orderNumber: string
  items: OrderItem[]
  subtotalCents: number
  shippingCents: number
  totalCents: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: PaymentMethod
  shippingAddress: Address
  billingAddress?: Address
  trackingNumber?: string
  createdAt: Date
  updatedAt: Date
}
```

## Shipping Rules

- Free shipping: Orders over $100 (configurable)
- Reduced shipping: Orders over $50 (configurable)
- Standard shipping: All other orders

## Security Features

- Helmet.js for security headers
- CORS configuration
- Rate limiting (100 requests per 15 minutes)
- Input sanitization
- Password minimum length validation
- Email format validation

## Error Handling

All errors return consistent JSON responses:
```json
{
  "success": false,
  "error": "Error message"
}
```

## Development

```bash
# Run with hot reload
pnpm run dev

# Build TypeScript
pnpm run build

# Run tests (to be implemented)
pnpm test
```

## License

ISC