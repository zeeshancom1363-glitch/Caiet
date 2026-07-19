# CAI&ET Folder Hierarchy & Guide

Our project is strictly separated into two independent folders representing the frontend and backend architectures:

## `backend/` Folder (Node.js/Express)
The backend manages data persistence and handles all incoming requests.

*   `app.js` / `server.js` — The core initialization of Express.
*   `.env` — Sensitive environment mapping.
*   `prisma/` — ORM definitions. `schema.prisma` holds all 20 database tables. `seed.js` fills the SQLite DB with defaults.
*   `routes/` — Categorized Express Routers. Usually paired into `publicRoutes` and `adminRoutes`.
*   `controllers/` — Where business logic lives.
*   `middleware/` — Contains our JWT validation logic and Error handling components.
*   `utils/` — Helper scripts.
*   `uploads/` — Locally generated via Multer for user images/banners. Avoid pushing this direct folder to Git if large.

## `frontend/` Folder (React/Vite)
The frontend is the interactive User Interface built with React.

*   `index.html` — Base DOM attachment point.
*   `vite.config.js` — Vite bundler configuration.
*   `tailwind.config.js` — Core Tailwind UI themes (Colors, typography, extended spacing).
*   `src/` — Primary application codebase:
    *   `main.jsx` — Bootstraps the React DOM and Router.
    *   `App.jsx` — Houses all structural Routes (Public vs Admin wrappers).
    *   `context/AuthContext.jsx` — Stores user login state dynamically.
    *   `api/` — We use Axios extensively here.
        *   `publicApi.js` for user-facing reads.
        *   `adminApi.js` for authenticated administration calls.
    *   `components/` — Split by view (`website/` vs `admin/`).
    *   `pages/` — The actual rendered views mapped directly within `App.jsx`. Similarly grouped between `website/` and `admin/`.
