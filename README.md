# Reportify Web

Modern Vue 3 frontend application for Reportify, featuring TypeScript, Composition API, Tailwind CSS, and Chart.js for data visualization.

## Tech Stack

- **Vue 3** - Progressive JavaScript framework with Composition API
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Vue Router** - Official router for Vue.js
- **Pinia** - Official state management for Vue
- **Axios** - HTTP client for API requests
- **Chart.js** - Data visualization library
- **vue-chartjs** - Vue wrapper for Chart.js

## Features

### Authentication Module

- JWT-based authentication
- Secure token storage in localStorage
- Login/logout functionality
- Auth guards for protected routes
- Automatic token refresh handling

### Management Module

- **Users Management**
  - View all users
  - Create new users (admin only)
  - Edit user details
  - Delete users (admin only)
  - Role-based access control
- **Items Management**
  - View items in grid layout
  - Create new items
  - Edit item details
  - Delete items (owner or admin)
  - Filter by category and status

### Reports Module

- **Dashboard**
  - Summary statistics cards
  - Recent users and items
  - Quick overview metrics
- **Analytics**
  - User activity trends (line chart)
  - Item sales trends (line chart)
  - Category distribution (doughnut chart)
  - Page views analysis (bar chart)
  - Top users by items
  - 30-day trend comparison

### UI/UX Features

- Responsive design for mobile, tablet, and desktop
- Clean and modern interface
- Loading states and error handling
- Form validation
- Modal dialogs for CRUD operations
- Tailwind CSS utility classes for consistent styling

## Architecture

### Project Structure

```
reportify-web/
├── src/
│   ├── assets/
│   │   └── styles/
│   │       └── main.css           # Tailwind CSS + custom styles
│   ├── components/
│   │   ├── charts/                # Chart components
│   │   │   ├── LineChart.vue
│   │   │   ├── BarChart.vue
│   │   │   └── DoughnutChart.vue
│   │   └── modals/                # Modal dialogs
│   │       ├── UserModal.vue
│   │       └── ItemModal.vue
│   ├── composables/               # Reusable composition functions
│   │   ├── useLoading.ts
│   │   └── useNotification.ts
│   ├── layouts/
│   │   └── MainLayout.vue         # Main app layout with navigation
│   ├── modules/                   # Feature modules (implied structure)
│   ├── router/
│   │   └── index.ts               # Route definitions and guards
│   ├── services/                  # API service layer
│   │   ├── api.ts                 # Axios instance and interceptors
│   │   ├── auth.service.ts        # Authentication API calls
│   │   ├── user.service.ts        # User CRUD operations
│   │   ├── item.service.ts        # Item CRUD operations
│   │   └── report.service.ts      # Reports and analytics
│   ├── stores/                    # Pinia state management
│   │   └── auth.store.ts          # Auth state and actions
│   ├── types/
│   │   └── index.ts               # TypeScript type definitions
│   ├── views/                     # Page components
│   │   ├── auth/
│   │   │   └── LoginView.vue
│   │   ├── dashboard/
│   │   │   └── DashboardView.vue
│   │   ├── management/
│   │   │   ├── UsersView.vue
│   │   │   └── ItemsView.vue
│   │   └── reports/
│   │       └── ReportsView.vue
│   ├── App.vue                    # Root component
│   ├── main.ts                    # Application entry point
│   └── env.d.ts                   # Environment type definitions
├── index.html                     # HTML template
├── vite.config.ts                 # Vite configuration
├── tsconfig.json                  # TypeScript configuration
├── tailwind.config.js             # Tailwind CSS configuration
├── postcss.config.js              # PostCSS configuration
└── package.json                   # Dependencies and scripts
```

### Design Patterns

#### Composition API

All components use Vue 3 Composition API with `<script setup>` syntax for better type inference and cleaner code.

#### Service Layer

API calls are abstracted into service modules, separating business logic from UI components.

#### State Management

Pinia stores manage global application state with TypeScript support and devtools integration.

#### Composables

Reusable logic is extracted into composables following the `use*` naming convention.

