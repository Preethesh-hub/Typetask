# TypeTasks — Type-Safe Task Tracker

A modern, high-precision task tracker built with **HTML**, **CSS**, and **TypeScript**. Powered by a strictly verified TypeScript data model ensuring zero runtime type errors.

🔗 **Live Deployment:** [https://preethesh-hub.github.io/Typetask/](https://preethesh-hub.github.io/Typetask/)  
💻 **Repository:** [https://github.com/Preethesh-hub/Typetask](https://github.com/Preethesh-hub/Typetask)

---

## 🎯 Architecture

The app is divided into a robust typed logic layer and a thin, responsive presentation layer:

```
Typetask/
├── model.ts          # Core typed model & pure functions
├── app.ts            # Typed DOM controller & event wiring
├── index.html        # Semantic HTML with live metrics dashboard
├── styles.css        # Luxury dark glassmorphism styling
├── model.js          # Compiled JavaScript (ES2020 modules)
├── app.js            # Compiled JavaScript (ES2020 modules)
└── tsconfig.json     # Strict TypeScript configuration
```

### 1. The Data Model (`model.ts`)
- **`TaskStatus`**: A strict literal union (`"todo" | "in-progress" | "done"`).
- **`Task`**: Explicit interface contract (`{ id: number; title: string; status: TaskStatus; }`).
- **Pure Operations**:
  - `addTask`: Immutable addition of new tasks starting at `"todo"`.
  - `advanceTask`: Lifecycle progression (`todo` ➔ `in-progress` ➔ `done`).
  - `completeTask`: Direct completion of tasks.
  - `deleteTask`: Pure removal by unique identifier.
  - `filterByStatus`: Type-safe filtering by `TaskStatus`.
  - `countByStatus` & `getTaskSummary`: Real-time aggregated statistics.
  - `clearCompleted`: Purges all `"done"` items.
  - `seedNextId`: Prevents ID collision after restoring from storage.

### 2. Typed DOM Layer (`app.ts`)
- Strict type assertions for element access (`HTMLInputElement`, `HTMLButtonElement`, etc.).
- Zero `any` types and no untyped state mutations.
- `localStorage` persistence with seed reconciliation.
- Interactive filter chips with reactive task count badges.
- Keyboard support (`Enter` to submit tasks).

### 3. Aesthetics & UI (`styles.css`)
- Modern luxury dark glassmorphism design with radiant accents.
- Responsive flexbox and grid layouts supporting desktop, tablet, and mobile.
- Custom status badges and animated micro-interactions.
- Accessible semantic HTML with ARIA attributes.

---

## 🛠 Compilation & Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Compile TypeScript with zero errors:**
   ```bash
   npm run build
   # or
   npx tsc
   ```

3. **Run locally:**
   Serve `index.html` with any static server:
   ```bash
   npx serve .
   ```

---

## 🚢 Deployment

Deployed to GitHub Pages from the repository:
- **Live URL:** [https://preethesh-hub.github.io/Typetask/](https://preethesh-hub.github.io/Typetask/)
