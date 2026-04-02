# Digital Menu SaaS - Arhitektura Sistema

## Sistemska Arhitektura

### Frontend (React + TypeScript + Tailwind)
- **Customer App**: Digitalni meni za goste (tablet/phone)
- **Bar Dashboard**: Real-time prikaz narudžbi za šank
- **Admin Panel**: Upravljanje restoranima, menijima, korisnicima
- **Owner Dashboard**: Analitika i izvještaji za vlasnike

### Backend (Node.js + Express + Socket.io)
- **API Gateway**: Centralni ulaz za sve requeste
- **Auth Service**: JWT autentifikacija i autorizacija
- **Menu Service**: CRUD operacije za menije
- **Order Service**: Procesiranje narudžbi
- **WebSocket Server**: Real-time komunikacija
- **Notification Service**: Email/Push notifikacije

### Database (PostgreSQL + Prisma)
- **Multi-tenancy**: Svaki restoran ima svoj tenant ID
- **Sharding**: Horizontalno skaliranje po regijama

## Glavne Komponente

### 1. Autentifikacija & Autorizacija
- Multi-tenant sistem
- Role-based access (Admin, Owner, Staff, Customer)
- JWT tokens sa refresh tokenima

### 2. Digitalni Meni
- Kategorizirani artikli
- Slike i opisi proizvoda
- Real-time dostupnost
- QR code generisanje

### 3. Sistema Naručivanja
- Košarica sa narudžbama
- Real-time prikaz u šanku
- Status narudžbe (pending, confirmed, ready, completed)
- Historija narudžbi

### 4. Real-time Komunikacija
- Socket.io za instant update-e
- Live order tracking
- Bar staff notifications

### 5. Admin Panel
- Restoran management
- Menu management
- User management
- Analytics dashboard

### 6. Payment Integration
- Stripe payment gateway
- Multiple payment methods
- Invoice generation

## Tehnički Stack

### Frontend
```
React 18 + TypeScript
Vite (build tool)
TailwindCSS + HeadlessUI
React Query (server state)
Zustand (client state)
React Router v6
Socket.io-client
```

### Backend
```
Node.js 18+ + Express
TypeScript
Prisma ORM
PostgreSQL
Socket.io
Redis (caching + sessions)
JWT (auth)
Bull Queue (background jobs)
```

### DevOps
```
Docker + Docker Compose
GitHub Actions (CI/CD)
AWS/Azure (hosting)
CloudFront (CDN)
S3 (file storage)
```
