# Foody — Gourmet Food Delivery & Kitchen Management Platform

<p align="center">
  <img src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80" alt="Foody Banner" width="100%" style="border-radius: 16px; max-height: 380px; object-fit: cover;" />
</p>

<p align="center">
  <strong>A modern, full-stack food delivery experience with real-time GPS telemetry, interactive kitchen dispatch, AI culinary sommelier, and itemized PDF tax invoicing.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2D9?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Google_GenAI-Gemini_2.5-4285F4?logo=google&logoColor=white" alt="Google GenAI" />
</p>

---

## 🌟 Key Features

### 🥗 1. Gourmet Storefront & Visual Experience
- **Hero & Curated Showcase**: Features seasonal highlights, 20% promotional discounts, and instant category quick-filters.
- **Interactive 4-Color Salad Carousel**: Coral, Orange, Green, and Purple card themes with instant add-to-cart, dietary badges, and customizable add-ons.
- **Dynamic Menu Catalog**: Instant search, dietary filters (Vegan, Gluten-Free, Spicy, Best Seller), price ranges, and multi-field sorting (Price, Rating, Calories).
- **Dish Customization Modal**: Real-time pricing calculation for gourmet add-ons (extra avocado, chia seeds, truffle oil, cheese crust, extra patties).

### 🛵 2. Live GPS Courier Telemetry Simulation
- **Animated Vector Map**: Live position tracking of courier with route progress visualization from restaurant to delivery destination.
- **Real-Time Delivery Pipeline**: Step-by-step progress (`Placed` ➔ `Preparing in Kitchen` ➔ `On the Way` ➔ `Delivered`).
- **Courier Interaction**: Dedicated driver profile (Marco Rossi on Red Vespa), live ETA countdown, one-click simulated calling, and real-time chat.

### 🧑‍🍳 3. Kitchen Operations & Admin Command Center
- **Full Menu CRUD**:
  - **Add New Dishes**: Modal with name, tagline, category, base price, sale discount, cook time, calories, dietary flags, and curated 1-click image presets.
  - **Custom Add-ons Builder**: Configure customizable options and price modifiers (extra avocado, truffle oil, cheese) per dish.
  - **Edit & Clone Dishes**: Update any dish parameter or clone existing items in one click.
  - **Delete Safeguard**: Custom interactive modal confirmation with item preview and undo toast feedback.
  - **Bulk Operations**: Multi-select dishes to perform bulk deletions or toggle in-stock / sold-out states simultaneously.
  - **Dual Layouts**: Instant switching between dense Table View and visual Bento Cards View.
  - **Reset Catalog**: One-click restore to original curated seed catalog.
- **Live Order & Kitchen Dispatch**:
  - Step-by-step cooking progression (`Placed` ➔ `Preparing` ➔ `On the Way` ➔ `Delivered`).
  - Courier assignment selector (Marco Rossi - Vespa, Sofia Bianchi - E-Bike, Luca Ferri - Van, Matteo Bruno - Scooter).
  - Itemized customer orders with addons and instructions, plus quick launch for Live GPS maps and printable tax invoices.
- **Promo Voucher Management**: Create, pause, and delete promotional discount coupons (percentage off, flat dollar discount, free shipping, minimum order rules).
- **Store Analytics & CRM**: Real-time sales calculations, gross revenue, average order value (AOV), menu category breakdown bars, top-selling dishes leaderboard, and customer directory with saved addresses.
- **Operational Settings**: Configurable restaurant branch details, kitchen status toggle (open / paused), emergency broadcast announcements, delivery fees, and sales tax.

### 👤 4. Customer Profile & Address Book
- **Dietary Preferences Management**: One-click toggling for Vegan, Vegetarian, Gluten-Free, Keto, and Halal filters.
- **Saved Address Book**: Multi-address management with default address selection for one-click checkouts.
- **Order History**: Itemized past order logs with status badges and one-click access to printable tax invoices.

### 🤖 5. AI Culinary Sommelier (Gemini 2.5)
- **Interactive Kitchen AI**: Powered by Google GenAI `@google/genai` on a secure server-side Express proxy (`/api/ai-chef`).
- **Personalized Recommendations**: Suggests wine pairings, side dishes, dietary substitutions, and queries active order status.

