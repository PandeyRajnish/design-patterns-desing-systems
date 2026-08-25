# Layout Component

Learning project for reusable React patterns: **Layout Components** and **List Components**.

Use this README when you revise — it documents what you built, why it works, and what to try next.

---

## Patterns covered

| Pattern              | Idea                                              | Example here                  |
| -------------------- | ------------------------------------------------- | ----------------------------- |
| **Layout Component** | Owns arrangement; does not own content            | `SplitScreen`                 |
| **List Component**   | Owns iteration + prop wiring; does not own row UI | `RegularList`, `NumberedList` |

Shared theme: **separate structure from presentation**.

- Layout / list = structure
- Item components = presentation
- `data/*` = raw data

Mix any list style with any item style and any dataset.

---

## Folder map

```
src/
├── App.jsx                            ← all demos wired together
├── components/
│   ├── split-screen.jsx               ← Layout: two-panel flex
│   ├── lists/
│   │   ├── Regular.jsx                ← plain mapped list
│   │   └── Numbered.jsx               ← same API + index heading
│   ├── authors/
│   │   ├── SmallListItems.jsx         ← compact author row
│   │   └── LargeListItems.jsx         ← detailed author block
│   └── books/
│       ├── SmallListItems.jsx         ← compact book row
│       └── LargeListItems.jsx         ← detailed book block
└── data/
    ├── authors.js
    └── books.js
```

---

## What’s demoed in `App.jsx`

| #   | Component      | Data    | Item UI                    |
| --- | -------------- | ------- | -------------------------- |
| 1   | `SplitScreen`  | —       | Left / Right demo headings |
| 2   | `RegularList`  | authors | Small author               |
| 3   | `NumberedList` | authors | Large author               |
| 4   | `RegularList`  | authors | Large author               |
| 5   | `RegularList`  | books   | Small book                 |
| 6   | `NumberedList` | books   | Large book                 |
| 7   | `RegularList`  | books   | Large book                 |

Same lists, different data and item components — that is the whole point.

---

## 1. `SplitScreen` (layout)

Two-panel horizontal layout via flex + `styled-components`.

```jsx
<SplitScreen leftWidth={1} rightWidth={3}>
  <LeftSideComp title="Left!" />
  <RightSideComp title="Right!" />
</SplitScreen>
```

| Prop         | Default  | Meaning                                   |
| ------------ | -------- | ----------------------------------------- |
| `children`   | required | Exactly **two** children: `[left, right]` |
| `leftWidth`  | `1`      | Flex grow (ratio) for left                |
| `rightWidth` | `1`      | Flex grow (ratio) for right               |

`1` + `3` → left ~25%, right ~75%. Ratios, not pixels.

```jsx
const [left, right] = children;
// Panel flex={leftWidth} | Panel flex={rightWidth}
```

---

## 2. List components

Both lists share the **same API**:

```jsx
<RegularList
  items={authors}
  sourceName="author"
  ItemComponent={SmallAuthorListItem}
/>

<NumberedList
  items={books}
  sourceName="book"
  ItemComponent={LargeBookListItem}
/>
```

| Prop            | Meaning                                               |
| --------------- | ----------------------------------------------------- |
| `items`         | Array of data objects                                 |
| `sourceName`    | Prop name each item receives (`"author"` or `"book"`) |
| `ItemComponent` | Component that renders one row                        |

### `RegularList`

Maps items → `ItemComponent` only.

```jsx
{
  items.map((item, i) => <ItemComponent key={i} {...{ [sourceName]: item }} />);
}
```

### `NumberedList`

Same wiring, plus a visible index (`i + 1`) above each item.

```jsx
{
  items.map((item, i) => (
    <>
      <h3>{i + 1}</h3>
      <ItemComponent key={i} {...{ [sourceName]: item }} />
    </>
  ));
}
```

Difference to remember: **list style** (plain vs numbered) is independent of **item style** (small vs large) and **data type** (authors vs books).

### The `sourceName` trick

```js
{ ...{ [sourceName]: item } }
```

Computed property name. If `sourceName="author"`, each child gets `author={item}`. If `"book"`, each child gets `book={item}`.

That is why item components declare:

```jsx
({ author }) => { ... }   // authors
({ book }) => { ... }     // books
```

---

## 3. Item components

### Authors (`sourceName="author"`)

| Component             | Shows                          |
| --------------------- | ------------------------------ |
| `SmallAuthorListItem` | name, age                      |
| `LargeAuthorListItem` | name, age, country, books list |

Data shape (`data/authors.js`):

```js
{ name, age, country, books: string[] }
```

### Books (`sourceName="book"`)

| Component           | Shows                              |
| ------------------- | ---------------------------------- |
| `SmallBookListItem` | name / price                       |
| `LargeBookListItem` | name, price, title (author), pages |

Data shape (`data/books.js`):

```js
{
  (name, pages, title, price);
}
```

Note: in this dataset, `title` is used as the author name (e.g. `"Harper Lee"`). Worth cleaning up when you revise.

---

## Mental model (revise this)

```
SplitScreen     →  how regions are sized
RegularList     →  iterate, no numbers
NumberedList    →  iterate + show 1, 2, 3…
ItemComponent   →  how one row looks (Small / Large)
sourceName      →  which prop name the item expects
data/*.js       →  the raw arrays
```

You can freely recombine:

```text
NumberedList + books + SmallBookListItem
RegularList  + authors + LargeAuthorListItem
SplitScreen  + any lists inside each panel
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

### Layout

- [ ] Change `leftWidth` / `rightWidth` and confirm ratios
- [ ] Nest a `RegularList` or `NumberedList` inside a `SplitScreen` panel

### Lists

- [ ] Swap `RegularList` ↔ `NumberedList` without changing item components
- [ ] Trace `{ [sourceName]: item }` until it clicks
- [ ] Fix `NumberedList` fragment key warning (put `key` on the outer fragment / wrapper)
- [ ] Prefer stable keys (`item.name`) over index when data allows

### Data & items

- [ ] Diversify `books.js` entries (they are currently duplicates)
- [ ] Rename book fields if `title` vs author feels confusing
- [ ] Add a third density (e.g. medium) and plug it into either list

### Optional next patterns

- [ ] Extract a shared base list and pass `renderItem` / children
- [ ] Modal / overlay layout component
- [ ] Compound components for tabs or accordions

---

## Stack

- React + Vite
- styled-components (used by `SplitScreen`)
