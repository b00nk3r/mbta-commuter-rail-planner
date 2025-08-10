## Backend (Express API)

### Requirements
- Node.js 18+
- MongoDB (Atlas or local)

### Setup
1) Install deps
```
npm install
```

2) Environment
Create `./.env` from `./.env.example`:
```
DB_URL=
ACCESS_TOKEN_SECRET=
MBTA_API_KEY=
```

3) Run
```
# Dev (auto-restart)
npm run server

# Or plain Node
npm start
```
The server listens on port 8081 by default (see `src/server.js`).

### Project structure
```
src/
  config/
  models/
  routes/
    mbta/
    stations/
    users/
  utilities/
  server.js
```

### API exploration
- Examples in `../requests.http` (VS Code Rest Client compatible)

### Notes
- Do not commit real `.env`. Only commit `.env.example`.
