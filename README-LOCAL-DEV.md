# SAPT Markets Admin - Local Development Setup

## 🚀 Quick Start for Local Development

This guide will help you run the SAPT Markets Admin app locally while using the cloud backend.

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Environment Configuration

The app is configured to use the cloud backend at: `https://e-commerce-backend-l0s0.onrender.com`

#### Environment Variables

The app uses the following environment variables (already configured in `env.development`):

```bash
# API Configuration - Using Cloud Backend
VITE_APP_API_BASE_URL=https://e-commerce-backend-l0s0.onrender.com/api
VITE_APP_API_SOCKET_URL=https://e-commerce-backend-l0s0.onrender.com

# App Configuration
VITE_APP_NAME=SAPT Markets Admin (Local Dev)
VITE_APP_VERSION=1.0.0

# Development Configuration
NODE_ENV=development
```

### Installation & Setup

1. **Navigate to Admin directory:**
   ```bash
   cd Admin
   ```

2. **Install dependencies (if not already installed):**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Open your browser and go to: `http://localhost:4100`
   - The app will automatically connect to the cloud backend

### Development Features

- ✅ **Hot reload** - Changes reflect immediately
- ✅ **Cloud backend integration** - Uses `https://e-commerce-backend-l0s0.onrender.com`
- ✅ **Environment variables** - Configured for local development
- ✅ **Port 4100** - Runs on localhost:4100

### Troubleshooting

#### If you see "Failed to load push sessions" error:

1. **Check if the backend is running:**
   - Visit: `https://e-commerce-backend-l0s0.onrender.com`
   - Should show: "API is running!"

2. **Test backend endpoints:**
   - Test route: `https://e-commerce-backend-l0s0.onrender.com/simple-test`
   - Stock push sessions: `https://e-commerce-backend-l0s0.onrender.com/api/test/stock-push-sessions-no-auth`

3. **Check browser console:**
   - Open Developer Tools (F12)
   - Look for any API errors in the Console tab

#### If dependencies are missing:

```bash
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### If port 4100 is already in use:

```bash
# Kill the process using port 4100
npx kill-port 4100
# Then start the dev server again
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend Integration

The admin app is configured to work with the cloud backend at:
- **API Base URL:** `https://e-commerce-backend-l0s0.onrender.com/api`
- **Socket URL:** `https://e-commerce-backend-l0s0.onrender.com`

All API calls will be routed to the cloud backend automatically.

### Notes

- The app uses Vite for fast development
- Environment variables are loaded from `env.development`
- CORS is configured to allow local development
- All API calls are logged in the browser console for debugging

### Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify the backend is running at the cloud URL
3. Ensure all environment variables are properly set
4. Check if the port 4100 is available 