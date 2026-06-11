# DormSC

Off-campus housing platform for USC students. Browse, list, and favorite apartments near University Park.

## Stack

- **Client** — React + Vite + TypeScript + Tailwind CSS
- **Server** — Express + TypeScript
- **Database** — MongoDB Atlas (Mongoose)
- **Auth** — JWT via HTTP-only cookies
- **AI** — OpenAI GPT-4o mini (housing assistant chatbot)
- **Maps** — Leaflet + OpenStreetMap (auto-geocoded via Nominatim)

## Features

- Listing search with filters (price, beds, baths, distance to USC)
- Interactive map with price pins
- Favorites
- Reviews & ratings
- Admin panel (user management, listing moderation)
- AI chatbot aware of active listings

## Local Setup

**Prerequisites:** Node.js 18+, npm 9+

```bash
# Install dependencies
npm install

# Configure environment
cp server/.env.example server/.env
# Fill in MONGODB_URI, JWT_SECRET, OPENAI_API_KEY

# Start both client and server
npm run dev --workspace=client &
npm run dev --workspace=server
```

Client runs on `http://localhost:5173`, server on `http://localhost:5001`.

## Environment Variables

See `server/.env.example`. Required:

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret for signing JWTs |
| `OPENAI_API_KEY` | OpenAI API key (for chatbot) |
| `ADMIN_EMAILS` | Comma-separated emails granted admin role on signup |
| `CLIENT_URL` | Frontend URL (for CORS) |

## Project Structure

```
DormSC-MERN/
├── client/          # React frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       └── lib/
└── server/          # Express backend
    └── src/
        ├── routes/
        ├── models/
        ├── middleware/
        └── lib/
```