## Prerequisites

- Node.js 18+ (`node --version`)
- npm 9+ or yarn (`npm --version`)

## Setup Instructions

### 1. Install Dependencies

```bash
cd reportify-web
npm install
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Development Workflow

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Type-check TypeScript files
npm run type-check

# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to production server
npm run deploy
```

### Development Server

The Vite dev server includes:

- Hot Module Replacement (HMR)
- Fast refresh for Vue components
- Instant server start
- Optimized dependency pre-bundling

### Type Checking

TypeScript type checking runs separately from the dev server:

```bash
npm run type-check
```

## Building for Production

### Create Production Build

```bash
npm run build
```

This will:

1. Type-check the codebase
2. Bundle and optimize assets
3. Output to the `dist/` directory

### Preview Production Build

```bash
npm run preview
```

Serves the production build locally for testing.

## Deployment

### Automated Deployment to Server

The project includes an automated deployment script for deploying to a dedicated server via SSH.

**Configuration:**

- Server: `rs-development.net`
- SSH Port: `2121`
- User: `rs-dev`
- Remote Path: `/var/www/reportify-web`

**Deploy Command:**

```bash
# Interactive (will prompt for sudo password)
yarn deploy

# Or pass password as argument
./deploy.sh "your_sudo_password"

# Or with npm
npm run deploy
```

**What the deployment script does:**

1. Builds the project (`yarn build`)
2. Creates a tarball of the `dist/` folder
3. Uploads the archive to the server via SSH
4. Extracts files to `/var/www/reportify-web`
5. Sets proper permissions for nginx (`www-data:www-data`)
6. Reloads nginx to serve the new version
7. Creates automatic backups of previous deployments

**Prerequisites:**

- SSH access configured for `rs-dev@reportify.rs-development.net:2121`
- SSH key-based authentication set up (recommended)
- Sudo password for the `rs-dev` user (script will prompt or accept as argument)
- Nginx configured with proxy pass for `/api` to backend

**Setting up SSH key authentication (recommended):**

```bash
# Generate SSH key (if you don't have one)
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy key to server
ssh-copy-id -p 2121 rs-dev@rs-development.net

# Test connection
ssh -p 2121 rs-dev@rs-development.net
```

**Manual Deployment:**

If you prefer manual deployment:

```bash
# Build the project
yarn build

# Upload to server
scp -P 2121 -r dist/* rs-dev@rs-development.net:/var/www/reportify-web/

# SSH into server and reload nginx
ssh -p 2121 rs-dev@rs-development.net "sudo systemctl reload nginx"
```

**Nginx Configuration:**

Ensure your nginx configuration includes a proxy pass for the API:

```nginx
location /api {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

## Usage Guide

### Login

1. Navigate to `http://localhost:5173/login`
2. Use demo credentials:
   - **Admin**: admin@reportify.com / password123
   - **User**: Any user from seed data / password123

### Navigation

- **Dashboard**: Overview with summary cards and recent activity
- **Reports**: Detailed analytics with charts and trends
- **Users**: Manage user accounts (CRUD operations)
- **Items**: Manage items with filtering options

### Managing Users

**View Users:**

- Navigate to Users page
- See all users in table format with role and status

**Create User (Admin only):**

- Click "+ Add User" button
- Fill in required fields (name, email, password)
- Select role and active status
- Click "Create"

**Edit User:**

- Click "Edit" button on user row
- Update fields as needed
- Click "Update"

**Delete User (Admin only):**

- Click "Delete" button
- Confirm deletion

### Managing Items

**View Items:**

- Navigate to Items page
- See items in card grid layout
- Use filters to narrow results by category or status

**Create Item:**

- Click "+ Add Item" button
- Fill in item details
- Select category
- Set price and quantity
- Click "Create"

**Edit Item:**

- Click "Edit" button on item card
- Update fields as needed
- Click "Update"

**Delete Item:**

- Click "Delete" button (only owner or admin)
- Confirm deletion

### Viewing Reports

**Dashboard View:**

