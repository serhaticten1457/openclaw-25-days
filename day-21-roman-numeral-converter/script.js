// Day 21 - Roma Rakamı Dönüştürücü
// Arap rakamı ↔ Roma rakamı dönüşümü. 1–3999 aralığı. Harici bağımlılık yok.

const modeBtns = document.querySelectorAll(".mode-btn");
const inputLabel = document.getElementById("input-label");
const inputValue = document.getElementById("input-value");
const btnConvert = document.getElementById("btn-convert");
const resultCard = document.getElementById("result-card");
const resultValue = document.getElementById("result-value");

// Durum
let mode = "to-roman"; // to-roman | to-arabic

// Roma rakamı eşleştirmeleri (büyükten küçüğe)
const ROMAN_MAP = [
  { value: 1000, numeral: "M" },
  { value: 900, numeral: "CM" },
  { value: 500, numeral: "D" },
  { value: 400, numeral: "CD" },
  { value: 100, numeral: "C" },
  { value: 90, numeral: "XC" },
  { value: 50, numeral: "L" },
  { value: 40, numeral: "XL" },
  { value: 10, numeral: "X" },
  { value: 9, numeral: "IX" },
  { value: 5, numeral: "V" },
  { value: 4, numeral: "IV" },
  { value: 1, numeral: "I" },
];

const ROMAN_CHARS = "IVXLCDM";

// Arap → Roma
function toRoman(num) {
  if (num < 1 || num > 3999 || !Number.isInteger(num)) return null;
  let result = "";
  let remaining = num;
  for (const { value, numeral } of ROMAN_MAP) {
    while (remaining >= value) {
      result += numeral;
      remaining -= value;
    }
  }
  return result;
}

// Roma → Arap
function toArabic(roman) {
  const s = roman.toUpperCase().trim();
  if (!s || !/^[IVXLCDM]+$/.test(s)) return null;

  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const current = VALUE_MAP[s[i]];
    const next = VALUE_MAP[s[i + 1]];
    if (next && current < next) {
      total -= current;
    } else {
      total += current;
    }
  }

  // Geçerlilik kontrolü: geri dönüştürüp eşleşiyor mu?
  if (toRoman(total) !== s) return null;
  return total;
}

const VALUE_MAP = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000,
};

function convert() {
  const raw = inputValue.value.trim();
  if (!raw) {
    resultCard.classList.add("hidden");
    return;
  }

  let result;
  if (mode === "to-roman") {
    const num = parseInt(raw, 10);
    if (isNaN(num)) {
      showError("Geçerli bir sayı girin.");
      return;
    }
    result = toRoman(num);
    if (!result) {
      showError("1–3999 aralığında bir tam sayı girin.");
      return;
    }
  } else {
    result = toArabic(raw);
    if (result === null) {
      showError("Geçerli bir Roma rakamı girin.");
      return;
    }
  }

  resultValue.textContent = result;
  resultCard.classList.remove("hidden");
}

function showError(msg) {
  resultValue.textContent = msg;
  resultValue.className = "text-2xl font-bold text-rose-600";
  resultCard.classList.remove("hidden");
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
      mode === "to-roman" ? "Arap Rakamı (1–3999)" : "Roma Rakamı (I–MMMCMXCIX)";
    inputValue.placeholder =
      mode === "to-roman" ? "Örn: 1999" : "Örn: MCMXCIX";
    inputValue.value = "";
    resultCard.classList.add("hidden");
  });
});

// Olaylar
btnConvert.addEventListener("click", convert);

inputValue.addEventListener("keypress", (e) => {
  if (e.key === "Enter") convert();
});

// Başlangıçta boş
resultCard.classList.add("hidden");