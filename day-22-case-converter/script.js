// Day 22 - Harf Dönüştürücü
// Metni farklı harf biçimine çevirir. Harici bağımlılık yok.

const inputText = document.getElementById("input-text");
const outputText = document.getElementById("output-text");
const caseBtns = document.querySelectorAll(".case-btn");
const btnCopy = document.getElementById("btn-copy");

let currentCase = "upper"; // upper | lower | title | sentence | camel | pascal | snake | kebab | constant

function toCase(text, type) {
  if (!text) return "";

  switch (type) {
    case "upper":
      return text.toUpperCase();

    case "lower":
      return text.toLowerCase();

    case "title":
      return text
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");

    case "sentence":
      return text
        .charAt(0)
        .toUpperCase() + text.slice(1).toLowerCase();

    case "camel": {
      const words = text.split(/[\s_\-]+/).filter(Boolean);
      return words
        .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
        .join("");
    }

    case "pascal": {
      const words = text.split(/[\s_\-]+/).filter(Boolean);
      return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
    }

    case "snake":
      return text
        .split(/[\s\-]+/)
        .filter(Boolean)
        .map((w) => w.toLowerCase())
        .join("_");

    case "kebab":
      return text
        .split(/[\s_]+/)
        .filter(Boolean)
        .map((w) => w.toLowerCase())
        .join("-");

    case "constant":
      return text
        .split(/[\s\-]+/)
        .filter(Boolean)
        .map((w) => w.toUpperCase())
        .join("_");

    default:
      return text;
  }
}

function convert() {
  const text = inputText.value;
  outputText.value = toCase(text, currentCase);
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

// Biçim seçici
caseBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    caseBtns.forEach((b) => {
      b.classList.remove("bg-indigo-600", "text-white", "shadow-sm");
      b.classList.add("bg-white", "text-slate-600", "border", "border-slate-200");
    });
    btn.classList.remove("bg-white", "text-slate-600", "border", "border-slate-200");
    btn.classList.add("bg-indigo-600", "text-white", "shadow-sm");
    currentCase = btn.dataset.case;
    convert();
  });
});

// Olaylar
inputText.addEventListener("input", convert);
btnCopy.addEventListener("click", copyToClipboard);

// Başlangıç
convert();