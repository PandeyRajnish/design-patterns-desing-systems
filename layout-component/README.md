# Layout Component

Learning project for the **Layout Component** pattern: reusable wrappers that own structure and spacing, while content stays in the parent.

---

## Pattern idea (revise later)

A layout component:

- Controls **how** things are arranged (rows, columns, ratios)
- Does **not** care about the content itself
- Accepts children (or component props) and places them in slots

Benefit: the same layout can wrap any UI without rewriting flex/grid each time.

---

## What’s in this project

| File                              | Role                                      |
| --------------------------------- | ----------------------------------------- |
| `src/components/split-screen.jsx` | Reusable two-panel layout                 |
| `src/App.jsx`                     | Demo usage with sample left/right content |

---

## `SplitScreen`

Two-panel horizontal layout using flexbox + `styled-components`.

### API

```jsx
<SplitScreen leftWidth={1} rightWidth={3}>
  <LeftContent />
  <RightContent />
</SplitScreen>
```

| Prop         | Default  | Meaning                                   |
| ------------ | -------- | ----------------------------------------- |
| `children`   | required | Exactly **two** children: `[left, right]` |
| `leftWidth`  | `1`      | Flex grow for the left panel              |
| `rightWidth` | `1`      | Flex grow for the right panel             |

Widths are **ratios**, not pixels.  
`leftWidth={1}` + `rightWidth={3}` → left takes ~25%, right ~75%.

### How it works

1. Destructure the first two children: `const [left, right] = children`
2. Wrap each in a `Panel` with `flex: leftWidth` / `flex: rightWidth`
3. Parent `Container` is `display: flex`

```jsx
export const SplitScreen = ({ children, leftWidth = 1, rightWidth = 1 }) => {
  const [left, right] = children;
  return (
    <Container>
      <Panel flex={leftWidth}>{left}</Panel>
      <Panel flex={rightWidth}>{right}</Panel>
    </Container>
  );
};
```

### Styled pieces

- `Container` — flex row
- `Panel` — `flex: ${(props) => props.flex}` so each side scales by ratio

---

## How `App.jsx` uses it

Demo content is defined as small components, then passed as children:

```jsx
<SplitScreen leftWidth={1} rightWidth={3}>
  <LeftSideComp title="Left!" />
  <RightSideComp title="Right!" />
</SplitScreen>
```

Notes for revision:

- Content components (`LeftSideComp`, `RightSideComp`) know nothing about the layout
- Layout (`SplitScreen`) knows nothing about the titles/colors
- Props like `title` stay on the content; layout only receives width ratios

---

## Design choices to remember

### Children API (current)

```jsx
<SplitScreen>
  <A />
  <B />
</SplitScreen>
```

Pros: natural JSX, easy to pass props into `A` / `B`.  
Cons: assumes exactly two children; order matters.

### Alternative: component props (not used here)

```jsx
<SplitScreen left={Left} right={Right} />
```

Pros: named slots, clearer intent.  
Cons: harder to pass props unless you use `left={<Left title="..." />}` or render-prop style.

When revising, compare both and pick what feels clearer for your use case.

---

## Run

From the **repo root**:

```bash
npm run dev:layout
```

From this folder:

```bash
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

---

## Quick revise checklist

- [ ] Re-read why layout and content are separated
- [ ] Change `leftWidth` / `rightWidth` and watch the ratio change
- [ ] Swap the two children — confirm order = left/right
- [ ] Try a third child — note that only the first two are used today
- [ ] Optional: refactor to `left` / `right` props and compare DX
- [ ] Optional: add more layout variants (stack, sidebar, grid) in `src/components/`

---

## Stack

- React + Vite
- styled-components
