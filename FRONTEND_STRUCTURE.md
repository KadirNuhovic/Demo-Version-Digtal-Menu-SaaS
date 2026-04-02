# Frontend Folder Struktura

```
frontend/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/           # Reusable UI komponente
│   │   ├── ui/              # Base UI komponente
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── index.ts
│   │   ├── layout/          # Layout komponente
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   └── common/          # Common komponente
│   │       ├── ErrorBoundary.tsx
│   │       ├── ProtectedRoute.tsx
│   │       └── SEOHead.tsx
│   ├── pages/               # Aplikacije (rute)
│   │   ├── customer/        # Digitalni meni za goste
│   │   │   ├── MenuPage.tsx
│   │   │   ├── CartPage.tsx
│   │   │   ├── OrderStatusPage.tsx
│   │   │   └── QRScannerPage.tsx
│   │   ├── bar/             # Bar dashboard
│   │   │   ├── OrdersDashboard.tsx
│   │   │   ├── OrderDetails.tsx
│   │   │   ├── KitchenDisplay.tsx
│   │   │   └── NotificationsPanel.tsx
│   │   ├── admin/           # Admin panel
│   │   │   ├── Dashboard.tsx
│   │   │   ├── RestaurantsPage.tsx
│   │   │   ├── UsersPage.tsx
│   │   │   ├── AnalyticsPage.tsx
│   │   │   └── SettingsPage.tsx
│   │   ├── owner/           # Owner dashboard
│   │   │   ├── RestaurantDashboard.tsx
│   │   │   ├── MenuManagement.tsx
│   │   │   ├── StaffManagement.tsx
│   │   │   ├── ReportsPage.tsx
│   │   │   └── SettingsPage.tsx
│   │   └── auth/            # Autentifikacija
│   │       ├── LoginPage.tsx
│   │       ├── RegisterPage.tsx
│   │       └── ForgotPasswordPage.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useSocket.ts
│   │   ├── useOrders.ts
│   │   ├── useMenu.ts
│   │   └── useNotifications.ts
│   ├── services/            # API servisi
│   │   ├── api.ts           # Axios konfiguracija
│   │   ├── authService.ts
│   │   ├── menuService.ts
│   │   ├── orderService.ts
│   │   ├── userService.ts
│   │   └── socketService.ts
│   ├── store/               # State management (Zustand)
│   │   ├── authStore.ts
│   │   ├── menuStore.ts
│   │   ├── orderStore.ts
│   │   ├── uiStore.ts
│   │   └── index.ts
│   ├── types/               # TypeScript tipovi
│   │   ├── auth.ts
│   │   ├── menu.ts
│   │   ├── order.ts
│   │   ├── user.ts
│   │   ├── restaurant.ts
│   │   └── api.ts
│   ├── utils/               # Utility funkcije
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   └── storage.ts
│   ├── styles/              # Stilovi
│   │   ├── globals.css
│   │   ├── components.css
│   │   └── animations.css
│   ├── assets/              # Static assets
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   ├── App.tsx              # Glavna aplikacija
│   ├── main.tsx             # Entry point
│   └── vite-env.d.ts        # Vite tipovi
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── .env.example
```

## Ključne Komponente po Aplikaciji

### Customer App
- **MenuPage**: Prikaz menija sa kategorijama
- **CartPage**: Košarica i checkout
- **OrderStatusPage**: Praćenje statusa narudžbe
- **QRScannerPage**: Skeniranje QR koda

### Bar Dashboard
- **OrdersDashboard**: Real-time lista narudžbi
- **OrderDetails**: Detalji pojedinačne narudžbe
- **KitchenDisplay**: Kuhinjski display
- **NotificationsPanel**: Panel notifikacija

### Admin Panel
- **Dashboard**: Admin overview
- **RestaurantsPage**: Upravljanje restoranima
- **UsersPage**: Upravljanje korisnicima
- **AnalyticsPage**: Globalna analitika

### Owner Dashboard
- **RestaurantDashboard**: Dashboard za restoran
- **MenuManagement**: Upravljanje menijem
- **StaffManagement**: Upravljanje zaposlenima
- **ReportsPage**: Izvještaji i analitika
