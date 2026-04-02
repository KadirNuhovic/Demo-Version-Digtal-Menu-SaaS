# Backend Folder Struktura

```
backend/
├── src/
│   ├── controllers/         # Request handleri
│   │   ├── auth/
│   │   │   ├── authController.ts
│   │   │   ├── userController.ts
│   │   │   └── roleController.ts
│   │   ├── menu/
│   │   │   ├── menuController.ts
│   │   │   ├── categoryController.ts
│   │   │   └── itemController.ts
│   │   ├── orders/
│   │   │   ├── orderController.ts
│   │   │   ├── cartController.ts
│   │   │   └── paymentController.ts
│   │   ├── restaurants/
│   │   │   ├── restaurantController.ts
│   │   │   ├── tableController.ts
│   │   │   └── qrController.ts
│   │   └── admin/
│   │       ├── adminController.ts
│   │       ├── analyticsController.ts
│   │       └── reportsController.ts
│   ├── services/            # Business logic
│   │   ├── auth/
│   │   │   ├── authService.ts
│   │   │   ├── jwtService.ts
│   │   │   └── passwordService.ts
│   │   ├── menu/
│   │   │   ├── menuService.ts
│   │   │   ├── categoryService.ts
│   │   │   └── itemService.ts
│   │   ├── orders/
│   │   │   ├── orderService.ts
│   │   │   ├── cartService.ts
│   │   │   ├── paymentService.ts
│   │   │   └── notificationService.ts
│   │   ├── restaurants/
│   │   │   ├── restaurantService.ts
│   │   │   ├── tableService.ts
│   │   │   └── qrService.ts
│   │   ├── socket/
│   │   │   ├── socketService.ts
│   │   │   ├── orderSocketHandler.ts
│   │   │   └── notificationSocketHandler.ts
│   │   └── external/
│   │       ├── emailService.ts
│   │       ├── smsService.ts
│   │       └── paymentGatewayService.ts
│   ├── repositories/        # Data access layer
│   │   ├── baseRepository.ts
│   │   ├── userRepository.ts
│   │   ├── restaurantRepository.ts
│   │   ├── menuRepository.ts
│   │   ├── orderRepository.ts
│   │   └── analyticsRepository.ts
│   ├── middleware/          # Express middleware
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   ├── errorHandler.ts
│   │   ├── rateLimiter.ts
│   │   ├── tenant.ts
│   │   ├── cors.ts
│   │   └── logger.ts
│   ├── routes/              # Route definicije
│   │   ├── index.ts
│   │   ├── auth.ts
│   │   ├── menu.ts
│   │   ├── orders.ts
│   │   ├── restaurants.ts
│   │   ├── admin.ts
│   │   └── analytics.ts
│   ├── models/              # Database modeli
│   │   ├── User.ts
│   │   ├── Restaurant.ts
│   │   ├── Menu.ts
│   │   ├── Category.ts
│   │   ├── MenuItem.ts
│   │   ├── Order.ts
│   │   ├── OrderItem.ts
│   │   ├── Table.ts
│   │   └── Analytics.ts
│   ├── database/            # Database konfiguracija
│   │   ├── connection.ts
│   │   ├── migrations/
│   │   ├── seeds/
│   │   └── prisma/
│   │       ├── schema.prisma
│   │       ├── migrations/
│   │       └── seed.ts
│   ├── types/               # TypeScript tipovi
│   │   ├── auth.ts
│   │   ├── menu.ts
│   │   ├── order.ts
│   │   ├── restaurant.ts
│   │   ├── user.ts
│   │   ├── socket.ts
│   │   └── api.ts
│   ├── utils/               # Utility funkcije
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   ├── validators.ts
│   │   ├── logger.ts
│   │   ├── encryption.ts
│   │   └── dateUtils.ts
│   ├── config/              # Konfiguracija
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   ├── jwt.ts
│   │   ├── email.ts
│   │   ├── payment.ts
│   │   └── app.ts
│   ├── jobs/                # Background jobs
│   │   ├── processors/
│   │   │   ├── emailJob.ts
│   │   │   ├── analyticsJob.ts
│   │   │   └── cleanupJob.ts
│   │   └── queue.ts
│   ├── websocket/           # WebSocket setup
│   │   ├── server.ts
│   │   ├── handlers/
│   │   │   ├── orderHandler.ts
│   │   │   ├── notificationHandler.ts
│   │   │   └── analyticsHandler.ts
│   │   └── middleware/
│   │       ├── socketAuth.ts
│   │       └── socketLogger.ts
│   ├── tests/               # Testovi
│   │   ├── unit/
│   │   ├── integration/
│   │   └── e2e/
│   ├── app.ts               # Express app setup
│   └── server.ts            # Server entry point
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── uploads/                 # File uploads
├── logs/                    # Log files
├── docker/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── nginx.conf
├── package.json
├── tsconfig.json
├── jest.config.js
├── .env.example
└── README.md
```

