# Container Components

Learning project for the **Container / Presentational** pattern in React.

Use this README when you revise — it documents what you built, why it works, and what to try next.

---

## Patterns covered

| Pattern | Idea | Example here |
|---------|------|--------------|
| **Container Component** | Owns data fetching + prop injection; does not own UI markup | `CurrentUserLoader`, `UserLoader`, `ResourceLoader`, `DataSource` |
| **Presentational Component** | Owns how data looks; does not know where it came from | `UserInfo`, `BookInfo` |
| **Dev proxy** | Vite forwards API paths to Express so the browser stays same-origin | `vite.config.js` |

Shared theme: **separate data from presentation**.

- Container = when / how to load; which prop to inject
- Presentational = markup for one resource
- `server.js` = fake REST API
- `children` + `cloneElement` = inject data without hard-wiring one child type

Mix any container with any matching presentational child.

---

## Folder map

```
container-components/
├── server.js                          ← Express mock API (port 3000)
├── vite.config.js                     ← proxy /current-user, /users, … → :3000
├── package.json
└── src/
    ├── App.jsx                        ← all loader demos
    ├── main.jsx
    └── components/
        ├── current-user-loader.jsx    ← container: GET /current-user → injects `user`
        ├── user-loader.jsx            ← container: GET /users/:id → injects `user`
        ├── resource-loader.jsx        ← container: any URL + prop name
        ├── data-source.jsx            ← container: any getData() + prop name
        ├── user-info.jsx              ← presentational: user
        └── book-info.jsx              ← presentational: book
```

---

## What’s demoed in `App.jsx`

| # | Container | Fetches / loads | Content |
|---|-----------|-----------------|---------|
| 1 | `CurrentUserLoader` | `GET /current-user` | `UserInfo` |
| 2 | `UserLoader` | `GET /users/:userId` (ids 1, 2, 3) | `UserInfo` |
| 3 | `ResourceLoader` | `/users/2` + `/books/2` | `UserInfo` / `BookInfo` |
| 4 | `DataSource` | `getDataFromServer("/users/2")` | `UserInfo` |

---

## 1. `CurrentUserLoader` (container)

Fetches the “logged-in” user once on mount and injects it into every valid React child as a `user` prop.

### API

```jsx
<CurrentUserLoader>
  <UserInfo />
</CurrentUserLoader>
```

| Prop | Meaning |
|------|---------|
| `children` | One or more elements that expect a `user` prop |

### How it works

1. State: `const [user, setUser] = useState(null)` — starts as `null` (presentational shows Loading…)
2. `useEffect` on mount runs an async IIFE:
   - `axios.get("/current-user")`
   - `setUser(response.data)`
3. Render: walk `children` with `React.Children.map`
   - If the child is a valid element → `React.cloneElement(child, { user })`
   - Otherwise (text, etc.) → return as-is

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
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { user });
        }
        return child;
      })}
    </>
  );
};
```

### React helpers used here (short)

| API | What it is | Why the loader uses it |
|-----|------------|------------------------|
| **`React.Children`** | Utilities for working with the opaque `children` prop (one child, many children, or none) | `Children.map` walks every child safely, whether you passed one element or several |
| **`React.isValidElement`** | Returns `true` only if the value is a real React element (e.g. `<UserInfo />`) | Skips strings / numbers / `null` so you don’t call `cloneElement` on something that isn’t an element |
| **`React.cloneElement`** | Makes a copy of an element and merges in extra props | Injects `{ user }` into `<UserInfo />` without the loader importing or hard-coding that component |

In one line: **Children** = walk kids → **isValidElement** = “is this a component?” → **cloneElement** = “same child, plus `user`”.

The container does **not** import `UserInfo`. It only requires that children accept `user`, so you can swap the UI without changing the loader:

```jsx
<CurrentUserLoader>
  <UserInfo />
</CurrentUserLoader>

{/* later: same data path, different UI */}
<CurrentUserLoader>
  <SomeOtherUserCard />
</CurrentUserLoader>
```

### Request path

`axios.get("/current-user")` is a **relative** URL. Vite’s proxy (see below) forwards it to Express on port 3000. No hardcoded `http://localhost:3000` in the component.

---

## 2. `UserLoader` (container) — **new**

Same inject pattern as `CurrentUserLoader`, but parameterized by `userId`.

### API

```jsx
<UserLoader userId="2">
  <UserInfo />
</UserLoader>
```

| Prop | Meaning |
|------|---------|
| `userId` | Id passed to `GET /users/:userId` |
| `children` | Elements that expect a `user` prop |

Fetches on mount and whenever `userId` changes. Injects `{ user }` via `cloneElement`.

---

## 3. `ResourceLoader` (container) — **new**

Generic HTTP loader: any URL + any prop name.

### API

```jsx
<ResourceLoader resourceUrl="/users/2" resourceName="user">
  <UserInfo />
</ResourceLoader>

<ResourceLoader resourceUrl="/books/2" resourceName="book">
  <BookInfo />
</ResourceLoader>
```

| Prop | Meaning |
|------|---------|
| `resourceUrl` | Axios GET path (e.g. `/users/2`, `/books/2`) |
| `resourceName` | Prop name to inject (`"user"` → `{ user }`, `"book"` → `{ book }`) |
| `children` | Presentational component expecting that prop |

Uses `{ [resourceName]: resource }` in `cloneElement` — same trick as layout-component’s `sourceName`.

Still tied to axios/HTTP. One loader for users, books, or anything else.

