/**
 * app.ts — TypeTasks UI Controller
 *
 * Connects the typed model (model.ts) to the HTML/CSS DOM layer.
 * All operations are verified by the TypeScript compiler with zero runtime assumptions.
 */

import {
  Task,
  TaskStatus,
  addTask,
  advanceTask,
  completeTask,
  deleteTask,
  filterByStatus,
  countByStatus,
  clearCompleted,
  getTaskSummary,
  seedNextId,
} from "./model.js";

const STORAGE_KEY = "typetasks.tasks.v2";
const STATUS_LIST: TaskStatus[] = ["todo", "in-progress", "done"];

// ---------------------------------------------------------------------------
// Typed Element Bindings (Cast to guaranteed DOM interfaces)
// ---------------------------------------------------------------------------
const titleInput = document.getElementById("title") as HTMLInputElement;
const statusSelect = document.getElementById("status") as HTMLSelectElement;
const addBtn = document.getElementById("add") as HTMLButtonElement;
const listEl = document.getElementById("list") as HTMLUListElement;
const chipsEl = document.getElementById("chips") as HTMLDivElement;
const summaryEl = document.getElementById("summary") as HTMLParagraphElement;
const clearDoneBtn = document.getElementById("clear-done") as HTMLButtonElement;

const metricTotalEl = document.getElementById("metric-total") as HTMLSpanElement;
const metricTodoEl = document.getElementById("metric-todo") as HTMLSpanElement;
const metricInProgressEl = document.getElementById("metric-inprogress") as HTMLSpanElement;
const metricDoneEl = document.getElementById("metric-done") as HTMLSpanElement;

// ---------------------------------------------------------------------------
// Application State
// ---------------------------------------------------------------------------
let tasks: Task[] = loadTasks();
let currentFilter: "all" | TaskStatus = "all";

// Ensure internal ID counter starts above existing task IDs
seedNextId(tasks);

// ---------------------------------------------------------------------------
// LocalStorage Persistence
// ---------------------------------------------------------------------------
function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Task[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // In case of parsing error, fall through to default tasks
  }

  return [
    { id: 1, title: "Design the Task model & status union", status: "done" },
    { id: 2, title: "Write type-safe operations in model.ts", status: "done" },
    { id: 3, title: "Build responsive HTML & modern CSS interface", status: "in-progress" },
    { id: 4, title: "Wire typed DOM events & compile with tsc", status: "todo" },
    { id: 5, title: "Deploy to live URL & ship pull request", status: "todo" },
  ];
}

