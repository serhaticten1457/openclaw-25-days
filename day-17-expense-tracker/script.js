// Day 17 - Gider Takip Uygulaması
// localStorage ile kalıcı, kategori filtreleme, silme, özet

const amountInput = document.getElementById("expense-amount");
const categorySelect = document.getElementById("expense-category");
const descInput = document.getElementById("expense-desc");
const dateInput = document.getElementById("expense-date");
const btnAdd = document.getElementById("btn-add-expense");
const btnClearAll = document.getElementById("btn-clear-all");
const expenseList = document.getElementById("expense-list");
const emptyState = document.getElementById("empty-state");
const valTotal = document.getElementById("val-total");
const valCount = document.getElementById("val-count");
const valAvg = document.getElementById("val-avg");

// Bugünün tarihini varsayılan olarak ayarla
const today = new Date().toISOString().split("T")[0];
dateInput.value = today;

// Durum
let state = {
  expenses: [], // { id, amount, category, desc, date }
};

// localStorage'dan yükle
function loadExpenses() {
  try {
    const raw = localStorage.getItem("day17_expenses");
    if (raw) {
      state.expenses = JSON.parse(raw);
    }
  } catch (e) {
    console.error("localStorage okuma hatası", e);
  }
  render();
}

// localStorage'a kaydet
function saveExpenses() {
  try {
    localStorage.setItem("day17_expenses", JSON.stringify(state.expenses));
  } catch (e) {
    console.error("localStorage yazma hatası", e);
  }
}

// Gider ekle
function addExpense() {
  const amount = parseFloat(amountInput.value);
  const category = categorySelect.value;
  const desc = descInput.value.trim();
  const date = dateInput.value;

  if (!amount || amount <= 0) {
    alert("Lütfen geçerli bir tutar girin.");
    amountInput.focus();
    return;
  }
  if (!date) {
    alert("Lütfen bir tarih seçin.");
    dateInput.focus();
    return;
  }

  const expense = {
    id: Date.now(),
    amount,
    category,
    desc: desc || "(Açıklama yok)",
    date,
  };

  state.expenses.unshift(expense);
  saveExpenses();
  amountInput.value = "";
  descInput.value = "";
  render();
}

// Gider sil
function deleteExpense(id) {
  state.expenses = state.expenses.filter((e) => e.id !== id);
  saveExpenses();
  render();
}

// Tümünü sil
function clearAllExpenses() {
  if (state.expenses.length === 0) return;
  if (!confirm("Tüm gider kayıtlarını silmek istediğinize emin misiniz?")) return;
  state.expenses = [];
  saveExpenses();
  render();
}

// Para formatı (₺)
function formatCurrency(n) {
  return n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " ₺";
}

// Kategori görünen adı
function categoryLabel(cat) {
  const labels = {
    yemek: "Yemek",
    ulasim: "Ulaşım",
    ev: "Ev Faturaları",
    eglence: "Eğlence",
    saglik: "Sağlık",
    diger: "Diğer",
  };
  return labels[cat] || cat;
}

// Kategori rengi
function categoryColor(cat) {
  const colors = {
    yemek: "bg-rose-50 text-rose-700 border-rose-200",
    ulasim: "bg-blue-50 text-blue-700 border-blue-200",
    ev: "bg-amber-50 text-amber-700 border-amber-200",
    eglence: "bg-purple-50 text-purple-700 border-purple-200",
    saglik: "bg-emerald-50 text-emerald-700 border-emerald-200",
    diger: "bg-slate-50 text-slate-700 border-slate-200",
  };
  return colors[cat] || colors.diger;
}

// Tarih biçimi
function formatDate(isoDate) {
  const d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
}

// Render
function render() {
  expenseList.innerHTML = "";

  if (state.expenses.length === 0) {
    emptyState.classList.remove("hidden");
  } else {
    emptyState.classList.add("hidden");
    state.expenses.forEach((exp) => {
      const el = document.createElement("div");
      el.className = "expense-row flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white";
      el.innerHTML = `
        <div class="flex items-center gap-3 flex-1">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${categoryColor(exp.category)}">
            ${exp.category.charAt(0).toUpperCase()}
          </div>
          <div>
            <div class="text-sm font-medium text-slate-800">${escapeHtml(exp.desc)}</div>
            <div class="flex items-center gap-1.5 text-[10px] text-slate-500">
              <span>${categoryLabel(exp.category)}</span>
              <span>•</span>
              <span>${formatDate(exp.date)}</span>
            </div>
          </div>
        </div>
        <div class="text-right">
          <div class="text-sm font-bold text-slate-800 font-mono">-${formatCurrency(exp.amount)}</div>
          <button class="delete-btn p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" aria-label="Sil" data-id="${exp.id}">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </div>
      `;

      el.querySelector(".delete-btn").addEventListener("click", () => deleteExpense(exp.id));
      expenseList.appendChild(el);
    });
  }

  // Özet
  const total = state.expenses.reduce((sum, e) => sum + e.amount, 0);
  const count = state.expenses.length;
  valTotal.textContent = formatCurrency(total);
  valCount.textContent = count;
  valAvg.textContent = count > 0 ? formatCurrency(total / count) : "0.00 ₺";
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Olaylar
btnAdd.addEventListener("click", addExpense);

amountInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addExpense();
});

descInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    dateInput.focus();
  }
});

dateInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addExpense();
});

btnClearAll.addEventListener("click", clearAllExpenses);

// Başlat
loadExpenses();
render();