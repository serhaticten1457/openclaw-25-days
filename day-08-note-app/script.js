// Day 08 - Not Kayıt Uygulaması
// localStorage ile kalıcı notlar, başlık/içerik, silme, arama

const noteTitleInput = document.getElementById("note-title");
const noteContentInput = document.getElementById("note-content");
const btnSave = document.getElementById("btn-save");
const noteList = document.getElementById("note-list");
const emptyState = document.getElementById("empty-state");
const searchInput = document.getElementById("search");
const btnClearAll = document.getElementById("btn-clear-all");

// Durum
let state = {
  notes: [], // { id, title, content, createdAt, updatedAt }
  search: "",
};

// localStorage'dan yükle
function loadNotes() {
  try {
    const raw = localStorage.getItem("day08_notes");
    if (raw) {
      state.notes = JSON.parse(raw);
    }
  } catch (e) {
    console.error("localStorage okuma hatası", e);
  }
  render();
}

// localStorage'a kaydet
function saveNotes() {
  try {
    localStorage.setItem("day08_notes", JSON.stringify(state.notes));
  } catch (e) {
    console.error("localStorage yazma hatası", e);
  }
}

// Not ekle veya güncelle
function saveNote() {
  const title = noteTitleInput.value.trim();
  const content = noteContentInput.value.trim();

  if (!title && !content) return;

  const now = Date.now();
  const note = {
    id: now,
    title: title || "(Başlıksız)",
    content: content,
    createdAt: now,
    updatedAt: now,
  };

  state.notes.unshift(notaFix(note));
  saveNotes();
  noteTitleInput.value = "";
  noteContentInput.value = "";
  render();
}

// Yardımcı: note objesini normalize et (gerçek kullanımda basit kopyalama)
function notaFix(note) {
  return { ...note };
}

// Not sil
function deleteNote(id) {
  state.notes = state.notes.filter((n) => n.id !== id);
  saveNotes();
  render();
}

// Tüm notları sil
function clearAllNotes() {
  if (!confirm("Tüm notları silmek istediğinize emin misiniz?")) return;
  state.notes = [];
  saveNotes();
  render();
}

// Arama filtresi
function setSearch(query) {
  state.search = query.toLowerCase();
  render();
}

// Tarih biçimi
function formatDate(timestamp) {
  const d = new Date(timestamp);
  return d.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Kısa özet (ilk satır / ilk 80 karakter)
function excerpt(text, len = 80) {
  if (!text) return "";
  return text.length > len ? text.slice(0, len) + "…" : text;
}

// Render
function render() {
  const filtered = state.notes.filter((n) => {
    if (!state.search) return true;
    const haystack = (n.title + " " + n.content).toLowerCase();
    return haystack.includes(state.search);
  });

  noteList.innerHTML = "";

  if (filtered.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }
  emptyState.classList.add("hidden");

  filtered.forEach((note) => {
    const el = document.createElement("div");
    el.className = "note-card p-4 rounded-xl border border-slate-200 bg-white";
    el.innerHTML = `
      <div class="flex justify-between items-start mb-2">
        <h3 class="font-semibold text-slate-800">${escapeHtml(note.title)}</h3>
        <button class="delete-btn p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" aria-label="Sil" data-id="${note.id}">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </button>
      </div>
      <p class="text-sm text-slate-600 mb-3 line-clamp-2">${escapeHtml(note.content)}</p>
      <div class="flex justify-between items-center">
        <span class="text-[10px] text-slate-400 uppercase tracking-wider">${formatDate(note.updatedAt)}</span>
        <button class="edit-btn text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1" data-id="${note.id}">
          Düzenle
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
        </button>
      </div>
    `;

    el.querySelector(".delete-btn").addEventListener("click", () => deleteNote(note.id));
    el.querySelector(".edit-btn").addEventListener("click", () => editNote(note));

    noteList.appendChild(el);
  });
}

// Not düzenle (formu doldur)
function editNote(note) {
  noteTitleInput.value = note.title;
  noteContentInput.value = note.content;
  deleteNote(note.id); // mevcut notu sil, yeni olarak eklenecek (yeniden sıralama için)
  noteTitleInput.focus();
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Olaylar
btnSave.addEventListener("click", saveNote);

noteTitleInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    noteContentInput.focus();
  }
});

searchInput.addEventListener("input", (e) => setSearch(e.target.value));

btnClearAll.addEventListener("click", clearAllNotes);

// Başlat
loadNotes();
render();