---

## 4. `DataSource` (container) — **new**

Most flexible: you pass **how** to load, not **where**.

### API

```jsx
<DataSource
  getData={() => getDataFromServer("/users/2")}
  resourceName="user"
>
  <UserInfo />
</DataSource>
```

| Prop | Meaning |
|------|---------|
| `getData` | Async function that returns the resource (axios, localStorage, mock, …) |
| `resourceName` | Prop name to inject |
| `children` | Presentational component |

Container calls `await getData()` in `useEffect` and injects `{ [resourceName]: data }`. It does not know about URLs or axios.

### Container progression

```text
CurrentUserLoader  →  one fixed endpoint
UserLoader         →  one resource type, by id
ResourceLoader     →  any URL + prop name
DataSource         →  any data function + prop name
```

---

## 5. Presentational components

They only care about props. No `fetch`, no `axios`, no URL knowledge.

### `UserInfo`

```jsx
<UserInfo user={someUser} />
```

| Prop | Meaning |
|------|---------|
| `user` | `{ name, age, country, books: string[] }` — or falsy while loading |

Shows name, age, country, and a books list. If `user` is missing → **Loading...**.

### `BookInfo`

```jsx
<BookInfo book={someBook} />
```

| Prop | Meaning |
|------|---------|
| `book` | `{ name, price, title, pages }` — or falsy while loading |

Shows name, price, title (author in this dataset), and page count. If `book` is missing → **Loading...**.

### Why “Loading...” lives in the presentational layer

Both treat a missing prop as “not ready.” Containers mount children immediately with `user={null}` / `book={undefined}`; when the request finishes, a re-render with real data swaps Loading… for content. No extra loading branch required inside the container (unless you want error handling later).

---

## 6. Mock API (`server.js`)

In-memory Express server so containers practice real HTTP.

| Method | Path | Returns |
|--------|------|---------|
| `GET` | `/current-user` | Logged-in-style user |
| `GET` | `/users` | All users |
| `GET` | `/users/:id` | One user (`id`: `"1"` \| `"2"` \| `"3"`) |
| `POST` | `/users/:id` | Update a user from `req.body.user` |
| `GET` | `/books` | All books |
| `GET` | `/books/:id` | One book |

Default port: **3000**.

`currentUser` / `users` shape matches `UserInfo`; `books` matches `BookInfo`.

---

## 7. Vite proxy (`vite.config.js`)

Vite (e.g. `:5173`) and Express (`:3000`) are different origins. Without a proxy or CORS, browser requests to `/current-user` would hit Vite and 404.

This project uses a **dev proxy**:

```js
server: {
  proxy: {
    "/current-user": "http://localhost:3000",
    "/users": "http://localhost:3000",
    "/user": "http://localhost:3000",
    "/books": "http://localhost:3000",
    "/book": "http://localhost:3000",
  },
},
```

Flow:

```text
Browser → GET /current-user  (Vite)
       → Vite proxies to → http://localhost:3000/current-user  (Express)
       → JSON back to the container
```

Containers keep relative URLs. Both processes must be running.

---

## Mental model (revise this)

```
server.js              →  fake backend
vite proxy             →  same-origin paths during dev
CurrentUserLoader      →  fetch /current-user; inject `user`
UserLoader             →  fetch /users/:id; inject `user`
ResourceLoader         →  fetch any URL; inject [resourceName]
DataSource             →  call any getData(); inject [resourceName]
UserInfo / BookInfo    →  how one resource looks
Children.map + clone   →  inject props without importing a specific child
App.jsx                →  compose containers + presentational demos
```

You can freely recombine:

```text
CurrentUserLoader  + UserInfo
UserLoader(id)     + UserInfo
ResourceLoader     + UserInfo or BookInfo
DataSource         + UserInfo or BookInfo
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

You should briefly see **Loading...**, then all four demo sections with user/book data.

---

## Revise checklist

### CurrentUserLoader

- [x] Fetch `/current-user`, inject `user`
- [ ] Trace: `useEffect` → `axios.get` → `setUser` → `cloneElement` → `UserInfo`
- [ ] Optional: handle axios errors (try/catch + error UI)

### UserLoader — **new**

- [x] Fetch by `userId`, inject `user`
- [ ] Change `userId` in `App.jsx` and confirm data updates
- [ ] Optional: `BookLoader` as a dedicated wrapper (or keep using `ResourceLoader`)

### ResourceLoader — **new**

- [x] Load user and book by URL + `resourceName`
- [ ] Try `/users/1`, `/books/3` — prove one loader handles both types
- [ ] Trace `{ [resourceName]: resource }` until it clicks

### DataSource — **new**

- [x] Load via `getData()` function
- [ ] Swap `getData` to a non-HTTP source (e.g. `() => Promise.resolve({...})`)
- [ ] Watch `getData` in `useEffect` deps — inline arrow re-runs every render (use `useCallback` in parent if needed)

### Presentational

- [ ] Confirm falsy `user` / `book` shows **Loading...**
- [ ] Guard `books.map` if `books` can be missing

### Server & proxy

- [x] `id` fields on users and books
- [ ] Hit `GET http://localhost:3000/users/2` directly (curl / browser)
- [ ] Confirm relative URLs work only when Express is up

---

## Stack

- React + Vite
- axios (HTTP inside containers)
- express (mock API in `server.js`)
- Vite `server.proxy` (dev API forwarding)
- styled-components (available; not required for these pieces yet)
