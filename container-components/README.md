# Container Components

Learning project for the **Container / Presentational** pattern in React.

Use this README when you revise — it documents what you built, why it works, and what to try next.

---

## Pattern idea

| Role | Owns | Does not own |
|------|------|--------------|
| **Container** | Data fetching, loading, wiring props | How the UI looks |
| **Presentational** | Markup and display | Where data comes from |

Shared theme: **separate data from presentation**.

- Container = “get the data and pass it down”
- Presentational = “render whatever props you receive”
- `server.js` = fake REST API so containers have something real to call

Same presentational component can be fed by different containers (current user vs user by id). Same container can swap which presentational child it renders.

---

## What’s in this project so far

| Piece | Status | Role |
|-------|--------|------|
| `server.js` | Done | Express API with in-memory users & books |
| `UserInfo` | Done | Presentational — renders a user |
| `BookInfo` | Done | Presentational — renders a book |
| Container components | Next | Fetch from API, pass data into the above |
| `App.jsx` demos | Stub | Heading only until containers are wired |

---

## Folder map

```
container-components/
├── server.js                          ← Express mock API (port 3000)
├── package.json                       ← react, axios, express, styled-components
└── src/
    ├── App.jsx                        ← demos (to wire containers here)
    ├── main.jsx
    └── components/
        ├── user-info.jsx              ← presentational: user
        └── book-info.jsx              ← presentational: book
```

Typical next files (when you add containers):

```
src/components/
├── current-user-loader.jsx            ← container: GET /current-user → UserInfo
├── user-loader.jsx                    ← container: GET /user/:id → UserInfo
└── book-loader.jsx                    ← container: GET /book/:id → BookInfo
```

---

## 1. Presentational components

They only care about props. No `fetch`, no `axios`, no URL knowledge.

### `UserInfo`

```jsx
<UserInfo user={someUser} />
```

| Prop | Meaning |
|------|---------|
| `user` | `{ name, age, country, books: string[] }` — or falsy while loading |

Shows name, age, country, and a books list. If `user` is missing, shows **Loading...**.

### `BookInfo`

```jsx
<BookInfo book={someBook} />
```

| Prop | Meaning |
|------|---------|
| `book` | `{ name, price, title, pages }` — or falsy while loading |

Shows name, price, title (author in this dataset), and page count. If `book` is missing, shows **Loading...**.

### Why “Loading...” lives in the presentational layer

Both components treat a missing prop as “not ready yet.” Containers can render them immediately with `user={null}` / `book={undefined}` and update once the request finishes — no extra loading UI in the container.

---

## 2. Mock API (`server.js`)

In-memory Express server so containers practice real HTTP instead of hard-coded `data/*.js`.

| Method | Path | Returns |
|--------|------|---------|
| `GET` | `/current-user` | The logged-in-style user object |
| `GET` | `/users` | All users |
| `GET` | `/user/:id` | One user (needs `id` on each user — see checklist) |
| `POST` | `/users/:id` | Update a user from `req.body.user` |
| `GET` | `/books` | All books |
| `GET` | `/book/:id` | One book (same `id` caveat) |

Default port: **3000**.

Data shapes match what `UserInfo` / `BookInfo` expect (same idea as layout-component’s authors & books).

---

## 3. Container components (what you’ll build)

A container typically:

1. Holds state for the resource (`user`, `book`, …)
2. Fetches in `useEffect` (often via `axios`)
3. Renders a presentational child with that data

Sketch:

```jsx
export const CurrentUserLoader = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const response = await axios.get("/current-user");
      setUser(response.data);
    })();
  }, []);

  return (
    <>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { user })
      )}
    </>
  );
};
```

Usage idea:

```jsx
<CurrentUserLoader>
  <UserInfo />
</CurrentUserLoader>
```

The container injects `user`; `UserInfo` stays reusable and unaware of the endpoint.

| Container idea | Fetches | Injects |
|----------------|---------|---------|
| Current user loader | `GET /current-user` | `user` |
| User loader | `GET /user/:id` | `user` |
| Book loader | `GET /book/:id` | `book` |
| Resource loader (generic) | any URL | prop named by you |

---

## Mental model (revise this)

```
server.js           →  fake backend (source of truth for demos)
Container           →  when / how to load; which prop to pass
Presentational      →  how one resource looks (UserInfo / BookInfo)
children + clone    →  inject data without hard-wiring one child type
App.jsx             →  compose containers + presentational demos
```

You can freely recombine:

```text
CurrentUserLoader  + UserInfo
UserLoader(id)     + UserInfo
BookLoader(id)     + BookInfo
Same UserInfo      + different containers
```

---

## Run

You need **two processes**: the API and the Vite app.

### 1. Start the mock API

From this folder:

```bash
node server.js
```

Should log: `Server is listening on port 3000`.

### 2. Start the React app

From repo root:

```bash
npm run dev:container
```

From this folder:

```bash
npm run dev
```

Usually http://localhost:5173 (or the next free port if layout is already running).

### Dev tip — calling the API from the browser

Vite runs on a different origin than Express. Options:

- Point `axios` at `http://localhost:3000/...` (and add CORS on the server), or
- Add a Vite `server.proxy` so `/current-user` etc. forward to port 3000

Pick one before wiring the first container, or requests will fail in the browser.

---

## Revise checklist

### Presentational

- [ ] Render `UserInfo` / `BookInfo` with hard-coded props in `App.jsx` — prove UI works without containers
- [ ] Confirm falsy props show **Loading...**
- [ ] Guard `books.map` if `books` can be missing (optional hardening)

### Server

- [ ] Hit `GET http://localhost:3000/current-user` and `/books` in the browser or curl
- [ ] Add `id` fields to `users` / `books` so `/user/:id` and `/book/:id` actually find records
- [ ] Add CORS (or Vite proxy) so the React app can call the API

### Containers (next pattern work)

- [ ] Build `CurrentUserLoader` — fetch `/current-user`, inject `user` into children
- [ ] Build `UserLoader` / `BookLoader` with an `userId` / `bookId` prop
- [ ] Try a generic `ResourceLoader` (`resourceUrl` + `resourceName`)
- [ ] Demo several containers in `App.jsx` with the same presentational children
- [ ] Optional: loading / error state in the container instead of (or in addition to) presentational fallbacks

### Monorepo

- [ ] Root `package.json` workspace name matches this folder (`container-components`)
- [ ] Root README projects table lists this app

---

## Stack

- React + Vite
- axios (HTTP from containers)
- express (mock API in `server.js`)
- styled-components (available; not required for the presentational pieces yet)
