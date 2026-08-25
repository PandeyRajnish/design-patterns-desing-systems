# Container Components

Learning project for the **Container / Presentational** pattern in React.

Use this README when you revise — it documents what you built, why it works, and what to try next.

---

## Which pattern should I use? (real project guide)

Use this when you hit a data/UI problem at work. Start at the top and stop at the first match.

### Quick decision tree

```text
Need to arrange UI only (split panels, lists, modal shell)?
  → layout-component patterns (SplitScreen / List / Modal) — not this folder

Need to load data and show UI?
  │
  ├─ Same endpoint everywhere (e.g. “current user” / session)?
  │    → CurrentUserLoader
  │
  ├─ Same resource type, different ids (user/1, user/2…)?
  │    → UserLoader (or BookLoader-style dedicated loader)
  │
  ├─ Many REST URLs, same “GET + inject prop” shape?
  │    → ResourceLoader
  │
  ├─ Source is not always HTTP (API + localStorage + GraphQL + mock)?
  │    │
  │    ├─ Child is a normal component; prop name is fixed → DataSource
  │    └─ Need custom JSX / multiple children / conditionals → DataSourceWithRender
  │
  └─ Team already uses React Query / SWR / Redux Toolkit Query?
       → Prefer those for server state in production; keep presentational components
```

### Pattern → when (company-style scenarios)

| Use this | When (real product situations) | Avoid when |
|----------|--------------------------------|------------|
| **Presentational** (`UserInfo`, `BookInfo`, `Message`) | Design system cards, storybook, same UI in admin + mobile web, A/B UI swap | It starts calling APIs itself |
| **`CurrentUserLoader`** | Navbar avatar, “me” page, permissions gate, billing “signed-in as” | You need arbitrary user ids (use `UserLoader`) |
| **`UserLoader`** | Profile by route id (`/users/:id`), team member drawer, support “impersonate user” | Many resource types share one loader shape (use `ResourceLoader`) |
| **`ResourceLoader`** | CRUD screens that only differ by URL + prop (`/orders/5`, `/books/2`) | Non-HTTP sources or complex fetch (auth headers, retries, cache) |
| **`DataSource`** | Feature needs **swappable sources**: REST today, localStorage draft tomorrow, MSW in tests | You need fine-grained control of markup while loading/error (prefer render props or hooks) |
| **`DataSourceWithRender`** | Dashboard widgets, “if null show empty state else detail”, compose 2+ components from one fetch | Simple one-child cases where `DataSource` + `resourceName` is enough |
| **localStorage via `getData`** | Theme preference, “don’t show again”, draft forms, offline banner copy | Large datasets or secrets (use a proper store / backend) |

### How companies usually evolve this

What you built here is the classic teaching path. In larger codebases it often becomes:

| Stage | What teams do | Maps to this repo |
|-------|---------------|-------------------|
| 1 | Dedicated loaders per feature | `CurrentUserLoader`, `UserLoader` |
| 2 | Generic HTTP loader | `ResourceLoader` |
| 3 | Inject `getData` / adapters | `DataSource` |
| 4 | Render props or hooks for flexibility | `DataSourceWithRender` → later `useUser()`, `useQuery()` |
| 5 | Shared server-state library | React Query / SWR / RTK Query (production default) |

**Practical rule for interviews / code reviews:**

- Keep **UI dumb** (presentational) always — that stays valuable.
- Prefer **one clear loader** early; go generic only when you copy-paste the third similar loader.
- Prefer **hooks** (`useCurrentUser`) over `cloneElement` containers in new greenfield apps — same separation, clearer data flow.
- Prefer **React Query / SWR** when you need cache, retries, stale-while-revalidate, shared fetches across pages.
- Still use **container-style wrappers** for auth gates, layout shells that must wait on session, or when teaching / migrating legacy class code.

### Cheat sheet (one line each)

| Pattern | One-liner |
|---------|-----------|
| `CurrentUserLoader` | “Always the logged-in user.” |
| `UserLoader` | “This user id from the URL.” |
| `ResourceLoader` | “Any REST GET → any prop name.” |
| `DataSource` | “Any function → inject a named prop.” |
| `DataSourceWithRender` | “Any function → you decide the JSX.” |
| Presentational | “Just render props — no fetching.” |

### With layout-component (same monorepo)

