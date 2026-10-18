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

Run the same validation used by CI:

```bash
npm run check
```

## Environment Variables

See `server/.env.example`. Required:

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret for signing JWTs |
| `OPENAI_API_KEY` | OpenAI API key (for chatbot) |
| `ADMIN_EMAILS` | Comma-separated emails granted admin role on signup |
| `CLIENT_URL` | Comma-separated frontend origins allowed by CORS |
| `OPENAI_MODEL` | Optional chat model override (defaults to `gpt-4o-mini`) |

The client optionally accepts `VITE_MAPBOX_ACCESS_TOKEN`. Set it in Vercel to
use the Mapbox Light basemap; without it, the map safely falls back to Esri's
light-gray tiles. Mapbox public tokens should be URL-restricted to the production
domain and localhost during development.

## Production deployment

- Configure Vercel with `client` as the root directory. `client/vercel.json`
  proxies `/api/*` to Render so authentication cookies remain first-party.
- Configure Render with `server` as the root directory, `npm run build` as the
  build command, and `npm start` as the start command.
- Set `NODE_ENV=production`, a strong `JWT_SECRET`, the production MongoDB URI,
  and `CLIENT_URL=https://dorm-sc.vercel.app` on Render.
- The scheduled keep-warm workflow is only a best-effort optimization. GitHub
  scheduled runs can be delayed or dropped; use an always-on Render plan or a
  dedicated uptime service when predictable latency is required.

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