function persist(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// ---------------------------------------------------------------------------
// UI Rendering
// ---------------------------------------------------------------------------
function render(): void {
  // 1. Filter tasks according to active status
  const visibleTasks: Task[] =
    currentFilter === "all" ? tasks : filterByStatus(tasks, currentFilter);

  // 2. Render task list
  listEl.innerHTML = "";
  if (visibleTasks.length === 0) {
    const emptyLi = document.createElement("li");
    emptyLi.className = "empty-state";
    emptyLi.innerHTML = `
      <div class="empty-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
      </div>
      <p class="empty-title">No tasks found</p>
      <p class="empty-desc">${
        currentFilter === "all"
          ? "Your task board is clear! Add your first typed task above."
          : `No tasks currently marked as "${currentFilter}".`
      }</p>
    `;
    listEl.appendChild(emptyLi);
  } else {
    for (const task of visibleTasks) {
      listEl.appendChild(createTaskElement(task));
    }
  }

  // 3. Update Metrics & Summary
  const summary = getTaskSummary(tasks);
  metricTotalEl.textContent = String(summary.total);
  metricTodoEl.textContent = String(summary.todo);
  metricInProgressEl.textContent = String(summary.inProgress);
  metricDoneEl.textContent = String(summary.done);

  summaryEl.textContent = `${summary.todo} to do • ${summary.inProgress} in progress • ${summary.done} done`;

  // 4. Update Clear Completed Button state
  clearDoneBtn.disabled = summary.done === 0;

  // 5. Render Filter Chips
  renderFilterChips();
}

/**
 * Creates the DOM element for a single task row with typed event listeners
 */
function createTaskElement(task: Task): HTMLLIElement {
  const li = document.createElement("li");
  li.className = `task-item${task.status === "done" ? " is-done" : ""}`;
  li.setAttribute("data-id", String(task.id));

  // Checkbox / Complete Toggle Button
  const checkBtn = document.createElement("button");
  checkBtn.type = "button";
  checkBtn.className = "task-checkbox-btn";
  checkBtn.title = task.status === "done" ? "Completed" : "Mark as done";
  checkBtn.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  `;
  checkBtn.onclick = () => {
    if (task.status !== "done") {
      tasks = completeTask(tasks, task.id);
    } else {
      // Toggle back to todo if clicked while done
      tasks = tasks.map((t) => (t.id === task.id ? { ...t, status: "todo" } : t));
    }
    persist();
    render();
  };

  // Task Content Body
  const bodyDiv = document.createElement("div");
  bodyDiv.className = "task-body";

  const titleSpan = document.createElement("span");
  titleSpan.className = "task-title";
  titleSpan.textContent = task.title;

  const idTag = document.createElement("span");
  idTag.className = "task-id-tag";
  idTag.textContent = `#${task.id}`;

  bodyDiv.append(titleSpan, idTag);

  // Actions Container
  const actionsDiv = document.createElement("div");
  actionsDiv.className = "task-actions";

  // Status Badge
  const badge = document.createElement("span");
  const badgeClassSuffix = task.status.replace("-", "");
  badge.className = `badge badge-${badgeClassSuffix}`;
  badge.textContent = task.status;

  // Advance Button
  const advanceBtn = document.createElement("button");
  advanceBtn.type = "button";
  advanceBtn.className = "btn-advance";

  if (task.status === "done") {
    advanceBtn.textContent = "Done ✓";
    advanceBtn.disabled = true;
  } else if (task.status === "todo") {
    advanceBtn.innerHTML = `<span>Start</span> <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
    advanceBtn.title = "Advance to In Progress";
  } else {
    advanceBtn.innerHTML = `<span>Finish</span> <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
    advanceBtn.title = "Advance to Done";
  }

  advanceBtn.onclick = () => {
    tasks = advanceTask(tasks, task.id);
    persist();
    render();
  };

  // Delete Button
  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "btn-delete";
  deleteBtn.title = "Delete task";
  deleteBtn.setAttribute("aria-label", `Delete task ${task.title}`);
  deleteBtn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  `;
  deleteBtn.onclick = () => {
    tasks = deleteTask(tasks, task.id);
    persist();
    render();
  };

  actionsDiv.append(badge, advanceBtn, deleteBtn);
  li.append(checkBtn, bodyDiv, actionsDiv);

  return li;
}

/**
 * Renders filter chips with reactive counters
 */
function renderFilterChips(): void {
  const options: ("all" | TaskStatus)[] = ["all", ...STATUS_LIST];
  chipsEl.innerHTML = "";

  for (const option of options) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = `chip${option === currentFilter ? " on" : ""}`;

    const label = document.createElement("span");
    label.textContent = option === "all" ? "All" : option;

    const count = document.createElement("span");
    count.className = "chip-count";
    const countValue =
      option === "all" ? tasks.length : countByStatus(tasks, option);
    count.textContent = String(countValue);

    chip.append(label, count);

    chip.onclick = () => {
      currentFilter = option;
      render();
    };

    chipsEl.appendChild(chip);
  }
}

// ---------------------------------------------------------------------------
// Event Handlers
// ---------------------------------------------------------------------------
function handleAddTask(): void {
  const rawTitle = titleInput.value.trim();
  if (!rawTitle) {
    titleInput.focus();
    return;
  }

  // Add task via typed pure function
  tasks = addTask(tasks, rawTitle);

  // If user selected a starting status other than "todo", set it safely
  const chosenStatus = statusSelect.value as TaskStatus;
  if (chosenStatus !== "todo") {
    const justAdded = tasks[tasks.length - 1];
    tasks = tasks.map((t) =>
      t.id === justAdded.id ? { ...t, status: chosenStatus } : t
    );
  }

  titleInput.value = "";
  persist();
  render();
  titleInput.focus();
}

addBtn.onclick = handleAddTask;

titleInput.addEventListener("keydown", (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    handleAddTask();
  }
});

clearDoneBtn.onclick = () => {
  if (confirm("Remove all completed tasks?")) {
    tasks = clearCompleted(tasks);
    persist();
    render();
  }
};

// Initial Render
render();