| Need | Project / pattern |
|------|-------------------|
| How it looks / is arranged | `layout-component` → `SplitScreen`, lists, `Modal` |
| Where data comes from | `container-components` → loaders / `DataSource` |
| Both | Compose: e.g. `Modal` + `UserLoader` + `UserInfo`, or `SplitScreen` with a loader in each panel |

---

## Patterns covered

| Pattern | Idea | Example here |
|---------|------|--------------|
| **Container Component** | Owns data fetching + prop injection; does not own UI markup | `CurrentUserLoader`, `UserLoader`, `ResourceLoader`, `DataSource` |
| **Render Props** | Parent passes a `render(data)` function; container calls it with loaded data | `DataSourceWithRender` |
| **Presentational Component** | Owns how data looks; does not know where it came from | `UserInfo`, `BookInfo` |
| **Dev proxy** | Vite forwards API paths to Express so the browser stays same-origin | `vite.config.js` |

Shared theme: **separate data from presentation**.

- Container = when / how to load; which prop to inject
- Presentational = markup for one resource
- `server.js` = fake REST API
- `children` + `cloneElement` = inject data without hard-wiring one child type
- `render(resource)` = same idea as cloneElement, but you wire props yourself in a function
- `getData` = swap the *source* (axios, fetch, localStorage) without changing the container

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
        ├── data-source.jsx            ← container: any getData() + prop name (cloneElement)
        ├── data-source-with-render.jsx← container: any getData() + render prop
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
| 4 | `DataSource` | `getDataFromServer("/users/2")` (axios) | `UserInfo` via children |
| 5 | `DataSourceWithRender` | `fetchData("/users/2")` (fetch) | `UserInfo` via `render` |
| 6 | `DataSource` | `getDataFromLocalStorage("test")` | `Message` (`msg` prop) |

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

In `App.jsx`, `getDataFromServer` uses **axios**.

### Same container, non-HTTP source (localStorage) — **new**

`DataSource` does not care *where* data comes from. The second demo in `App.jsx` proves that with **localStorage**:

```jsx
const getDataFromLocalStorage = (key) => {
  return localStorage.getItem(key);
};

const Message = ({ msg }) => <h1>{msg}</h1>;

<DataSource
  getData={() => getDataFromLocalStorage("test")}
  resourceName="msg"
>
  <Message />
</DataSource>
```

| Piece | Role |
|-------|------|
| `getDataFromLocalStorage("test")` | Reads `localStorage` key `"test"` (sync is fine — container still `await`s it) |
| `resourceName="msg"` | Injects `{ msg: "…" }` into the child |
| `Message` | Tiny presentational component — only displays `msg` |

**Why this matters:** one container (`DataSource`) can feed:

| `getData` | `resourceName` | Child |
|-----------|----------------|-------|
| axios → `/users/2` | `"user"` | `UserInfo` |
| `localStorage.getItem("test")` | `"msg"` | `Message` |

Same inject pattern (`cloneElement`). No server required for this demo — but you must set the key first (e.g. in DevTools: `localStorage.setItem("test", "Hello from localStorage")`). If the key is missing, `msg` is `null` and `Message` renders an empty heading.

---

## 5. `DataSourceWithRender` (container + render props) — **new**

Same data-loading idea as `DataSource`, but instead of `children` + `cloneElement`, the parent passes a **`render` function**. The container loads data, then calls `render(resource)`.

### Why render props?

| Approach | How UI gets data | Who maps prop names |
|----------|------------------|---------------------|
| `DataSource` | `children` + `cloneElement({ [resourceName]: data })` | Container (needs `resourceName`) |
| `DataSourceWithRender` | `render(resource)` returns JSX | Parent (you write `user={resource}` yourself) |

No `Children` / `isValidElement` / `cloneElement`. More explicit; easier when one resource drives custom JSX (multiple components, conditionals, etc.).

### API

```jsx
<DataSourceWithRender
  getData={() => fetchData("/users/2")}
  render={(resource) => <UserInfo user={resource} />}
/>
```

| Prop | Meaning |
|------|---------|
| `getData` | Async function that returns the resource |
| `render` | `(resource) => ReactNode` — called with loaded data (or `null` while loading) |

### How it works

```jsx
export const DataSourceWithRender = ({ getData = () => {}, render }) => {
  const [resource, setResource] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await getData();
      setResource(data);
    })();
  }, [getData]);

  return render(resource);
};
```

1. Same fetch loop as `DataSource` (`useEffect` + `getData`)
2. Return value is whatever `render(resource)` returns
3. While `resource` is `null`, `UserInfo` still shows **Loading...** (because you pass `user={null}`)

