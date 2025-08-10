### MBTA Commuter Rail Planner
Full‑stack app for exploring MBTA commuter rail lines, viewing alerts, and planning trips.

### Tech
- **Backend**: Node.js, Express, MongoDB/Mongoose, JWT, Zod
- **Frontend**: React (CRA), React Router, React‑Bootstrap, Leaflet

### Monorepo layout
```
mbta-commuter-rail-planner/
  backend/
    src/
      config/
      models/
      routes/
        mbta/
        stations/
        users/
      utilities/
      server.js
    requests.http
  frontend/
    src/
      components/
      pages/
      pages/
      utils/
      styles/
      assets/images/
```

### Quick start
1) Install deps
```
cd backend && npm install
cd ../frontend && npm install
```

2) Configure env files (copy from templates)
- Create `backend/.env` from `backend/.env.example`
- Create `frontend/.env` from `frontend/.env.example`

3) Run locally (two terminals)
```
# Terminal 1 (backend)
cd backend
npm run server

# Terminal 2 (frontend)
cd frontend
npm start
```
- Backend: `http://localhost:8081`
- Frontend: `http://localhost:3000`

### Environment variables
- **backend/.env**
  - `DB_URL=` MongoDB connection string
  - `ACCESS_TOKEN_SECRET=` secret used to sign JWTs
  - `MBTA_API_KEY=` MBTA API key
- **frontend/.env**
  - `REACT_APP_BACKEND_SERVER_URI=` e.g. `http://localhost:8081`

Keep real `.env` files out of git. Commit only `.env.example` templates.

### Helpful
- REST examples: `backend/requests.http` (VS Code Rest Client compatible)
- Trip planner lives in `frontend/src/pages/` files: `tripPlannerPage.js`, `tripPlannerControlPanel.js`, `tripPlannerMap.js`, `tripPlannerHelpers.js`
