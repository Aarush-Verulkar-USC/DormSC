# DormSC – Resume Points

**DormSC | Full-Stack Web Application (MERN + TypeScript)**

- Designed and built a full-stack off-campus housing platform for USC students, implementing a React/TypeScript/Tailwind frontend and an Express/TypeScript REST API backed by MongoDB Atlas, totaling ~10,750 lines across 60+ files.
- Implemented secure authentication using JWT stored in HTTP-only cookies, with role-based access control (student vs. admin) and account-blocking middleware to enforce platform policy.
- Built a listing search and discovery system with full-text search (MongoDB text indexes), price/bedroom/bathroom/availability filters, multi-field sorting, and server-side pagination to keep large result sets performant.
- Integrated an AI housing assistant powered by OpenAI's GPT-4o mini with streamed (SSE) responses, grounding the chatbot's answers in real-time active listing data to provide accurate, context-aware recommendations to students.
- Built an interactive map feature with Leaflet and OpenStreetMap, auto-geocoding listing addresses via the Nominatim API and rendering price-labeled pins to help students evaluate proximity to campus.
- Developed a reviews and ratings system with ownership-based edit/delete permissions and validation (Zod schemas) across all create/update endpoints to ensure data integrity.
- Enforced business rules at the API layer, such as capping landlords to two active listings, reducing spam and improving listing quality.
- Built an admin dashboard exposing platform-wide statistics (users, listings, reviews) and moderation tools for managing users and listings, reducing manual oversight effort.
- Added a favorites system allowing students to bookmark and revisit listings, improving user retention and engagement.

---

## Shorter / condensed versions (pick 3-5 for a resume)

- Built a full-stack MERN housing marketplace (React/TS, Express/TS, MongoDB) with JWT auth, role-based access control, and an admin moderation panel.
- Designed search/filter/sort system with full-text search and pagination over a MongoDB-backed listings API.
- Integrated an OpenAI GPT-4o mini chatbot with streaming responses, grounded in live listing data, to help students find housing.
- Built an interactive Leaflet/OpenStreetMap view with automatic address geocoding (Nominatim) to visualize listings near USC.
- Implemented reviews, favorites, and listing CRUD with Zod validation and ownership-based authorization.
