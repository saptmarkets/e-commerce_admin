# SaptMarkets Admin Dashboard

This is the admin dashboard for the SaptMarkets e-commerce platform.

## 🚀 Quick Start

### Prerequisites

* Node.js 18+
* npm or yarn

### Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Access the application**
   * Admin Dashboard: http://localhost:4100

## 📦 Deployment

### Vercel Deployment

1. Connect to Vercel
2. Set environment variables:
   ```
   VITE_API_BASE_URL=https://your-backend-url.railway.app/api
   ```
3. Deploy

## 🛠️ Technology Stack

* **Framework**: React.js with Vite
* **Styling**: Tailwind CSS
* **State Management**: Redux
* **Routing**: React Router
* **Internationalization**: react-i18next
* **UI Components**: Custom components

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── routes/        # Route definitions
├── layout/        # Layout components
├── hooks/         # Custom React hooks
├── context/       # React context providers
├── reduxStore/    # Redux store configuration
├── services/      # API services
├── utils/         # Utility functions
└── assets/        # Static assets
```

## 🔧 Environment Variables

Create `.env` file:

```
VITE_API_BASE_URL=https://your-backend-url.railway.app/api
VITE_APP_NAME=SaptMarkets Admin
VITE_APP_VERSION=1.0.0
```

## 📄 License

This project is licensed under the MIT License. 