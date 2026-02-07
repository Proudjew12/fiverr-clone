# Fiverr Clone (Learning Project)

A full-stack Fiverr-style marketplace clone built for learning and practice.

This is an educational project, not a production system.

## Tech Stack

### Frontend
- React (Vite)
- React Router
- Redux Toolkit
- Socket.IO client
- Swiper
- CSS (no CSS-in-JS)

### Backend
- Node.js
- Express
- MongoDB (native driver, no Mongoose)
- Socket.IO
- Cookie-based login token
- REST API

## Project Structure

```text
fiverr-clone/
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   └── style/
│   ├── public/
│   └── package.json
├── Backend/
│   ├── api/
│   ├── services/
│   ├── middlewares/
│   ├── config/
│   └── server.js
└── README.md
```

## Getting Started

### 1. Clone

```bash
git clone https://github.com/Proudjew12/fiverr-clone.git
cd fiverr-clone
```

### 2. Install dependencies

```bash
npm --prefix Backend install
npm --prefix Frontend install
```

### 3. Configure backend environment

Create `Backend/.env`:

```env
NODE_ENV=development
DB_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/
DB_NAME=fiverr_shared
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### 4. Run development servers

```bash
npm --prefix Backend run dev
npm --prefix Frontend run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3030`

## Available Scripts

### Backend
- `npm --prefix Backend run dev`
- `npm --prefix Backend start`
- `npm --prefix Backend run lint`

### Frontend
- `npm --prefix Frontend run dev`
- `npm --prefix Frontend run build`
- `npm --prefix Frontend run preview`
- `npm --prefix Frontend run lint`
- `npm --prefix Frontend run format`
- `npm --prefix Frontend run e2e`
- `npm --prefix Frontend run e2e:headed`
- `npm --prefix Frontend run e2e:report`

Note: `e2e` scripts require Playwright tests under `Frontend/tests/e2e`.

## API and Realtime

### REST endpoints
- `/api/health`
- `/api/gig`
- `/api/order`
- `/api/user`
- `/api/wishlist`
- `/api/auth`

### Socket events
- Client emits: `set-topic`, `gig-order`, `send-msg`, `update-request`, `open-order-chat`, `send-order-chat-msg`
- Server emits: `ordered-gig`, `msg-sent`, `request-updated`, `order-chat-opened`, `order-chat-msg`

## Notes

- MongoDB credentials are not committed to the repository.
- Collaborators can use shared Atlas credentials.
- Non-collaborators can run the full project with their own `.env` and database.

## License

Educational use only.