- Summary statistics (users, items, value)
- Recent users and items lists
- Quick metrics at a glance

**Analytics View:**

- User activity trend chart (30 days)
- Item sales trend chart (30 days)
- Category distribution pie chart
- Page views bar chart
- Top users by item count table
- Trend comparison with previous period

## API Integration

### Authentication Flow

1. User submits login credentials
2. Frontend calls `/api/v1/auth/login`
3. Backend returns JWT token and user data
4. Token stored in localStorage
5. Token included in all subsequent requests via Axios interceptor
6. On 401 error, user redirected to login

### HTTP Client Configuration

The Axios instance is configured with:

- Base URL from environment variables
- Request interceptor to add auth token
- Response interceptor to handle 401 errors
- Automatic redirect on authentication failure

### Error Handling

API errors are handled at multiple levels:

- Service layer: Throws errors with response data
- Component layer: Catches errors and displays messages
- Global interceptor: Handles authentication errors

## Styling

### Tailwind CSS

The application uses Tailwind CSS for styling with custom configuration:

**Custom Colors:**

- Primary blue color palette (50-900)
- Extended with custom shades

**Custom Components:**

- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger`
- `.input` for form inputs
- `.card` for content containers
- `.table` for data tables

**Responsive Design:**

- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Grid layouts adapt to screen size

### Custom Styles

Additional styles in `main.css`:

- Loading spinner animation
- Base body styles
- Custom component utilities

## State Management

### Auth Store

Manages authentication state:

- User data
- JWT token
- Login/logout actions
- Authentication status checks
- Admin role verification

**Usage:**

```typescript
import { useAuthStore } from "@/stores/auth.store";

const authStore = useAuthStore();
await authStore.login({ email, password });
console.log(authStore.user);
console.log(authStore.isAuthenticated);
```

## TypeScript

### Type Safety

All components, services, and stores are fully typed with TypeScript:

- Interface definitions in `types/index.ts`
- Strict mode enabled
- Type inference with Composition API
- Generic types for API responses

### Common Types

```typescript
(User,
  Item,
  ApiResponse<T>,
  LoginCredentials,
  DashboardData,
  ReportMetrics,
  TrendsData);
```

## Charts

### Chart.js Integration

Charts are built with Chart.js and wrapped in Vue components:

- **LineChart**: Time-series data
- **BarChart**: Comparative data
- **DoughnutChart**: Categorical distribution

**Features:**

- Responsive sizing
- Interactive tooltips
- Legend with toggle
- Custom colors
- Smooth animations

## Responsive Design

### Breakpoints

- **Mobile**: < 640px (base)
- **Tablet**: 640px - 1024px (sm, md)
- **Desktop**: > 1024px (lg, xl)

### Layout Adaptations

- Navigation collapses on mobile
- Grid columns adjust per screen size
- Tables become scrollable on small screens
- Cards stack vertically on mobile

## Performance

### Optimizations

- Code splitting with Vue Router lazy loading
- Vite's optimized dependency pre-bundling
- Tree-shaking unused code
- Asset optimization in production build
- Minimal bundle size with Tailwind JIT

### Best Practices

- Async components for routes
- Reactive state with minimal re-renders
- Efficient Chart.js rendering
- Debounced API calls where appropriate

## Troubleshooting

### Common Issues

**CORS errors:**

- Ensure Rails API is running on port 3000
- Check CORS configuration in Rails backend

**API connection failed:**

- Verify `VITE_API_BASE_URL` in `.env`
- Ensure backend is running and accessible

**Authentication errors:**

- Check token in localStorage
- Verify JWT_SECRET_KEY matches backend
- Clear localStorage and re-login

**Charts not rendering:**

- Check console for Chart.js errors
- Ensure data format matches expected structure
- Verify canvas element is mounted

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Use TypeScript for all new code
2. Follow Vue 3 Composition API patterns
3. Use Tailwind utility classes
4. Keep components small and focused
5. Extract reusable logic into composables
6. Type all API responses
7. Handle loading and error states

## License

MIT
