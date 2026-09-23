# Chirp — A Twitter/X-Inspired Social Media App

A full-stack social media application with a clean blue-and-white Twitter-inspired
interface. Users can sign up, log in, publish posts, follow other users, like,
repost, and save posts, and receive real-time updates via WebSockets.

## Tech Stack

**Frontend:** React, JavaScript, React Router, Axios, Socket.IO client, styled-components
**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, Socket.IO

### Styling

The UI is styled entirely with [`styled-components`](https://styled-components.com/)
using the `styled.element` API (no plain CSS files). A shared theme drives the
blue-and-white palette:

- `src/styles/theme.js` — design tokens (colors, radii, layout widths), provided
  app-wide via `ThemeProvider` in `src/main.jsx`.
- `src/styles/GlobalStyle.js` — `createGlobalStyle` baseline (fonts, resets,
  white background).
- `src/styles/shared.js` — reusable styled building blocks (`PrimaryButton`,
  `AppShell`, `MainColumn`, `PageHeader`, `Input`, etc.).
- `src/styles/auth.js` — styled pieces for the login/signup screens.

Each component defines its own styled elements (e.g. `const Card = styled.article\`...\``)
and reads theme values with `${({ theme }) => theme.colors.blue}`.

## Project Structure

```
sandbox/
├── backend/          # Express + MongoDB API server
│   ├── models/       # Mongoose models (User, Post)
│   ├── controllers/  # Route handlers
│   ├── routes/       # Express routers
│   ├── middleware/   # Auth, error handling
│   ├── utils/        # Config, DB, socket helpers
│   └── app.js        # Express app + server entry
└── frontend/         # React single-page app
    ├── public/
    └── src/
        ├── components/
        ├── pages/
        ├── context/
        └── services/
```

## Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB instance (local `mongod` or MongoDB Atlas connection string)

### Backend

```bash
cd backend
npm install
cp .env.example .env   # then edit MONGODB_URI and SECRET
npm run dev            # starts on http://localhost:3001
```

Environment variables (`backend/.env`):

| Variable      | Description                              | Default                                   |
| ------------- | ---------------------------------------- | ----------------------------------------- |
| `PORT`        | Server port                              | `3001`                                    |
| `MONGODB_URI` | MongoDB connection string                | `mongodb://localhost:27017/chirp`         |
| `SECRET`      | JWT signing secret                       | (required)                                |
| `CLIENT_URL`  | Allowed CORS origin for the frontend     | `http://localhost:5173`                   |

### Frontend

```bash
cd frontend
npm install
npm run dev            # starts on http://localhost:5173
```

The frontend dev server proxies `/api` and the Socket.IO connection to the
backend at `http://localhost:3001`.

> **Note on this sandbox:** the hosted environment runs in a restricted network
> mode where the public npm registry is blocked, so `npm install` cannot be run
> here and the app cannot be started in-sandbox. All code is complete and passes
> syntax/parse checks (`node --check` for the backend, Prettier parse for the
> frontend). Run the install/start commands above on a machine with normal
> internet access.

## API Overview

### Auth
- `POST /api/users` — sign up
- `POST /api/login` — log in, returns `{ token, ...user }`
- `GET  /api/users/me` — current user (protected)

### Users & Following
- `GET    /api/users` — list users
- `GET    /api/users/:id` — user profile (with posts & reposts)
- `POST   /api/users/:id/follow` — follow a user (protected)
- `DELETE /api/users/:id/follow` — unfollow a user (protected)

### Posts
- `GET    /api/posts` — home feed (self + followed users) (protected)
- `GET    /api/posts/explore` — posts outside your following (protected)
- `POST   /api/posts` — create a post (protected)
- `GET    /api/posts/saved` — saved/bookmarked posts (protected)
- `POST   /api/posts/:id/like`   / `DELETE /api/posts/:id/like`
- `POST   /api/posts/:id/repost` / `DELETE /api/posts/:id/repost`
- `POST   /api/posts/:id/save`   / `DELETE /api/posts/:id/save`

### Protected requests
Send the JWT in the `Authorization` header:

```
Authorization: Bearer <token>
```

## Real-Time Events (Socket.IO)

The server emits:
- `newPost` — a new post was created
- `postUpdated` — likes/reposts/saves changed on a post
- `newFollower` — someone followed a user (targeted to that user's room)

The frontend listens and updates React state so feeds refresh automatically.

## Backend-Enforced Rules
- Cannot follow yourself or the same user twice
- Cannot like / repost / save the same post twice
- Passwords are hashed with bcrypt (never stored in plain text)
- Protected routes verify the JWT; invalid/unauthorized requests return proper status codes
