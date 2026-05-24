# Fiverr Clone

A full-stack Fiverr-style marketplace clone built for learning and portfolio use.

This is an educational project, not a production system.

## Live Demo

- 👉 [[Open the live demo (GitHub Pages)](https://proudjew12.github.io/fiverr-clone/)](https://proudjew12.github.io/fiverr-clone/)

### What visitors should expect

- The frontend is hosted on GitHub Pages.
- The backend API is hosted on Render (free tier).
- If Render is sleeping, the app shows a real backend warm-up loader before opening.
- After warm-up, gigs are loaded from MongoDB through the backend API automatically.

## Project Overview

This project recreates a Fiverr-like marketplace experience with a React frontend and an Express/MongoDB backend. It includes dynamic gig data, authentication, orders, wishlist functionality, and realtime features with Socket.IO.

## Tech Stack

- Frontend: React (Vite), React Router, Redux Toolkit, Socket.IO client, Swiper, CSS
- Backend: Node.js, Express, MongoDB (native driver), Socket.IO, cookie-based auth
- Hosting: GitHub Pages (frontend) + Render (backend) + MongoDB Atlas

## Key Features

- Gig browsing and gig details pages
- Dynamic data loaded from backend API (`/api/gig`)
- Cookie-based authentication
- Orders and wishlist flows
- Realtime events with Socket.IO
- Render cold-start detection with a real startup/warm-up screen

## Run Locally

### 1. Clone and install

```bash
git clone https://github.com/Proudjew12/fiverr-clone.git
cd fiverr-clone
npm --prefix Backend install
npm --prefix Frontend install
```

### 2. Backend environment (`Backend/.env`)

```env
NODE_ENV=development
PORT=3030
DB_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/
DB_NAME=fiverr_shared
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### 3. Frontend environment (`Frontend/.env`, optional)

```env
VITE_API_URL=http://127.0.0.1:3030/api/
VITE_SOCKET_URL=http://127.0.0.1:3030
```

If omitted, the frontend uses local defaults in development.

### 4. Start both apps

```bash
npm --prefix Backend run dev
npm --prefix Frontend run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3030`

## Deployment Notes

- GitHub Pages hosts only the frontend static files.
- Render hosts the backend API and may cold-start after inactivity (free tier).
- The backend root URL may return `{"error":"Not found"}`; use `/api/health` for health checks.
- MongoDB credentials and secrets must stay in backend environment variables (never in frontend code).

## License

Educational use only.
