# E-commerce Analytics Dashboard

A comprehensive, modern e-commerce analytics dashboard built with React, TypeScript, and Tailwind CSS. This application provides real-time data visualization, multi-currency support, and advanced filtering capabilities for e-commerce businesses.

## 🚀 Live Demo

[View Live Application](https://sharpe-two-test.vercel.app/)

## 📋 Features

### Core Features
- **Real-time Dashboard**: Interactive analytics with live data updates
- **Multi-API Integration**: Seamless integration with JSONPlaceholder, Exchange Rate API, and REST Countries API
- **Responsive Design**: Mobile-first design with collapsible sidebar
- **Theme Support**: Light/dark/system preference themes
- 

### Technical Features
- **TypeScript**: Full type safety and enhanced developer experience
- **Modern Architecture**: Modular component structure with custom hooks
- **State Management**: Context API with localStorage persistence
- **Performance Optimized**: React Query caching, lazy loading, and virtual scrolling
- **Error Handling**: Comprehensive error boundaries and retry logic
- **Authentication**: Secure login system with role-based access
- 

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Headless UI
- **State Management**: React Context API, React Query
- **Routing**: React Router DOM
- **HTTP Client**: Axios with interceptors
- **Charts**: Recharts
- **Authentication**: JWT with crypto-js
- **Deployment**: Vercel/Netlify

## 🏗️ Architecture

```
src/
├── components/           # Reusable UI components
│   ├── KPI/          # Shared components
│   ├── dashboard/       # Dashboard-specific components
│   ├── charts/          # Chart components
│   └── layout/          # Layout components
├── contexts/            # React Context providers
│   ├── ThemeContext.tsx
│   ├── AuthContext.tsx
│   └── FilterContext.tsx
├── hooks/               # Custom React hooks
│   ├── useApi.ts
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   └── useTheme.ts
├── services/            # API service layer
│   ├── api.ts           # Base API service
│   ├── jsonPlaceholder.ts
│   ├── exchangeRate.ts
│   └── restCountries.ts
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── pages/               # Page components
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Marvinkwame/Sharpe-two-test
   cd sharpetwo-test
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Build for production**
   ```bash
   npm run build
   # or
   yarn build
   ```

## 📡 API Integration

### API Service Architecture

The application uses a modular API service layer with automatic retry logic and error handling:

```typescript
const createApiService = (baseURL: string, timeout = 10000) => {
  // Creates configured axios instance with interceptors
  // Includes automatic retry for 5xx errors
  // Adds timestamp to GET requests for cache busting
  // Comprehensive error handling with custom ApiError type
}
```

### Integrated APIs

#### 1. JSONPlaceholder API
- **Purpose**: Simulates customer and order data
- **Endpoints**: Users, Posts, Comments
- **Usage**: Customer analytics, order simulation

#### 2. Exchange Rate API
- **Purpose**: Real-time currency conversion
- **Endpoints**: Latest rates, currency conversion
- **Usage**: International sales analytics

#### 3. REST Countries API
- **Purpose**: Geographic data and country information
- **Endpoints**: All countries, country by name/code/region
- **Usage**: Customer geographic distribution

## 🎨 Design System

### Theme System
- **Light Theme**: Clean, professional appearance
- **Dark Theme**: Reduced eye strain, modern look
- **System Theme**: Automatically matches user's OS preference

### Components
- **KPI Cards**: Animated metric displays with trend indicators
- **Charts**: Interactive visualizations using Recharts
- **Data Tables**: Sortable, paginated tables with inline editing
- **Filters**: Advanced multi-parameter filtering system

## 🔐 Authentication

### Features
- User registration with email validation
- Password strength checking
- Secure login with "Remember Me" functionality
- Password encryption using crypto-js
- Protected routes and role-based access
- Session management with auto-logout

### Usage
```typescript
// Login
const { login } = useAuth();
await login(email, password, rememberMe);

// Protected Routes
<ProtectedRoute requiredRole="admin">
  <AdminPanel />
</ProtectedRoute>
```

## 📊 Data Management

### State Management
- **Global State**: React Context API for theme, auth, and filters
- **Server State**: React Query for API data caching and synchronization
- **Local Storage**: Persistent user preferences and settings

### Custom Hooks
- `useApi`: Manages API requests with loading and error states
- `useDebounce`: Debounces search inputs for performance
- `useLocalStorage`: Persists data to localStorage
- `useTheme`: Manages theme state and transitions

## 🚀 Performance Optimization

### Implemented Optimizations
- **React Query**: Intelligent caching and background updates
- **Code Splitting**: Lazy loading of route components
- **Memoization**: Strategic use of `useMemo` and `useCallback`
- **Virtual Scrolling**: Efficient rendering of large datasets
- **Image Optimization**: Lazy loading and responsive images


## 📱 Responsive Design

### Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Features
- Collapsible sidebar navigation
- Touch-friendly controls


## 🧪 Testing

### Testing Strategy
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API service and hook testing
- **E2E Tests**: Critical user journey testing

### Running Tests
```bash
npm run test
# or
yarn test
```


This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer**: Your Name
- **Designer**: Your Name
- **Project Manager**: Your Name

## 📞 Support

For support, email support@yourcompany.com or create an issue in the GitHub repository.

## 🙏 Acknowledgments

- [JSONPlaceholder](https://jsonplaceholder.typicode.com/) for mock API data
- [Exchange Rate API](https://exchangerate-api.com/) for currency conversion
- [REST Countries](https://restcountries.com/) for country data
- React community for excellent documentation and resources

---
