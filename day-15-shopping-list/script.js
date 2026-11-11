// Day 15 - Günlük Alışveriş Listesi
// localStorage ile kalıcı, ekle/sil/işaretle, temizleme

const itemInput = document.getElementById("item-input");
const btnAdd = document.getElementById("btn-add");
const itemList = document.getElementById("item-list");
const emptyState = document.getElementById("empty-state");
const statsEl = document.getElementById("stats");
const btnClearCompleted = document.getElementById("btn-clear-completed");
const btnClearAll = document.getElementById("btn-clear-all");

// Durum
let state = {
  items: [], // { id, name, checked, createdAt }
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
  const name = itemInput.value.trim();
  if (!name) return;

  const item = {
    id: Date.now(),
    name,
    checked: false,
    createdAt: Date.now(),
  };

  state.items.push(item);
  itemInput.value = "";
  saveItems();
  render();
}

// Ürünü işaretle / geri al
function toggleItem(id) {
  state.items = state.items.map((it) =>
    it.id === id ? { ...it, checked: !it.checked } : it
  );
  saveItems();
  render();
}

// Ürün sil
function deleteItem(id) {
  state.items = state.items.filter((it) => it.id !== id);
  saveItems();
  render();
}

// Alınanları temizle
function clearCompleted() {
  state.items = state.items.filter((it) => !it.checked);
  saveItems();
  render();
}

// Tümünü sil
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
  const checked = state.items.filter((it) => it.checked).length;
  statsEl.textContent = `Toplam ${total} · Alınan ${checked}`;

  if (total === 0) {
    emptyState.classList.remove("hidden");
    return;
  }
  emptyState.classList.add("hidden");

  // Önce alınmayanlar, sonra alınanlar
  const sorted = [...state.items].sort((a, b) => a.checked - b.checked);

  sorted.forEach((item) => {
    const el = document.createElement("div");
    el.className = `item-card p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between ${item.checked ? "checked" : ""}`;
    el.innerHTML = `
      <div class="flex items-center gap-3 flex-1 cursor-pointer" onclick="toggleItemById(${item.id})">
        <input type="checkbox" class="accent-indigo-600 rounded" ${item.checked ? "checked" : ""} onchange="toggleItemById(${item.id})" />
        <span class="item-label text-sm ${item.checked ? "text-slate-400" : "text-slate-800"}">${escapeHtml(item.name)}</span>
      </div>
      <button class="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" onclick="deleteItemById(${item.id})" aria-label="Sil">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
      </button>
    `;
    itemList.appendChild(el);
  });
}

function toggleItemById(id) {
  toggleItem(id);
}

function deleteItemById(id) {
  deleteItem(id);
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

btnClearCompleted.addEventListener("click", clearCompleted);
btnClearAll.addEventListener("click", clearAll);

// Başlat
loadItems();
render();