## Ključni Servisi

### Auth Service
- JWT token management
- Password hashing
- Role-based access control
- Multi-tenant autentifikacija

### Menu Service
- CRUD operacije za menije
- Kategorizacija artikala
- Slike i mediji
- Real-time dostupnost

### Order Service
- Kreiranje i procesiranje narudžbi
- Cart management
- Payment processing
- Order status tracking

### Socket Service
- Real-time order updates
- Bar staff notifications
- Customer order tracking
- Live analytics

### Restaurant Service
- Multi-tenant management
- QR code generisanje
- Table management
- Restaurant settings

## Database Schema (Prisma)

```prisma
// Multi-tenant setup
model Restaurant {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  tenantId  String   @unique
  settings  Json?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  users     User[]
  menus     Menu[]
  orders    Order[]
  tables    Table[]
}

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  password     String
  firstName    String
  lastName     String
  role         Role
  restaurantId String
  tenantId     String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  restaurant   Restaurant @relation(fields: [restaurantId], references: [id])
  orders       Order[]
}

enum Role {
  ADMIN
  OWNER
  STAFF
  CUSTOMER
}

model Menu {
  id           String   @id @default(cuid())
  name         String
  restaurantId String
  tenantId     String
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  restaurant   Restaurant @relation(fields: [restaurantId], references: [id])
  categories   Category[]
}

model Category {
  id        String   @id @default(cuid())
  name      String
  menuId    String
  tenantId  String
  sortOrder Int?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  menu      Menu @relation(fields: [menuId], references: [id])
  items     MenuItem[]
}

model MenuItem {
  id          String   @id @default(cuid())
  name        String
  description String?
  price       Decimal
  image       String?
  available   Boolean  @default(true)
  categoryId  String
  tenantId    String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  category    Category @relation(fields: [categoryId], references: [id])
  orderItems  OrderItem[]
}

model Order {
  id           String       @id @default(cuid())
  orderNumber  String       @unique
  status       OrderStatus
  totalAmount  Decimal
  customerInfo Json?
  restaurantId String
  userId       String?
  tableId      String?
  tenantId     String
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
  
  restaurant   Restaurant @relation(fields: [restaurantId], references: [id])
  user         User?      @relation(fields: [userId], references: [id])
  table        Table?     @relation(fields: [tableId], references: [id])
  items        OrderItem[]
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PREPARING
  READY
  COMPLETED
  CANCELLED
}

model OrderItem {
  id        String   @id @default(cuid())
  quantity  Int
  price     Decimal
  orderId   String
  itemId    String
  tenantId  String
  createdAt DateTime @default(now())
  
  order     Order    @relation(fields: [orderId], references: [id])
  item      MenuItem @relation(fields: [itemId], references: [id])
}

model Table {
  id           String   @id @default(cuid())
  number       String
  qrCode       String   @unique
  restaurantId String
  tenantId     String
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  restaurant   Restaurant @relation(fields: [restaurantId], references: [id])
  orders       Order[]
}
```
