## Frontend (React)

### Setup
1) Install deps
```
npm install
```

2) Environment
Create `./.env` from `./.env.example`:
```
REACT_APP_BACKEND_SERVER_URI=
```

3) Run
```
npm start
```
Open http://localhost:3000

### Structure
```
src/
  components/
  pages/
  features/
    trip-planner/
  utils/
  styles/
  assets/
    images/
```

### Notes
- Shared utility `getUserInfo` lives in `src/utils/decodeJwt.js`
- Tailwind and Bootstrap are included; see `index.css` and `tailwind.config.js`
