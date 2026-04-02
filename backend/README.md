# Digital Menu Backend API

Node.js + Express + TypeScript + Prisma backend za Digital Menu SaaS sistem.

## Tehnologije

- **Node.js** + **Express.js**
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL**
- **JWT Authentication**
- **Express Validator**
- **Helmet**, **CORS**, **Morgan**

## API Endpoints

### Products
- `GET /api/products` - Get all products (with pagination, filtering)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/categories/list` - Get all categories

### Orders
- `GET /api/orders` - Get all orders (with pagination, filtering)
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Cancel/delete order
- `GET /api/orders/status/list` - Get all order statuses

### Tables
- `GET /api/tables` - Get all tables (with pagination, filtering)
- `GET /api/tables/:id` - Get table by ID
- `GET /api/tables/qr/:qrCode` - Get table by QR code
- `POST /api/tables` - Create new table
- `PUT /api/tables/:id` - Update table
- `PUT /api/tables/:id/status` - Update table status
- `DELETE /api/tables/:id` - Delete table
- `GET /api/tables/status/list` - Get all table statuses

### Health Check
- `GET /health` - Server health check

## Setup

### 1. Instalacija
```bash
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
# Edit .env with your database configuration
```

### 3. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run migrations (when database is configured)
npx prisma migrate dev

# (Optional) Seed database with sample data
npx prisma db seed
```

### 4. Development
```bash
npm run dev
```

### 5. Production Build
```bash
npm run build
npm start
```

## Database Models

### Product
- `id` - Unique identifier
- `name` - Product name
- `description` - Product description
- `price` - Product price
- `image` - Product image URL
- `category` - Product category
- `available` - Availability status
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Order
- `id` - Unique identifier
- `orderNumber` - Unique order number
- `status` - Order status (PENDING, CONFIRMED, PREPARING, READY, COMPLETED, CANCELLED)
- `totalAmount` - Total order amount
- `customerName` - Customer name (optional)
- `customerEmail` - Customer email (optional)
- `tableId` - Associated table ID (optional)
- `notes` - Order notes (optional)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### OrderItem
- `id` - Unique identifier
- `quantity` - Item quantity
- `price` - Item price (at time of order)
- `orderId` - Associated order ID
- `productId` - Associated product ID
- `createdAt` - Creation timestamp

### Table
- `id` - Unique identifier
- `number` - Table number (unique)
- `qrCode` - QR code (unique)
- `capacity` - Table capacity (optional)
- `status` - Table status (AVAILABLE, OCCUPIED, RESERVED, MAINTENANCE)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## Validation Rules

### Products
- `name`: 1-255 characters, required
- `price`: Must be greater than 0, required
- `category`: 1-100 characters, required
- `description`: Max 1000 characters, optional
- `available`: Boolean, optional

### Orders
- `customerName`: 1-255 characters, optional
- `customerEmail`: Valid email format, optional
- `tableId`: Valid UUID, optional
- `notes`: Max 500 characters, optional
- `items`: Array of order items, at least 1 required
- `items.productId`: Valid UUID, required
- `items.quantity`: Integer >= 1, required

### Tables
- `number`: 1-50 characters, required
- `capacity`: Integer 1-20, optional
- `status`: One of AVAILABLE, OCCUPIED, RESERVED, MAINTENANCE, optional

## Error Handling

All errors return JSON format:
```json
{
  "error": {
    "message": "Error description",
    "details": "Additional error details (for validation errors)"
  }
}
```

## Rate Limiting

- Default: 100 requests per 15 minutes per IP
- Configurable via environment variables

## Security

- Helmet.js for security headers
- CORS enabled (configurable origins)
- Input validation and sanitization
- SQL injection prevention via Prisma ORM
- XSS protection

## Environment Variables

See `.env.example` for all available configuration options.

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests (when implemented)

## Contributing

1. Follow TypeScript best practices
2. Write meaningful commit messages
3. Add proper error handling
4. Include validation for all inputs
5. Write tests for new features

## License

ISC
