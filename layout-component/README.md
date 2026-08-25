# Layout Component

Learning project for reusable React patterns: **Layout Components** and **List Components**.

Use this README when you revise — it documents what you built, why, and what to try next.

---

## Patterns covered

| Pattern | Idea | Example here |
|---------|------|--------------|
| **Layout Component** | Owns arrangement (flex/ratios); does not own content | `SplitScreen` |
| **List Component** | Owns iteration + prop wiring; does not own how each row looks | `RegularList` |

Shared theme: **separate structure from presentation**. Layout/list = structure. Item/content components = presentation.

---

## Folder map

```
src/
├── App.jsx                          ← demos both patterns
├── components/
│   ├── split-screen.jsx             ← Layout: two-panel flex
│   ├── lists/
│   │   └── Regular.jsx              ← List: map items → ItemComponent
│   ├── authors/
│   │   ├── SmallListItems.jsx       ← compact author row
│   │   └── LargeListItems.jsx       ← detailed author block
│   └── books/
│       ├── SmallListItems.jsx       ← (stub — not wired yet)
│       └── LargeListItems.jsx       ← (stub — not wired yet)
└── data/
    ├── authors.js                   ← author seed data
    └── books.js                     ← book seed data
```

---

## 1. `SplitScreen` (layout)

Two-panel horizontal layout via flex + `styled-components`.

### API

```jsx
<SplitScreen leftWidth={1} rightWidth={3}>
  <LeftSideComp title="Left!" />
  <RightSideComp title="Right!" />
</SplitScreen>
```

| Prop | Default | Meaning |
|------|---------|---------|
| `children` | required | Exactly **two** children: `[left, right]` |
| `leftWidth` | `1` | Flex grow (ratio) for left |
| `rightWidth` | `1` | Flex grow (ratio) for right |

`1` + `3` → left ~25%, right ~75%. Ratios, not pixels.

### How it works

```jsx
const [left, right] = children;
// Panel flex={leftWidth} | Panel flex={rightWidth}
```

Content components never import layout styles. Layout never knows about titles/colors.

---

## 2. `RegularList` (list)

Generic list: you pass **data**, a **prop name**, and an **item component**. The list maps and injects each item under that prop name.

### API

```jsx
<RegularList
  items={authors}
  sourceName="author"
  ItemComponent={SmallAuthorListItem}
/>
```

| Prop | Meaning |
|------|---------|
| `items` | Array of data objects |
| `sourceName` | Prop name each item receives (e.g. `"author"` → `{ author: item }`) |
| `ItemComponent` | Component that renders one row |

### How it works (important)

```jsx
{items.map((item, i) => (
  <ItemComponent key={i} {...{ [sourceName]: item }} />
))}
```

`{ [sourceName]: item }` is a **computed property name**. If `sourceName="author"`, each child gets `author={item}`.

That is why item components look like:

```jsx
export const SmallAuthorListItem = ({ author }) => { ... }
export const LargeAuthorListItem = ({ author }) => { ... }
```

Same list, different `ItemComponent` → small vs large UI without changing the list.

### Demo in `App.jsx`

```jsx
<RegularList items={authors} sourceName="author" ItemComponent={SmallAuthorListItem} />
<RegularList items={authors} sourceName="author" ItemComponent={LargeAuthorListItem} />
```

Same `authors` data, two densities.

---

## 3. Item components & data

### Authors (implemented)

| Component | Shows |
|-----------|--------|
| `SmallAuthorListItem` | name, age |
| `LargeAuthorListItem` | name, age, country, books list |

Data shape (`data/authors.js`):

```js
{ name, age, country, books: string[] }
```

### Books (prepared, not used in App yet)

| File | Status |
|------|--------|
| `data/books.js` | Seed data present |
| `books/SmallListItems.jsx` | Empty stub |
| `books/LargeListItems.jsx` | Empty stub |

Next step when revising: mirror the author pattern with `sourceName="book"` and wire them in `App.jsx`.

---

## Why this design (revise notes)

1. **List does not know authors vs books** — only `items` + `sourceName` + `ItemComponent`.
2. **Item does not know it is in a list** — it only expects one prop (`author` / later `book`).
3. **Small vs Large** swap is one prop change, not a rewrite of the map.
4. **Layout (`SplitScreen`) and list (`RegularList`) are independent** — you can nest lists inside panels later if you want.

### Mental model

```
RegularList          →  how many / how to pass data
ItemComponent        →  how one item looks
data/*.js            →  what the data is
SplitScreen          →  how regions are sized (separate concern)
```

---

## Run

From repo root:

```bash
npm run dev:layout
```

From this folder:

```bash
npm run dev
```

Usually http://localhost:5173.

---

## Revise checklist

### SplitScreen

- [ ] Change `leftWidth` / `rightWidth` and confirm ratios
- [ ] Swap the two children — order = left/right
- [ ] Optional: try `left` / `right` props instead of children

### RegularList

- [ ] Switch `ItemComponent` between Small and Large — same data, different UI
- [ ] Trace `{ [sourceName]: item }` until it clicks
- [ ] Implement `SmallBookListItem` / `LargeBookListItem`
- [ ] Add a books `RegularList` in `App.jsx` with `sourceName="book"`
- [ ] Optional: put a `RegularList` inside a `SplitScreen` panel
- [ ] Optional: prefer stable keys (`item.name`) over index `i`

---

## Stack

- React + Vite
- styled-components (used by `SplitScreen`)
