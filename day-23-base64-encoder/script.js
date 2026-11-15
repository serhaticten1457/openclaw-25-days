// Day 23 - Base64 Kod Çözücü
// Base64 encode ve decode. Yerel olarak çalışır, harici bağımlılık yok.

const modeBtns = document.querySelectorAll(".mode-btn");
const inputLabel = document.getElementById("input-label");
const inputText = document.getElementById("input-text");
const btnConvert = document.getElementById("btn-convert");
const outputText = document.getElementById("output-text");
const btnCopy = document.getElementById("btn-copy");

// Durum
let mode = "encode"; // encode | decode

function convert() {
  const text = inputText.value;
  if (!text) {
    outputText.value = "";
    return;
  }

  let result;
  try {
    if (mode === "encode") {
      result = btoa(unescape(encodeURIComponent(text)));
    } else {
      result = decodeURIComponent(escape(atob(text)));
    }
    outputText.value = result;
  } catch (e) {
    outputText.value = "Geçersiz Base64 metni.";
  }
}

function copyToClipboard() {
  const text = outputText.value;
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    const original = btnCopy.innerHTML;
    btnCopy.innerHTML = `
      <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
    `;
    setTimeout(() => {
      btnCopy.innerHTML = original;
    }, 1200);
  });
}

// Mod seçici
modeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    modeBtns.forEach((b) => {
      b.classList.remove("bg-indigo-600", "text-white", "shadow-sm");
      b.classList.add("bg-white", "text-slate-600", "border", "border-slate-200");
    });
    btn.classList.remove("bg-white", "text-slate-600", "border", "border-slate-200");
    btn.classList.add("bg-indigo-600", "text-white", "shadow-sm");
    mode = btn.dataset.mode;
    inputLabel.textContent =
      mode === "encode" ? "Düz Metin" : "Base64 Metni";
    inputText.placeholder =
      mode === "encode"
        ? "Kodlanacak metni buraya yazın..."
        : "Çözülecek Base64 metnini buraya yazın...";
    inputText.value = "";
    outputText.value = "";
  });
});

// Olaylar
inputText.addEventListener("input", convert);
btnConvert.addEventListener("click", convert);
btnCopy.addEventListener("click", copyToClipboard);

// Başlangıç
convert();