### 🧾 6. Checkout, Coupons & PDF Invoices
- **Discount Engine**: Validates promo codes (`FOODY20` for 20% off, `FREESHIP` for free delivery, `SAVE10` for $10 off).
- **Payment Options**: Credit/Debit card, PayPal, Apple Pay, Google Pay, and Cash on Delivery.
- **Printable Tax Invoices**: Generates clean, professional PDF-ready invoices with transaction IDs, itemized breakdowns, taxes, and courier notes.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, `motion` (Framer Motion), Lucide React
- **Backend**: Node.js, Express, `tsx` runtime, `esbuild` for production bundling
- **AI Integration**: Google GenAI SDK (`@google/genai`) accessing Gemini 2.5 Flash
- **Styling**: Tailwind CSS utility design system with custom warm neutral terracotta theme

---

## 📂 Project Structure

```
├── .env.example              # Environment variables template
├── index.html                # Application HTML entry point
├── metadata.json             # AI Studio applet metadata & permissions
├── package.json              # Dependencies and scripts
├── server.ts                 # Express server with Vite middleware & Gemini proxy
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite build configuration
└── src/
    ├── main.tsx              # React DOM entry point
    ├── App.tsx               # Main application component & view router
    ├── index.css             # Tailwind CSS entry
    ├── types.ts              # TypeScript interfaces, types, and enums
    ├── context/
    │   └── AppContext.tsx    # State management (cart, orders, auth, filters)
    ├── data/
    │   └── mockData.ts       # Gourmet food items, categories, chefs, users
    └── components/
        ├── AIAssistantModal.tsx    # Gemini AI Culinary Concierge
        ├── AdminDashboard.tsx      # Kitchen dispatch & inventory CRUD
        ├── AppDownloadBanner.tsx   # Mobile app promo banner
        ├── AuthModal.tsx           # Customer & Admin login/register
        ├── CartDrawer.tsx          # Slide-over cart with upsell add-ons
        ├── CategoriesSection.tsx   # Visual category & promo mosaic
        ├── CheckoutModal.tsx       # Multi-step checkout & payment
        ├── FoodDetailModal.tsx     # Nutritional info & add-on selector
        ├── Footer.tsx              # Responsive footer & newsletter
        ├── Hero.tsx                # Hero banner with order options
        ├── LiveTrackingModal.tsx   # Live vector map courier tracking
        ├── MenuCatalog.tsx         # Filterable food search catalog
        ├── Navbar.tsx              # Sticky navigation header
        ├── OffersView.tsx          # Discount vouchers & promotional deals
        ├── OrderInvoiceModal.tsx   # Printable PDF tax invoice
        ├── PizzaDeliveryBanner.tsx # Fast delivery guarantee banner
        ├── RestaurantsView.tsx     # Partner kitchens & culinary locations
        ├── SaladCarousel.tsx       # 4-card signature salad showcase
        ├── ServicesView.tsx        # Catering, corporate & event services
        ├── TeamSection.tsx         # Culinary director profiles
        ├── TopFoods.tsx            # Category grid (Pizza, Burgers, etc.)
        └── UserDashboard.tsx       # Customer profile & order history
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- npm or bun

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/your-username/foody.git
cd foody
npm install
```

### 3. Environment Variables
Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

Add your Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 👥 Demo Accounts

You can switch between customer and admin roles via the header or use these pre-configured credentials:

| Role | Email | Name | Capabilities |
|------|-------|------|--------------|
| **Customer** | `sarah@foody.com` | Sarah Mitchell | Place orders, track live deliveries, edit dietary profile |
| **Admin** | `chef@foody.com` | Chef Alessandro | Manage live kitchen queue, add/edit menu items, view revenue |

---

## 🏷️ Demo Promo Codes

- **`FOODY20`** — 20% off entire order
- **`FREESHIP`** — 100% discount on delivery fee
- **`SAVE10`** — $10 flat discount on orders over $30

---

## 📄 License

This project is licensed under the MIT License — feel free to use and modify for personal or commercial projects.