### `DataSource` vs `DataSourceWithRender`

```jsx
{/* cloneElement — container picks the prop name */}
<DataSource getData={...} resourceName="user">
  <UserInfo />
</DataSource>

{/* render prop — you pick the prop name in the function */}
<DataSourceWithRender
  getData={...}
  render={(resource) => <UserInfo user={resource} />}
/>
```

In `App.jsx`, this demo uses **`fetch`** (`fetchData`) instead of axios — proves `getData` can be any async source.

### Container progression

```text
CurrentUserLoader       →  one fixed endpoint
UserLoader              →  one resource type, by id
ResourceLoader          →  any URL + prop name
DataSource              →  any getData() + children / cloneElement
                         (axios, fetch-shaped helpers, localStorage, …)
DataSourceWithRender    →  any getData() + render(resource)
```

### `getData` helpers in `App.jsx`

| Helper | Source | Used by |
|--------|--------|---------|
| `getDataFromServer(url)` | axios | `DataSource` → `UserInfo` |
| `fetchData(url)` | `fetch` | `DataSourceWithRender` → `UserInfo` |
| `getDataFromLocalStorage(key)` | `localStorage` | `DataSource` → `Message` |

All three plug into the same container idea: **pass a function, get data back**.

---

## 6. Presentational components

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

### `Message` (App.jsx helper) — **new**

```jsx
const Message = ({ msg }) => <h1>{msg}</h1>;
```

| Prop | Meaning |
|------|---------|
| `msg` | String from localStorage (via `DataSource` + `resourceName="msg"`) |

Not a separate file — lives in `App.jsx` to show that **any** presentational child works with `DataSource`, not only `UserInfo` / `BookInfo`.

### Why “Loading...” lives in the presentational layer

Both treat a missing prop as “not ready.” Containers mount children immediately with `user={null}` / `book={undefined}`; when the request finishes, a re-render with real data swaps Loading… for content. No extra loading branch required inside the container (unless you want error handling later).

---

## 7. Mock API (`server.js`)

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

## 8. Vite proxy (`vite.config.js`)

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
server.js                 →  fake backend
vite proxy                →  same-origin paths during dev
CurrentUserLoader         →  fetch /current-user; inject `user`
UserLoader                →  fetch /users/:id; inject `user`
ResourceLoader            →  fetch any URL; inject [resourceName]
DataSource                →  getData() + cloneElement([resourceName])
                             (HTTP *or* localStorage — same container)
DataSourceWithRender      →  getData() + render(resource)
UserInfo / BookInfo       →  how one resource looks
Message                   →  tiny presentational demo for localStorage `msg`
Children.map + clone      →  inject props without importing a specific child
render(resource)          →  parent wires props explicitly
App.jsx                   →  compose containers + presentational demos
```

You can freely recombine:

```text
CurrentUserLoader        + UserInfo
UserLoader(id)           + UserInfo
ResourceLoader           + UserInfo or BookInfo
DataSource               + UserInfo or BookInfo or Message
DataSourceWithRender     + any JSX via render(...)
Same UserInfo            + different containers / patterns
getData                  + axios | fetch | localStorage | anything
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

You should briefly see **Loading...**, then all six demo sections (HTTP users/books + localStorage message if the key is set).

**localStorage tip:** before the last demo shows text, run in the browser console:

```js
localStorage.setItem("test", "Hello from localStorage");
```

Then refresh.

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

### DataSource

- [x] Load via `getData()` function (axios in App)
- [x] Non-HTTP source: `localStorage` → `Message` with `resourceName="msg"`
- [ ] Try another key / JSON (`JSON.parse(localStorage.getItem(...))`) if you store objects
- [ ] Watch `getData` in `useEffect` deps — inline arrow re-runs every render (use `useCallback` in parent if needed)

### DataSourceWithRender — **new**

- [x] Load via `getData` + `render(resource)` (fetch in App)
- [ ] Compare side-by-side with `DataSource` — same data, different wiring
- [ ] Try richer render: e.g. `render={(r) => r ? <UserInfo user={r} /> : <p>…</p>}`
- [ ] Optional: rename prop to `children` as a function (`children(resource)`) — same pattern
- [ ] Optional: point `getData` at localStorage too (prove render props work offline)

### Presentational

- [ ] Confirm falsy `user` / `book` shows **Loading...**
- [ ] Guard `books.map` if `books` can be missing
- [ ] Confirm `Message` shows after `localStorage.setItem("test", "…")`

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
