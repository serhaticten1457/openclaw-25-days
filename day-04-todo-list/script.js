// Day 04 - Todo List Uygulaması
// localStorage ile kalıcı, filtreleme, öncelik, tamamla/sil

const todoInput = document.getElementById("todo-input");
const btnAdd = document.getElementById("btn-add");
const todoList = document.getElementById("todo-list");
const statsEl = document.getElementById("stats");
const filterBtns = document.querySelectorAll(".filter-btn");
const priorityBtns = document.querySelectorAll(".priority-btn");
const btnClear = document.getElementById("btn-clear");

// Durum
let state = {
  todos: [],
  filter: "all", // all | active | completed
  selectedPriority: "medium",
};

// localStorage'dan yükle
function loadTodos() {
  try {
    const raw = localStorage.getItem("day04_todos");
    if (raw) {
      state.todos = JSON.parse(raw);
    }
  } catch (e) {
    console.error("localStorage okuma hatası", e);
  }
  render();
}

// localStorage'a kaydet
function saveTodos() {
  try {
    localStorage.setItem("day04_todos", JSON.stringify(state.todos));
  } catch (e) {
    console.error("localStorage yazma hatası", e);
  }
}

// Görev ekle
function addTodo() {
  const title = todoInput.value.trim();
  if (!title) return;

  const todo = {
    id: Date.now(),
    title,
    completed: false,
    priority: state.selectedPriority,
    createdAt: Date.now(),
  };

  state.todos.unshift(todo);
  todoInput.value = "";
  saveTodos();
  render();
}

// Görev tamamla / geri al
function toggleTodo(id) {
  state.todos = state.todos.map((t) =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTodos();
  render();
}

// Görev sil
function deleteTodo(id) {
  state.todos = state.todos.filter((t) => t.id !== id);
  saveTodos();
  render();
}

// Tamamlanmışları temizle
function clearCompleted() {
  state.todos = state.todos.filter((t) => !t.completed);
  saveTodos();
  render();
}

// Filtrele
function setFilter(filter) {
  state.filter = filter;
  render();
}

// Öncelik seç
function setPriority(priority) {
  state.selectedPriority = priority;
  renderPriorityUI();
}

function renderPriorityUI() {
  priorityBtns.forEach((btn) => {
    const p = btn.dataset.priority;
    btn.classList.remove(
      "border-indigo-200", "bg-indigo-50", "text-indigo-700",
      "border-rose-200", "text-rose-600", "hover:bg-rose-50",
      "border-slate-200", "text-slate-600", "hover:bg-slate-50"
    );
    if (p === state.selectedPriority) {
      if (p === "low") {
        btn.classList.add("border-slate-200", "bg-slate-50", "text-slate-600");
      } else if (p === "medium") {
        btn.classList.add("border-indigo-200", "bg-indigo-50", "text-indigo-700");
      } else {
        btn.classList.add("border-rose-200", "text-rose-600");
      }
    } else {
      btn.classList.add("border-slate-200", "text-slate-600", "hover:bg-slate-50");
    }
  });
}

// Render
function render() {
  const filtered = state.todos.filter((t) => {
    if (state.filter === "active") return !t.completed;
    if (state.filter === "completed") return t.completed;
    return true;
  });

  // İstatistikler
  const total = state.todos.length;
  const completed = state.todos.filter((t) => t.completed).length;
  statsEl.textContent = `Toplam ${total} · Tamamlanan ${completed}`;

  // Liste
  todoList.innerHTML = "";

  if (filtered.length === 0) {
    const empty = document.createElement("li");
    empty.className = "py-8 text-center text-slate-400 text-sm";
    empty.textContent =
      state.filter === "active"
        ? "Aktif görev yok! 🎉"
        : state.filter === "completed"
        ? "Henüz tamamlanmış görev yok."
        : "Henüz görev eklenmemiş.";
    todoList.appendChild(empty);
    return;
  }

  filtered.forEach((todo) => {
    const el = document.createElement("li");
    el.className = `todo-item ${todo.completed ? "completed" : ""} flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 shadow-sm`;

    const priorityColors = {
      low: "bg-slate-100 text-slate-600 border border-slate-200",
      medium: "bg-indigo-50 text-indigo-700 border border-indigo-200",
      high: "bg-rose-50 text-rose-700 border border-rose-200",
    };

    el.innerHTML = `
      <div class="flex items-center gap-3 flex-1">
        <button class="toggle-btn w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${todo.completed ? "bg-indigo-600 border-indigo-600" : "border-slate-300 hover:border-indigo-500"}" aria-label="Tamamla" data-id="${todo.id}">
          ${todo.completed ? '<svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>' : ""}
        </button>
        <div>
          <span class="todo-title block text-sm font-medium ${todo.completed ? "line-through text-slate-400" : "text-slate-800"}">${escapeHtml(todo.title)}</span>
          <span class="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${priorityColors[todo.priority]}">${todo.priority}</span>
        </div>
      </div>
      <button class="delete-btn p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" aria-label="Sil" data-id="${todo.id}">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
      </button>
    `;

    el.querySelector(".toggle-btn").addEventListener("click", () => toggleTodo(todo.id));
    el.querySelector(".delete-btn").addEventListener("click", () => deleteTodo(todo.id));

    todoList.appendChild(el);
  });
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Olaylar
btnAdd.addEventListener("click", addTodo);

todoInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTodo();
});

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => {
      b.classList.remove("bg-indigo-600", "text-white", "shadow-sm");
      b.classList.add("bg-white", "text-slate-600", "border", "border-slate-200");
    });
    btn.classList.remove("bg-white", "text-slate-600", "border", "border-slate-200");
    btn.classList.add("bg-indigo-600", "text-white", "shadow-sm");
    setFilter(btn.dataset.filter);
  });
});

priorityBtns.forEach((btn) => {
  btn.addEventListener("click", () => setPriority(btn.dataset.priority));
});

btnClear.addEventListener("click", clearCompleted);

// Başlat
loadTodos();
renderPriorityUI();