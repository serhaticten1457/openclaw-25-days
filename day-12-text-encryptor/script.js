// Day 12 - Metin Şifreleyici
// Caesar Cipher ile metin şifreleme/çözme. Yerel olarak çalışır, veri çıkış yok.

const inputText = document.getElementById("input-text");
const outputText = document.getElementById("output-text");
const shiftKey = document.getElementById("shift-key");
const modeBtns = document.querySelectorAll(".mode-btn");
const btnProcess = document.getElementById("btn-process");
const btnCopy = document.getElementById("btn-copy");

let mode = "encrypt"; // encrypt | decrypt

function caesarCipher(text, shift, isEncrypt) {
  if (!isEncrypt) shift = -shift;
  // Shift'i 0-25 aralığa normalize et
  shift = ((shift % 26) + 26) % 26;

  let result = "";
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const code = text.charCodeAt(i);

    if (ch >= "a" && ch <= "z") {
      const base = "a".charCodeAt(0);
      result += String.fromCharCode(((code - base + shift) % 26) + base);
    } else if (ch >= "A" && ch <= "Z") {
      const base = "A".charCodeAt(0);
      result += String.fromCharCode(((code - base + shift) % 26) + base);
    } else {
      result += ch;
    }
  }
  return result;
}

function process() {
  const text = inputText.value;
  const shift = parseInt(shiftKey.value, 10) || 13;
  const result = caesarCipher(text, shift, mode === "encrypt");
  outputText.value = result;
}

function copyToClipboard() {
  const text = outputText.value;
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    const original = btnCopy.textContent;
    btnCopy.textContent = "Kopyalandı!";
    btnCopy.classList.add("text-emerald-600");
    setTimeout(() => {
      btnCopy.textContent = original;
      btnCopy.classList.remove("text-emerald-600");
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
    process();
  });
});

// Olaylar
[inputText, shiftKey].forEach((el) => {
  el.addEventListener("input", process);
});

btnProcess.addEventListener("click", process);
btnCopy.addEventListener("click", copyToClipboard);

// Başlangıç
process();