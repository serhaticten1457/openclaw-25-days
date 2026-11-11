// Day 15 - Günlük Alışveriş Listesi
// localStorage ile kalıcı, ekle/sil, işaretle, filtreleme yok (basit)

const itemInput = document.getElementById("item-input");
const btnAdd = document.getElementById("btn-add");
const itemList = document.getElementById("item-list");
const emptyState = document.getElementById("empty-state");
const totalCountEl = document.getElementById("total-count");
const doneCountEl = document.getElementById("done-count");

// Durum
let state = {
  items: [], // { id, text, completed }
};

// localStorage'dan yükle
function loadItems() {
  try {
    const raw = localStorage.getItem("day15_shopping_items");
    if (raw) {
      state.items = JSON.parse(raw);
    }
  } catch (e) {
    console.error("localStorage okuma hatası", e);
  }
  render();
}

// localStorage'a kaydet
function saveItems() {
  try {
    localStorage.setItem("day15_shopping_items", JSON.stringify(state.items));
  } catch (e) {
    console.error("localStorage yazma hatası", e);
  }
}

// Ürün ekle
function addItem() {
  const text = itemInput.value.trim();
  if (!text) return;

  const item = {
    id: Date.now(),
    text: text,
    completed: false,
  };

  state.items.push(item);
  itemInput.value = "";
  saveItems();
  render();
}

// Ürün tamamla / geri al
function toggleItem(id) {
  state.items = state.items.map((i) =>
    i.id === id ? { ...i, completed: !i.completed } : i
  );
  saveItems();
  render();
}

// Ürün sil
function deleteItem(id) {
  state.items = state.items.filter((i) => i.id !== id);
  saveItems();
  render();
}

// Tümünü temizle
function clearAll() {
  if (!confirm("Tüm ürünleri silmek istediğinize emin misiniz?")) return;
  state.items = [];
  saveItems();
  render();
}

// Render
function render() {
  itemList.innerHTML = "";

  const total = state.items.length;
  const done = state.items.filter((i) => i.completed).length;

  totalCountEl.textContent = total;
  doneCountEl.textContent = `${done} tamamlandı`;

  if (total === 0) {
    emptyState.classList.remove("hidden");
  } else {
    emptyState.classList.add("hidden");
  }

  state.items.forEach((item) => {
    const el = document.createElement("div");
    el.className = `item-card p-3 rounded-xl border border-slate-100 bg-white flex items-center justify-between shadow-sm ${item.completed ? "completed" : ""}`;
    el.innerHTML = `
      <div class="flex items-center gap-3 flex-1">
        <button class="toggle-btn w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${item.completed ? "bg-indigo-600 border-indigo-600" : "border-slate-300 hover:border-indigo-500"}" aria-label="İşaretle" data-id="${item.id}">
          ${item.completed ? '<svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>' : ""}
        </button>
        <span class="item-text text-sm ${item.completed ? "line-through text-slate-400" : "text-slate-800"}">${escapeHtml(item.text)}</span>
      </div>
      <button class="delete-btn p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" aria-label="Sil" data-id="${item.id}">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
      </button>
    `;

    el.querySelector(".toggle-btn").addEventListener("click", () => toggleItem(item.id));
    el.querySelector(".delete-btn").addEventListener("click", () => deleteItem(item.id));

    itemList.appendChild(el);
  });
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Olaylar
btnAdd.addEventListener("click", addItem);

itemInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addItem();
});

// Başlat
loadItems();
render();