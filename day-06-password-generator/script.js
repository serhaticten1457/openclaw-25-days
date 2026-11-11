// Day 06 - Şifre Üreteci
// Yerel olarak rastgele şifre üretir, hiçbir veri sunucuya gönderilmez.

const passwordDisplay = document.getElementById("password-display");
const strengthText = document.getElementById("strength");
const strengthBar = document.getElementById("strength-bar");
const lengthSlider = document.getElementById("length-slider");
const lengthVal = document.getElementById("length-val");
const btnGenerate = document.getElementById("btn-generate");
const btnCopy = document.getElementById("btn-copy");
const incLower = document.getElementById("inc-lower");
const incUpper = document.getElementById("inc-upper");
const incNumbers = document.getElementById("inc-numbers");
const incSymbols = document.getElementById("inc-symbols");
const incAmbiguous = document.getElementById("inc-ambiguous");

// Karakter kümeleri
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`";
const AMBIGUOUS = "iL1oO0";

function getCharset() {
  let charset = "";
  if (incLower.checked) charset += LOWER;
  if (incUpper.checked) charset += UPPER;
  if (incNumbers.checked) charset += NUMBERS;
  if (incSymbols.checked) charset += SYMBOLS;

  if (!incAmbiguous.checked) {
    // Karışık karakterleri çıkar
    for (const ch of AMBIGUOUS) {
      charset = charset.replace(ch, "");
    }
  }

  return charset;
}

function generatePassword(length, charset) {
  if (!charset || length <= 0) return "";
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset[array[i] % charset.length];
  }
  return password;
}

function evaluateStrength(password) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  const levels = [
    { label: "Çok Zayıf", color: "text-rose-500", bar: "bg-rose-500", width: "w-1/6" },
    { label: "Zayıf", color: "text-orange-500", bar: "bg-orange-500", width: "w-2/6" },
    { label: "Orta", color: "text-amber-500", bar: "bg-amber-500", width: "w-3/6" },
    { label: "İyi", color: "text-emerald-500", bar: "bg-emerald-500", width: "w-4/6" },
    { label: "Güçlü", color: "text-indigo-600", bar: "bg-indigo-600", width: "w-5/6" },
    { label: "Çok Güçlü", color: "text-emerald-700", bar: "bg-emerald-700", width: "w-full" },
  ];

  const level = levels[Math.min(score, levels.length - 1)];
  return level;
}

function updateUI(password, level) {
  passwordDisplay.value = password;
  strengthText.textContent = `Şifre gücü: ${level.label}`;
  strengthText.className = `text-xs font-semibold uppercase tracking-wider ${level.color}`;
  strengthBar.className = `h-full rounded-full transition-all duration-300 ${level.bar} ${level.width}`;
  strengthBar.style.width = level.width;
}

function generate() {
  const length = parseInt(lengthSlider.value, 10);
  const charset = getCharset();
  const password = generatePassword(length, charset);
  const level = evaluateStrength(password);
  updateUI(password, level);
}

function copyToClipboard() {
  const password = passwordDisplay.value;
  if (!password) return;
  navigator.clipboard.writeText(password).then(() => {
    const original = btnCopy.innerHTML;
    btnCopy.innerHTML = `
      <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
    `;
    setTimeout(() => {
      btnCopy.innerHTML = original;
    }, 1500);
  });
}

// Olaylar
lengthSlider.addEventListener("input", () => {
  lengthVal.textContent = lengthSlider.value;
  generate();
});

[incLower, incUpper, incNumbers, incSymbols, incAmbiguous].forEach((el) => {
  el.addEventListener("change", generate);
});

btnGenerate.addEventListener("click", generate);
btnCopy.addEventListener("click", copyToClipboard);

// Başlangıç
generate();