# Design Patterns & Design Systems

A learning monorepo — **one folder = one React design pattern project**.

## Stack

- React + Vite
- styled-components
- npm workspaces (run everything from the repo root)

## Projects

| Project | Pattern | Run from root |
|---------|---------|---------------|
| [layout-component](./layout-component) | Layout Components | `npm run dev:layout` |

---

## First-time setup

Open a terminal at the **repo root**:

```bash
cd /home/costrategix/Desktop/projects/design-patterns-desing-systems
npm install
```

This installs dependencies for all workspace projects.

---

## How to run a project

### Option A — from the repo root (recommended)

```bash
npm run dev:layout
```

Then open the URL Vite prints (usually http://localhost:5173).

### Option B — from inside the project folder

```bash
cd layout-component
npm run dev
```

### Useful commands

| Task | Command |
|------|---------|
| Install all projects | `npm install` (from root) |
| Run layout project | `npm run dev:layout` |
| Build layout project | `npm run build:layout` |
| Lint layout project | `npm run lint:layout` |
| Stop the server | `Ctrl + C` |

You can run multiple projects at once. Vite will pick the next free port (5173, 5174, …).

---

## Root vs project — where to work

**One-line rule:** pattern/UI code → inside the project folder. Repo setup, new projects, and git → always at the root.

| You want to… | Work in |
|--------------|---------|
| Edit components, `App.jsx`, CSS | Project folder (e.g. `layout-component/`) |
| Install a library for one pattern only | Project folder |
| Create a new pattern project | Root |
| Update `workspaces` / `dev:*` scripts | Root `package.json` |
| Update this guide / projects table | Root `README.md` |
| `git add` / `git commit` / `git push` | **Always root** |

Do **not** run `git init` inside a project folder. There is only one git repo: the root.

```
ROOT     = house keys, map, git, “which projects exist”
PROJECT  = the room itself (components, styles, app code)
```

---

## How to commit and push (always from root)

Git lives at the **repo root**, not inside `layout-component` or any other project.

### 1. Go to the root

```bash
cd /home/costrategix/Desktop/projects/design-patterns-desing-systems
```

### 2. Check what changed

```bash
git status
```

### 3. Stage files

Stage everything:

```bash
git add .
```

Or stage specific paths:

```bash
git add README.md package.json layout-component/
```

### 4. Commit

```bash
git commit -m "Short message describing why you changed things"
```

Examples:

```bash
git commit -m "Add layout-component SplitScreen example"
git commit -m "Add compound-component project to workspaces"
git commit -m "Update README with run and commit steps"
```

### 5. Push to GitHub

```bash
git push origin main
```

### Commit checklist

- [ ] You are in the **repo root** (not inside a project folder)
- [ ] `git status` looks correct
- [ ] `git add` the files you want
- [ ] `git commit -m "..."` with a clear message
- [ ] `git push origin main`

### Common mistakes to avoid

| Don’t | Do instead |
|-------|------------|
| `cd layout-component` then commit | Commit from the root |
| Create a new `.git` inside a project | Use the root git repo only |
| Commit `node_modules` | Already ignored via `.gitignore` |

---

## How to add a new project (step by step)

Use this checklist every time. Replace `compound-component` with your pattern name.

### 1. Go to the repo root

```bash
cd /home/costrategix/Desktop/projects/design-patterns-desing-systems
```

### 2. Create a new Vite + React app

```bash
npm create vite@latest compound-component -- --template react
```

### 3. Install that project's dependencies

```bash
cd compound-component
npm install
npm install styled-components
```

### 4. Register the project in the root `package.json`

Open the **root** `package.json` and:

1. Add the folder name to `workspaces`
2. Add matching scripts

Example after adding `compound-component`:

```json
{
  "name": "design-patterns-design-systems",
  "private": true,
  "workspaces": [
    "layout-component",
    "compound-component"
  ],
  "scripts": {
    "dev:layout": "npm run dev -w layout-component",
    "build:layout": "npm run build -w layout-component",
    "lint:layout": "npm run lint -w layout-component",

    "dev:compound": "npm run dev -w compound-component",
    "build:compound": "npm run build -w compound-component",
    "lint:compound": "npm run lint -w compound-component"
  }
}
```

Script naming tip:

- Folder: `compound-component`
- Scripts: `dev:compound`, `build:compound`, `lint:compound`

### 5. Reinstall from the root (links the workspace)

```bash
cd /home/costrategix/Desktop/projects/design-patterns-desing-systems
npm install
```

### 6. Update this README projects table

Add a new row, for example:

| Project | Pattern | Run from root |
|---------|---------|---------------|
| layout-component | Layout Components | `npm run dev:layout` |
| compound-component | Compound Components | `npm run dev:compound` |

### 7. Run the new project

```bash
npm run dev:compound
```

---

## Quick checklist (copy/paste later)

### Add a project

- [ ] `npm create vite@latest <name> -- --template react`
- [ ] `cd <name> && npm install`
- [ ] `npm install styled-components` (optional, keep stack consistent)
- [ ] Add `<name>` to root `package.json` → `workspaces`
- [ ] Add `dev:<short>`, `build:<short>`, `lint:<short>` scripts
- [ ] Run `npm install` from root
- [ ] Add the project to the **Projects** table in this README
- [ ] Run with `npm run dev:<short>`

### Commit and push (from root)

- [ ] `cd` to repo root
- [ ] `git status`
- [ ] `git add .`
- [ ] `git commit -m "your message"`
- [ ] `git push origin main`

---

## Folder structure

```
design-patterns-desing-systems/     ← repo root (git + workspaces)
├── package.json                    ← workspaces + run scripts
├── package-lock.json
├── README.md                       ← this file
├── .gitignore
├── layout-component/               ← project 1
└── compound-component/             ← project 2 (example)
```

Each project is independent and has its own `package.json`, `src/`, and Vite config.
