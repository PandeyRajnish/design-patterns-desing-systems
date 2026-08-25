# Container Components

**Container / Presentational** pattern: containers fetch and inject data; presentational components only render props.

| Role | Owns | Example |
|------|------|---------|
| Container | Fetch + inject props | `CurrentUserLoader` |
| Presentational | UI only | `UserInfo`, `BookInfo` |

---

## Folder map

```
container-components/
├── server.js                 ← Express API (:3000)
├── vite.config.js            ← proxies API paths → :3000
└── src/
    ├── App.jsx               ← CurrentUserLoader + UserInfo
    └── components/
        ├── current-user-loader.jsx
        ├── user-info.jsx
        └── book-info.jsx     ← ready for a book loader
```

---

## How it works

```jsx
<CurrentUserLoader>
  <UserInfo />
</CurrentUserLoader>
```

1. `CurrentUserLoader` fetches `GET /current-user` (axios) on mount
2. Injects `{ user }` into children via `cloneElement`
3. `UserInfo` renders the user (or **Loading...** while `user` is null)

Vite proxies `/current-user`, `/users`, `/user`, `/books`, `/book` → `http://localhost:3000`. Both the API and Vite must be running.

### React helpers

| API | Role |
|-----|------|
| `React.Children.map` | Safely walk one or many children |
| `React.isValidElement` | True only for real elements (skip text/`null`) |
| `React.cloneElement` | Copy a child and merge extra props (`{ user }`) |

Flow: **Children** walk → **isValidElement** check → **cloneElement** inject.

---

## Presentational

- `UserInfo` — expects `{ name, age, country, books[] }`
- `BookInfo` — expects `{ name, price, title, pages }` (not wired in App yet)

No fetch/axios inside these — props only.

---

## API (`server.js`)

| Method | Path | Notes |
|--------|------|-------|
| `GET` | `/current-user` | Used by `CurrentUserLoader` |
| `GET` | `/users`, `/user/:id` | `:id` needs `id` on data |
| `GET` | `/books`, `/book/:id` | same |
| `POST` | `/users/:id` | update user |

---

## Run

```bash
# terminal 1 — from this folder
node server.js

# terminal 2 — from repo root
npm run dev:container
```

Or `npm run dev` inside this folder. Open the Vite URL → Loading… then current user.

---

## Next

- [ ] `UserLoader` / `BookLoader` (by id)
- [ ] Generic `ResourceLoader` (`resourceUrl` + `resourceName`)
- [ ] Add `id`s to server data; optional error handling in containers

**Stack:** React + Vite · axios · express · Vite proxy
