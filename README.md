# RongRani Client Frontend

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.1.4-purple.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.6-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-ISC-green.svg)](LICENSE)

RongRani Client is a state-of-the-art customer-facing e-commerce storefront for RongRani—Bangladesh's premium online shop for handmade gifts, custom jewelry, surprise boxes, and personalized gift curations.

Designed with premium glassmorphism aesthetics, responsive layouts, micro-animations, and bilingual support (English/Bengali), it offers a seamless and luxurious shopping experience.

---

## 🌟 Key Features

- **Premium Glassmorphism Design**: Elegant visuals featuring modern typography, harmonious colors, smooth gradients, and immersive micro-animations.
- **Bilingual Interface**: Seamlessly toggle between Bengali and English (supported by `i18next` translation keys).
- **Interactive Gift Customization**: Fully-featured catalog with product filtering, attributes, search suggestions, and detail views.
- **Responsive Layout**: Pixel-perfect layout optimization across mobile, tablet, and desktop screens.
- **Progressive Web App (PWA)**: Support for offline functionality, home screen installation, and background asset caching.
- **Live Order Tracking**: Connects to the backend API and Courier API (Steadfast) to offer real-time delivery status tracking for customers.
- **Guest Checkout**: Support for guest order placements without mandatory registration.

---

## 🛠️ Technology Stack

- **Core**: React 18, React DOM, Vite
- **Routing**: React Router DOM v6
- **Styling**: TailwindCSS, Autoprefixer, PostCSS, Glassmorphism utilities, Lucide React icons
- **State Management & Caching**: TanStack React Query (v5), Context API
- **Internationalization**: i18next, react-i18next
- **HTTP Client**: Axios (configured with base proxy)
- **State Helpers**: Yup validation, React Hook Form, React Hot Toast notifications
- **PWA Features**: Vite PWA Plugin

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js** (version `>= 18.0.0`) and **npm** installed.

### Installation

1. Navigate to the client folder:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables. Create a `.env.local` file inside the `client/` directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   VITE_SOCKET_URL=http://localhost:5000
   VITE_ADMIN_URL=http://localhost:5174
   ```

### Running Locally

To run the development server:
```bash
npm run dev
```
The client storefront will be active on **`http://localhost:5173`**.

### Production Build

To build the optimized static assets:
```bash
npm run build
```
This generates build files inside the `dist/` directory, ready to deploy to Vercel, Netlify, or AWS.

---

## 📂 Project Structure

```
client/
├── public/                 # Static assets (logos, icons, manifest files)
├── src/
│   ├── assets/             # SVGs and styles
│   ├── components/         # Reusable UI elements (Navbar, Footer, CartDrawer)
│   ├── contexts/           # Context Providers (Auth, Cart, Theme, Wishlist)
│   ├── hooks/              # Custom React hooks (useDeliveryCalculation)
│   ├── i18n/               # Localization JSON files (bn, en translations)
│   ├── pages/              # Client pages (Home, Shop, Checkout, ProductDetail)
│   ├── utils/              # Utility helper functions
│   ├── App.jsx             # Main Application Routing
│   ├── index.css           # Global Styles & Tailwind Configuration
│   └── main.jsx            # Application Entry Point
├── package.json            # Configuration and script file
├── tailwind.config.js      # TailwindCSS styling settings
└── vite.config.js          # Vite bundler parameters
```

---

## 📄 License

This project is licensed under the **ISC License**. See the [LICENSE](LICENSE) file for details.
