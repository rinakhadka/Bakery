# Sweet Crumbs Bakery 🥐🎂
> Full-Stack E-Commerce Website for Artisan Bakery Business (College Project)

Welcome to **Sweet Crumbs Bakery**! This application is designed as a warm, modern, and food-focused bakery e-commerce platform.

---

## 📁 Project Architecture (Phase 1)

```text
Bakery/
├── backend/                  # Node.js & Express.js REST API Server
│   ├── .env                  # Backend environment variables (PORT=5000)
│   ├── .env.example          # Template for backend environment variables
│   ├── .gitignore            # Git ignore rule for node_modules and .env
│   ├── package.json          # Backend dependencies (express, cors, dotenv)
│   └── server.js             # Express server entry point & API endpoints
│
├── frontend/                 # React.js (Vite) Single Page Application
│   ├── .env                  # Frontend environment variables (VITE_API_URL)
│   ├── .env.example          # Template for frontend environment variables
│   ├── package.json          # React, Tailwind CSS, Lucide Icons, Axios, React Router
│   ├── vite.config.js        # Vite build tool configuration with Tailwind v4
│   ├── index.html            # Main HTML document with Playfair Display & Plus Jakarta Sans
│   └── src/
│       ├── main.jsx          # React app DOM mounter
│       ├── App.jsx           # Root layout component (Navbar, Home, Footer)
│       ├── App.css           # App utility styles
│       ├── index.css         # Tailwind CSS imports & bakery color theme tokens
│       ├── components/       # Reusable UI components
│       │   ├── Navbar.jsx    # Bakery navigation bar with live API connection indicator
│       │   ├── Footer.jsx    # Bakery footer with opening hours, contacts, links
│       │   ├── ProductCard.jsx # Reusable product card with rating, price, actions
│       │   ├── CategoryCard.jsx # Category card with imagery & descriptions
│       │   └── ApiStatusCard.jsx # Live React ↔ Express handshake verification widget
│       ├── pages/
│       │   └── HomePage.jsx  # Homepage with Hero, Categories, Featured Products, Why Us
│       └── services/
│           └── api.js        # Centralized Axios instance reading VITE_API_URL
│
├── .gitignore                # Root git ignore (node_modules, .env, dist)
├── package.json              # Root helper scripts for running frontend and backend
└── README.md                 # Complete documentation and setup guide
```

---

## 🎨 Theme & Brand Identity

- **Cream Background**: `#FCF9F2` / `#FAF4EB`
- **Soft Pastel Pink**: `#F8D2D7` / `#DE7C88`
- **Warm Beige**: `#F1E6D8` / `#EADBCC`
- **Warm Caramel / Amber**: `#C68B59` / `#9F5F2B`
- **Dark Chocolate Brown**: `#2C1810` (Primary text & contrast)
- **Subtle Gold Accents**: `#D4AF37`
- **Typography**: `Playfair Display` (Headings) & `Plus Jakarta Sans` (Body)

---

## 🚀 How to Run the Project (Step-by-Step for Beginners)

To run the project, you need two terminals open: one for the **Backend** and one for the **Frontend**.

### Terminal 1: Start the Backend (Express API)
1. Open PowerShell or Terminal.
2. Navigate to the `backend` folder:
   ```powershell
   cd d:\Bakery\backend
   ```
3. Start the server in watch mode:
   ```powershell
   npm run dev
   ```
4. You will see:
   ```text
   🥐 Sweet Crumbs Bakery Backend Server Running!
   📡 URL: http://localhost:5000
   🧪 Test Endpoint: http://localhost:5000/api/test
   ```

### Terminal 2: Start the Frontend (React Vite)
1. Open a second PowerShell or Terminal window.
2. Navigate to the `frontend` folder:
   ```powershell
   cd d:\Bakery\frontend
   ```
3. Start the development server:
   ```powershell
   npm run dev
   ```
4. Open your browser and visit:
   ```text
   http://localhost:3000
   ```

---

## 🔍 How to Verify Frontend & Backend are Communicating

1. Open `http://localhost:3000` in your web browser.
2. In the top navigation bar, notice the badge: **`● API Live`** (green).
3. Scroll just past the Hero section to the **"Full-Stack Bridge: React ↔ Express"** widget.
4. You will see:
   - Status: `HTTP 200 OK`
   - Message: `"Sweet Crumbs Bakery API is running smoothly and connected to React!"`
   - Node version & Port: `5000`
   - A **"Test Connection"** button that lets you re-ping the server on demand.
5. In the **"Featured Bakery Products"** section, the cards (Belgian Chocolate Truffle Cake, Artisan French Butter Croissant, Velvet Strawberry Shortcake, Rustic Garlic Herb Sourdough) are fetched live from `http://localhost:5000/api/products/featured`.
6. If you stop the backend terminal, the badge automatically updates to orange/offline and gives a friendly explanation without crashing!


## 💳 Khalti Sandbox Payment Integration

The checkout uses Khalti's server-side ePayment flow. The browser never receives the Khalti secret key.

### 1. Get a Khalti test/merchant secret key

Create/access the appropriate Khalti merchant account and obtain a **test/sandbox secret key**. Do not paste the key into React files or commit it to GitHub.

### 2. Add the key to `backend/.env`

```env
KHALTI_SECRET_KEY=YOUR_KHALTI_TEST_SECRET_KEY
WEBSITE_URL=http://localhost:3000
CLIENT_URL=http://localhost:3000
```

The project already contains the first two lines as placeholders. Replace only the placeholder value with your real test key.

### 3. Start both servers

Backend:
```powershell
cd path\to\Bakery\backend
npm install
npm run dev
```

Frontend (a second terminal):
```powershell
cd path\to\Bakery\frontend
npm install
npm run dev
```

Open `http://localhost:3000`.

### 4. Payment flow

```text
Checkout
  -> POST /api/payment/khalti/initiate
  -> Khalti Sandbox
  -> /payment/khalti/callback?pidx=...
  -> POST /api/payment/khalti/lookup
  -> Only a Completed response becomes PAID
```

If the Khalti key is missing, the checkout shows a clear setup message instead of pretending that a payment succeeded.


## MongoDB Order Storage
The backend now includes Mongoose models for Order, OrderItem, and Payment. Add `MONGODB_URI` to `backend/.env`, run `npm install` in `backend`, then start the backend. Successful Khalti payments are verified server-side and saved to MongoDB.
