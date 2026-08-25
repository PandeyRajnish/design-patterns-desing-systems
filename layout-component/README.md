# Layout Component

Learning project for reusable React patterns: **Layout**, **List**, and **Modal** components.

Use this README when you revise — it documents what you built, why it works, and what to try next.

---

## Patterns covered

| Pattern | Idea | Example here |
|---------|------|--------------|
| **Layout Component** | Owns arrangement; does not own content | `SplitScreen` |
| **List Component** | Owns iteration + prop wiring; does not own row UI | `RegularList`, `NumberedList` |
| **Modal (Uncontrolled)** | Owns open/close + overlay chrome; does not own body content | `Modal` |

Shared theme: **separate structure from presentation**.

- Layout / list / modal = structure & behavior shell
- Item / children = presentation
- `data/*` = raw data

Mix any shell with any content.

---

## Folder map

```
src/
├── App.jsx                            ← all demos wired together
├── components/
│   ├── split-screen.jsx               ← Layout: two-panel flex
│   ├── Modal.jsx                      ← Overlay shell + show/hide state
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

| # | Component | Data | Content |
|---|-----------|------|---------|
| 1 | `SplitScreen` | — | Left / Right demo headings |
| 2 | `Modal` | `books[0]` | `LargeBookListItem` inside overlay |
| 3 | `RegularList` | authors | Small author |
| 4 | `NumberedList` | authors | Large author |
| 5 | `RegularList` | authors | Large author |
| 6 | `RegularList` | books | Small book |
| 7 | `NumberedList` | books | Large book |
| 8 | `RegularList` | books | Large book |

Same idea everywhere: shell owns structure; children own what you see.

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

## 2. `Modal` (layout / overlay)

Reusable overlay shell. It owns **visibility** and **chrome** (backdrop, panel, buttons). It does **not** own what appears inside — that is `children`.

### API

```jsx
<Modal>
  <LargeBookListItem book={books[0]} />
</Modal>
```

| Prop | Meaning |
|------|---------|
| `children` | Any React node shown inside the modal panel |

Demo in `App.jsx` passes an existing item component — no special modal-only UI required.

### How it works

1. Internal state: `const [show, setShow] = useState(false)`
2. Always render a **Show Modal** button
3. When `show` is true, render:
   - `ModalBackground` — full-area dimmed overlay; click closes
   - `ModalContent` — centered panel; click uses `stopPropagation` so it does not close
   - **Hide Modal** button + `{children}`

```jsx
export const Modal = ({ children }) => {
  const [show, setShow] = useState(false);

  return (
    <>
      <button onClick={() => setShow(true)}>Show Modal</button>
      {show && (
        <ModalBackground onClick={() => setShow(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShow(false)}>Hide Modal</button>
            {children}
          </ModalContent>
        </ModalBackground>
      )}
    </>
  );
};
```

### Styled pieces

| Piece | Role |
|-------|------|
| `ModalBackground` | Absolute full size, semi-transparent black, click-to-close |
| `ModalContent` | Wheat panel, ~50% width, padding, holds children |

### Why `stopPropagation` matters

Without it, a click inside the panel bubbles to `ModalBackground` and closes the modal immediately. Stopping propagation on `ModalContent` keeps the panel interactive while the backdrop still closes on outside click.

### Uncontrolled vs controlled (revise later)

| Style | Who owns `show`? | This project |
|-------|------------------|--------------|
| **Uncontrolled** | Modal’s own `useState` | Current |
| **Controlled** | Parent via `isOpen` / `onClose` props | Optional next step |

Current design is great for demos. Controlled is better when the parent must open the modal from elsewhere (e.g. a list row click).

### Reuse idea

Because content is just `children`, you can drop in anything:

```jsx
<Modal>
  <LargeAuthorListItem author={authors[0]} />
</Modal>

<Modal>
  <RegularList items={books} sourceName="book" ItemComponent={SmallBookListItem} />
</Modal>
```

Same shell, different bodies — same pattern as `SplitScreen` and the lists.

---

## 3. List components

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

## 4. Item components

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
Modal           →  overlay shell + open/close (uncontrolled)
RegularList     →  iterate, no numbers
NumberedList    →  iterate + show 1, 2, 3…
ItemComponent   →  how one row looks (Small / Large)
sourceName      →  which prop name the item expects
children        →  what Modal / SplitScreen display
data/*.js       →  the raw arrays
```

You can freely recombine:

```text
Modal        + LargeBookListItem
NumberedList + books + SmallBookListItem
RegularList  + authors + LargeAuthorListItem
SplitScreen  + any lists inside each panel
Modal        + RegularList inside the panel
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

### Modal

- [ ] Open / close via buttons; confirm backdrop click closes
- [ ] Click inside the panel — should stay open (`stopPropagation`)
- [ ] Swap children to `LargeAuthorListItem` or a list — prove content is reusable
- [ ] Try `position: fixed` on the backdrop (vs `absolute`) if scroll/cover feels wrong
- [ ] Optional: controlled API — `isOpen` + `onClose` from the parent
- [ ] Optional: close on `Escape`; trap focus inside the panel
- [ ] Optional: render via a portal (`createPortal`) to avoid stacking-context bugs

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
- [ ] Compound components for tabs or accordions

---

## Stack

- React + Vite
- styled-components (used by `SplitScreen` and `Modal`)
