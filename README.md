# TypeTasks — Part 1: Model & Types

A type-safe task tracker data model built with TypeScript.

## 🎯 Overview
In TypeTasks, the application data is strictly modeled using TypeScript interfaces and literal union types to prevent invalid states before the application even runs.

## 🧱 The Data Model

### `TaskStatus` Literal Union
A task's status is strictly restricted to one of three exact strings:
```typescript
type TaskStatus = "todo" | "in-progress" | "done";
```

### `Task` Interface
The contract for every task object:
```typescript
interface Task {
  id: number;
  title: string;
  status: TaskStatus;
}
```

## 🛠 Typed Operations

### Core Operations:
- `addTask(tasks: Task[], title: string): Task[]`: Appends a new task starting in `"todo"` status with a unique id.
- `completeTask(tasks: Task[], id: number): Task[]`: Returns a new array marking the task with matching id as `"done"`.
- `filterByStatus(tasks: Task[], status: TaskStatus): Task[]`: Returns only tasks matching the given status.

### Custom Operations ("Make It Yours"):
- `advanceTask(tasks: Task[], id: number): Task[]`: Progressively moves a task through its lifecycle (`todo` → `in-progress` → `done`).
- `deleteTask(tasks: Task[], id: number): Task[]`: Removes a task by ID.
- `countByStatus(tasks: Task[], status: TaskStatus): number`: Counts the number of tasks in a specific status.
- `updateTaskTitle(tasks: Task[], id: number, newTitle: string): Task[]`: Updates the title of an existing task.
- `clearCompleted(tasks: Task[]): Task[]`: Removes all completed tasks.
- `getTaskSummary(tasks: Task[])`: Aggregates the task list into total, todo, in-progress, and done counts.

## 🚀 Building & Compiling
Compile TypeScript with zero type errors:
```bash
npm run build
```
Or directly with `tsc`:
```bash
npx tsc
```
