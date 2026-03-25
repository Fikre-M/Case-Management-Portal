# AI-Powered Case Management Dashboard

**Live demo:** [aidflow-casemgt.netlify.app](https://aidflow-casemgt.netlify.app/landing)

A case management system for legal professionals built with React 19 and a Gemini-powered AI assistant. Designed as a portfolio project demonstrating modern frontend architecture, AI integration, and production-aware patterns.

**Demo credentials:** `demo@example.com` / `password`

> **Note:** This is a frontend demo with mock data and client-side auth. See the [security notice](#security-notice) before deploying anywhere real.

---

## What it does

- Dashboard with live metrics, charts, and activity feed
- Case management — create, track, and update cases with progress indicators
- Appointment scheduling with status tracking
- Client profiles and management
- AI assistant sidebar powered by Google Gemini (falls back to mock responses without an API key)
- Conversation history with search, category filtering, and JSON export
- Dark / light mode with system preference detection
- Fully responsive — mobile through desktop

---

## Tech stack

| Layer | Technology | Version |
|---|---|---|
| UI framework | React | 19.2.4 |
| Build tool | Vite | 7.3.1 |
| Routing | React Router DOM | 7.13.1 |
| Styling | TailwindCSS | 3.4.19 |
| Animations | Framer Motion | 12.35.2 |
| Charts | Recharts | 3.8.0 |
| AI (client) | Google Generative AI SDK | 0.24.1 |
| AI (server proxy) | Netlify Functions + Gemini 1.5 Flash | — |
| Auth tokens | jsonwebtoken | 9.0.3 |
| Performance | web-vitals | 4.2.4 |
| Testing | Vitest + Testing Library | 4.0.18 |
| Linting | ESLint + Prettier | 8.55.0 |

---

## Quick start

```bash
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:5001` and log in with the demo credentials above.

### With a real AI key (optional)

Add your Gemini API key to `.env`:

```env
VITE_AidFlow_API_KEY=your-gemini-api-key-here
```

Without a key the AI assistant still works — it returns mock responses so you can explore the full UI.

---

## Project structure

```
src/
├── components/
│   ├── ai/             # AI assistant sidebar, suggestions, conversation history
│   ├── charts/         # Recharts wrappers (AppointmentChart, CaseStatusChart)
│   ├── common/         # Card, Badge, Loading, ErrorBoundary, PerformanceMonitor
│   ├── forms/          # Login, Register forms
│   ├── layout/         # MainLayout, AuthLayout, Sidebar, Navbar
│   └── navigation/     # Route-aware nav components
├── context/
│   ├── AIContext.jsx   # AI state — conversations, settings, assistant visibility
│   ├── AppContext.jsx  # Cases, appointments, clients (mock data)
│   ├── AuthContext.jsx # Session management (demo only — see security notice)
│   ├── ErrorContext.jsx
│   └── ThemeContext.jsx
├── hooks/
│   ├── useAIAssistant.js   # AI chat state and message handling
│   ├── useDraggable.js     # Drag-to-reposition for dev panels
│   ├── usePerformance.js   # FPS, memory, load time tracking
│   └── useWebVitals.js     # Core Web Vitals (LCP, FID, CLS, INP, TTFB)
├── pages/
│   ├── dashboard/      # Main dashboard
│   ├── cases/          # Case list, detail, create
│   ├── appointments/   # Appointment list, detail, create
│   ├── clients/        # Client profiles
│   ├── ai/             # AI dashboard, chat, history, settings
│   └── auth/           # Login, Register
├── services/
│   └── aiService-universal.js  # Gemini direct (dev) or Netlify proxy (prod)
├── routes/             # AppRoutes, ProtectedRoute
└── utils/
netlify/
└── functions/          # Serverless functions (ai-proxy, auth, suggestions, usage)
```

---

## AI integration

The AI assistant runs in two modes depending on environment:

**Local development** — calls the Gemini API directly from the browser using your `VITE_AidFlow_API_KEY`. Convenient for development, not safe for production.

**Production (Netlify)** — all AI requests go through a serverless proxy at `netlify/functions/ai-proxy.js`. The proxy handles JWT verification, per-user rate limiting (30 req/min), and keeps the API key server-side.

```
Local:      Browser → Gemini API (direct, dev only)
Production: Browser → Netlify Function → Gemini API (key stays server-side)
```

The service auto-detects which mode to use based on hostname. If neither a key nor a proxy is available, it falls back to mock responses — the UI stays fully functional either way.

---

## Architecture patterns

- **Context API** for global state (auth, theme, app data, AI, errors) — no external state library needed at this scale
- **Custom hooks** encapsulate all side-effect logic (`usePerformance`, `useWebVitals`, `useAIAssistant`, `useDraggable`)
- **Error boundaries** at the app root with a `GlobalErrorDisplay` for non-fatal errors
- **Protected routes** via `ProtectedRoute` wrapper — unauthenticated users redirect to login
- **Service layer** (`aiService-universal.js`) abstracts the AI provider so the UI doesn't care whether it's talking to a real API or mock data
- **Lazy loading** configured in Vite for route-level code splitting

---

## Development tools

Two dev-only overlays are included (both render `null` in production):

**Performance Monitor** — shows live Core Web Vitals (LCP, FID, CLS, INP, TTFB) alongside runtime metrics (FPS, memory, load time). Draggable panel, minimizable.

**Auth Debugger** — shows current session state (authenticated, user name/email, session active). Useful when testing auth flows.

---

## Available scripts

```bash
npm run dev              # Dev server (port 5001)
npm run build            # Production build
npm run preview          # Preview production build locally
npm run lint             # ESLint
npm run lint:fix         # ESLint with auto-fix
npm run format           # Prettier
npm run test             # Vitest (watch mode)
npm run test:coverage    # Coverage report
npm run analyze          # Bundle size analysis
npm run deploy:netlify   # Build + deploy to Netlify
npm run deploy:vercel    # Build + deploy to Vercel
```

---

## Security notice

**Authentication** — login and registration call real Netlify serverless functions (`/api/auth/login`, `/api/auth/register`) that use bcrypt password hashing and JWT tokens. The demo user (`demo@example.com` / `password`) is seeded with a pre-hashed password in the function. When running locally without Netlify CLI, the app falls back to a client-side demo mode automatically.

**AI API key** — in local dev the Gemini key is read from `VITE_*` env vars, which means it's visible in the browser bundle. The Netlify proxy exists specifically to avoid this in production — the key lives in Netlify environment variables, never in the frontend bundle.

**Mock data** — all case, appointment, and client data is generated in-memory. Nothing is persisted to a real database.

---

## What's not here (yet)

- Real backend / database
- Production authentication
- File storage for documents
- Email notifications
- End-to-end tests

---

## License

MIT
