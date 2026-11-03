# TopCinnamon – Frontend

React frontend for **TopCinnamon**, an e-commerce website for Sri Lankan cinnamon products. Customers can browse products, manage a cart, check out and leave reviews, and admins get a dashboard for products and payments. It connects to the [Spring Boot backend](https://github.com/NisalWeerakoon/topcinnamon-backend).

> Team project (SLIIT, Year 2). This was the team's first full-stack web application.

## Features

- **Home, About and Contact pages**
- **Products:** product listing with categories and a product detail view
- **Authentication:** login and registration through a modal, with session state kept in React Context
- **Cart:** add, update and remove items, synced with the backend database for logged-in users
- **Checkout & payment:** checkout form connected to the backend's mock payment gateway
- **Reviews:** customers can post product reviews
- **Admin dashboard:** product management and a payment overview

## Tech Stack

| Area | Technology |
|---|---|
| Library | React 19 |
| Build tool | Vite |
| Routing | React Router |
| Icons | React Icons |
| Styling | CSS (one stylesheet per component) |
| Linting | ESLint |

## Project Structure

```
src/
├── components/   Navbar, Home, Products, ProductDetail, Cart, Checkout, Payment, Reviews, Auth, Dashboard
├── pages/        Home, Products, About and Contact pages
├── services/     API calls to the backend
├── App.jsx       Routes
└── main.jsx      Entry point
```

## Getting Started

### Prerequisites
- Node.js 20 or newer
- The [backend](https://github.com/NisalWeerakoon/topcinnamon-backend) running on `http://localhost:8080`

### Run

```bash
git clone https://github.com/NisalWeerakoon/topcinnamon-frontend.git
cd topcinnamon-frontend
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

| Script | Purpose |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

## Team

| Member | Contribution |
|---|---|
| [Nisal Weerakoon](https://github.com/NisalWeerakoon) | Project setup, home page, checkout and backend integration |
| [Ravindu Senanayake](https://github.com/Ravindu-S) | Products page, admin dashboard, and connecting the home page, login and cart |
