/**
 * model.ts - TypeTasks Data Model & Operations
 *
 * This module defines the core data model and type-safe operations for TypeTasks.
 * By enforcing exact shapes and literal union types at compile time, the compiler
 * guarantees that tasks cannot enter an invalid state.
 */

// 1. TaskStatus literal union: restricted strictly to the 3 valid states
export type TaskStatus = "todo" | "in-progress" | "done";

// 2. Task interface: enforces the exact contract for every task in the system
export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
}

// Internal counter to ensure every generated task has a unique id
let nextId = 1;

/**
 * Seeds or resets the nextId counter based on existing tasks.
 * Useful when restoring tasks from storage to avoid id collisions.
 */
export function seedNextId(tasks: Task[]): void {
  const maxId = tasks.reduce((max, t) => (t.id > max ? t.id : max), 0);
  nextId = maxId + 1;
}

/**
 * Adds a new task to the collection.
 * The new task always starts in the "todo" status with a unique id.
 * Returns a new array (immutable update).
 */
export function addTask(tasks: Task[], title: string): Task[] {
  const newTask: Task = {
    id: nextId++,
    title: title.trim(),
    status: "todo",
  };
  return [...tasks, newTask];
}

/**
 * Marks a task with the given id as "done".
 * Returns a new array with the updated task.
 */
export function completeTask(tasks: Task[], id: number): Task[] {
  return tasks.map((t) => (t.id === id ? { ...t, status: "done" } : t));
}

/**
 * Filters tasks strictly by their TaskStatus.
 * Passing any string outside the TaskStatus union is rejected at compile time.
 */
export function filterByStatus(tasks: Task[], status: TaskStatus): Task[] {
  return tasks.filter((t) => t.status === status);
}

/* ==========================================================================
 * Make It Yours — Custom Typed Operations
 * ========================================================================== */

/**
 * Advances a task through the lifecycle: "todo" -> "in-progress" -> "done".
 * If the task is already "done", its status remains unchanged.
 */
export function advanceTask(tasks: Task[], id: number): Task[] {
  const statusTransitions: Record<TaskStatus, TaskStatus> = {
    todo: "in-progress",
    "in-progress": "done",
    done: "done",
  };

  return tasks.map((t) =>
    t.id === id ? { ...t, status: statusTransitions[t.status] } : t
  );
}

/**
 * Removes a task with the matching id from the task list.
 */
export function deleteTask(tasks: Task[], id: number): Task[] {
  return tasks.filter((t) => t.id !== id);
}

/**
 * Counts the number of tasks currently matching a given status.
 */
export function countByStatus(tasks: Task[], status: TaskStatus): number {
  return filterByStatus(tasks, status).length;
}

/**
 * Updates the title of an existing task by id.
 */
export function updateTaskTitle(
  tasks: Task[],
  id: number,
  newTitle: string
): Task[] {
  return tasks.map((t) =>
    t.id === id ? { ...t, title: newTitle.trim() } : t
  );
}

/**
 * Clears all tasks that are marked as "done".
 */
export function clearCompleted(tasks: Task[]): Task[] {
  return tasks.filter((t) => t.status !== "done");
}

/**
 * Generates an aggregated summary of the task collection.
 */
export function getTaskSummary(tasks: Task[]): {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
} {
  return {
    total: tasks.length,
    todo: countByStatus(tasks, "todo"),
    inProgress: countByStatus(tasks, "in-progress"),
    done: countByStatus(tasks, "done"),
  };
}
