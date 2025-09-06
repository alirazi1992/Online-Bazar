# Online Bazaar 

Welcome to **Online Bazaar**!
This is a full demo of a marketplace/directory with multiple pages, dashboards, and sample data. Everything is built with static **HTML/CSS/JS** and runs without any backend.
---
## ✨ Features

- **Home page** with featured shops

- **Search** and **Categories** pages

- **Dedicated landing page** for each shop (`shop.html?shop=slug`)

- Shopping cart + **Checkout flow** (using LocalStorage)

- **Client Dashboard**: order tracking, KPIs, export to CSV

- **Vendor Dashboard**: manage products, orders, finances + upload receipts (demo only)

- Unified **header navigation** with active tab highlighting

- Fixes for the Cannot `GET /index.html` issue (links rewritten automatically)

- **RTL layout** with Persian-friendly font (Vazirmatn)

---

## 🗂 Folder Structure

bazar-clean/
├── index.html

├── search.html

├── categories.html

├── vendor.html

├── client-dashboard.html

├── vendor-dashboard.html

├── vendor-products.html

├── vendor-orders.html

├── vendor-finance.html

├── shop.html

├── checkout.html

├── order-success.html

├── app.js

├── shop.js

└── site.css

---

## 🧩 Main Files

- **site.css**: shared styles (cards, buttons, badges, etc.)

- **app.js**:

    - Fixes `index.html` links

    - Highlights active nav tab

    - Seeds sample data (orders, vendor products, receipts)

    - Implements Search, Categories, Vendor Profile, Dashboards

- **shop.js**:

      - Contains demo shop/product data

      - Renders shop landing pages (`shop.html?shop=slug`)

      - Handles cart + checkout (LocalStorage)
---

## 🧪 Sample Data

- **Shops**: `negin-shoes`, `arad-mobile`, `ketab-cafe`, `homey`

- **Client orders**: several with statuses (`processing`, `shipping`, `delivered`, `refunded`)

- **Vendor products**: two default products + demo add product modal

- **Finance**: receipts + simple bar chart of last 30 days sales

All stored in **LocalStorage** just for demo purposes (no server).

---
## 🌐 Multi-language & RTL/LTR

- Site is fully **RTL**.

- Inputs like email/URL use `.ltr-support` for proper alignment.

- To add an English version: duplicate pages with `dir="ltr"` and adjust content.
