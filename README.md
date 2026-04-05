# 🛍️ Shopper — Full-Stack E-Commerce App

## Live Demo
- 🛍️ Frontend: https://ecommerce-frontend.vercel.app
- 🔧 Admin: https://ecommerce-admin.vercel.app
- 🚀 Backend: https://ecommerce-backend.onrender.com

A full-stack e-commerce web application built with **React**, **Node.js/Express**, and **MongoDB Atlas**. Features a storefront with product browsing, cart management, and user authentication, plus an admin panel for managing products.

---

## 📁 Project Structure

```
shopper/
├── frontend/          # React storefront
│   └── src/
│       ├── Context/
│       │   └── ShopContext.jsx    # Global cart & product state
│       └── assets/
│           ├── all_product.js     # Static product data (36 items)
│           ├── new_collections.js # Featured new arrivals (8 items)
│           ├── data.js            # Popular women's products (4 items)
│           └── product_*.png      # Product images (1–36)
│
├── backend/           # Node.js/Express API server
│   ├── index.js       # Main server & all API routes
│   ├── upload/
│   │   └── images/    # Uploaded product images (served statically)
│   └── .env           # Environment variables (see setup)
│
└── admin/             # React admin panel
    └── src/           # Add Product / List Product pages
```

---

## ✨ Features

- **Storefront** — Browse products by category (Women, Men, Kids), view new collections and popular items
- **Shopping Cart** — Add/remove items, live quantity tracking, total price calculation
- **User Auth** — Sign up and log in with JWT-based authentication; cart is persisted per user in MongoDB
- **Admin Panel** — Upload product images, add new products, remove existing ones
- **Persistent Cart** — Cart state syncs with the database when logged in; falls back to local state for guests

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Context API |
| Backend | Node.js, Express |
| Database | MongoDB Atlas + Mongoose |
| Auth | JSON Web Tokens (JWT) |
| File Uploads | Multer |
| Environment | dotenv |

---

## ⚙️ Setup & Installation

### Prerequisites

- Node.js v18+
- A [MongoDB Atlas](https://cloud.mongodb.com) account and cluster

### 1. Clone the repository

```bash
git clone https://github.com/your-username/shopper.git
cd shopper
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
MONGO_URL=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/shopper
```

Start the backend server:

```bash
node index.js
# ✅ Server running on http://localhost:4000
# ✅ MongoDB connected successfully
```

### 3. Frontend setup

```bash
cd ../frontend
npm install
npm start
# App runs on http://localhost:3000
```

### 4. Admin panel setup

```bash
cd ../admin
npm install
npm start
# Admin runs on http://localhost:5173 (or next available port)
```

---

## 🗄️ Seeding the Database

To bulk-import all 36 products into MongoDB Atlas without using the admin panel:

**Option A — MongoDB Atlas UI (easiest)**

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → Browse Collections
2. Select your database → `products` collection → Insert Document
3. Switch to JSON view, paste the contents of `products.json`, click Insert

**Option B — mongoimport CLI**

```bash
mongoimport --uri "your_MONGO_URL" \
  --collection products \
  --array \
  --file products.json
```

> After seeding, make sure all `product_1.png` through `product_36.png` images are copied into `backend/upload/images/` so they are served correctly.

---

## 🔌 API Reference

### Products

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/allproducts` | Fetch all products |
| `GET` | `/newcollections` | Fetch 8 newest products |
| `GET` | `/popularinwoman` | Fetch 4 popular women's products |
| `POST` | `/addproduct` | Add a new product (admin) |
| `POST` | `/removeproduct` | Delete a product by ID (admin) |
| `POST` | `/upload` | Upload a product image |

### Auth

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/signup` | Register a new user |
| `POST` | `/login` | Log in and receive a JWT token |

### Cart (requires `auth-token` header)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/addtocart` | Add item to cart |
| `POST` | `/removefromcart` | Remove item from cart |
| `POST` | `/getcart` | Get current user's cart |

---

## 🧩 ShopContext

`ShopContext.jsx` provides global state to all components via React Context.

**Available values from `useContext(ShopContext)`:**

| Value | Type | Description |
|---|---|---|
| `all_product` | `Array` | All products fetched from the API |
| `cartItems` | `Object` | Map of `productId → quantity` |
| `addToCart(id)` | `Function` | Add one unit of a product to cart |
| `removeFromCart(id)` | `Function` | Remove one unit from cart |
| `getTotalCartItems()` | `Function` | Returns total item count in cart |
| `getTotalCartAmount()` | `Function` | Returns total price of cart |
| `loading` | `Boolean` | True while products/cart are being fetched |
| `error` | `String\|null` | Error message if product fetch fails |

**Example usage in a component:**

```jsx
import { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";

const MyComponent = () => {
  const { all_product, addToCart, getTotalCartItems } = useContext(ShopContext);
  // ...
};
```

---

## 🐛 Known Bugs Fixed

These bugs were present in the original codebase and have been corrected:

1. **`Users` → `User`** in `/addtocart` route — the model variable was named incorrectly, causing a `ReferenceError` at runtime
2. **`cartdData` → `cartData`** in `/removefromcart` — typo meant cart items could never be decremented
3. **Missing try/catch** — all routes now handle errors gracefully and return proper HTTP status codes instead of crashing the server

---

## 🔒 Security Notes

- Passwords are currently stored as **plain text** — for production, hash them using [bcrypt](https://www.npmjs.com/package/bcrypt)
- The JWT secret `"secret_ecom"` is hardcoded — move it to `.env` as `JWT_SECRET`
- Add rate limiting (e.g. [express-rate-limit](https://www.npmjs.com/package/express-rate-limit)) to auth endpoints before going live

---

## 📄 License

MIT
