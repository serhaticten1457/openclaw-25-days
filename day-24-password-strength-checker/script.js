// Day 24 - Şifre Gücü Denetleyici
// Şifre gücünü anında analiz eder, kurallar listesi gösterir. Yerel olarak çalışır.

const passwordInput = document.getElementById("password-input");
const btnToggle = document.getElementById("btn-toggle");
const scoreText = document.getElementById("score-text");
const scoreBar = document.getElementById("score-bar");
const strengthLabel = document.getElementById("strength-label");
const rulesList = document.getElementById("rules-list");
const btnCopy = document.getElementById("btn-copy");

// Kurallar
const RULES = [
  { id: "length", label: "En az 8 karakter", check: (p) => p.length >= 8 },
  { id: "lower", label: "Küçük harf (a-z)", check: (p) => /[a-z]/.test(p) },
  { id: "upper", label: "Büyük harf (A-Z)", check: (p) => /[A-Z]/.test(p) },
  { id: "digit", label: "Rakam (0-9)", check: (p) => /[0-9]/.test(p) },
  { id: "symbol", label: "Sembol (!@#$...)", check: (p) => /[^a-zA-Z0-9]/.test(p) },
  { id: "no-spaces", label: "Boşluk yok", check: (p) => !/\s/.test(p) },
];

// Durum
let currentPassword = "";

// Şifre gücünü hesapla (0-100)
function calculateScore(password) {
  if (!password) return 0;

  let score = 0;
  let metRules = 0;

  RULES.forEach((rule) => {
    if (rule.check(password)) metRules++;
  });

  // Temel puan: kurallar % cinsinden (max 60)
  score += Math.round((metRules / RULES.length) * 60);

  // Uzunluk bonusu (max 20)
  if (password.length >= 12) score += 20;
  else if (password.length >= 10) score += 10;
  else if (password.length >= 8) score += 5;

  // Çeşitsizlik bonusu (max 20)
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);
  const varietyCount = [hasLower, hasUpper, hasDigit, hasSymbol].filter(Boolean).length;
  score += varietyCount * 5;

  return Math.min(100, score);
}

function getStrengthLabel(score) {
  if (score === 0) return { label: "Şifre giriniz", color: "text-slate-400" };
  if (score < 30) return { label: "Çok Zayıf", color: "text-rose-600" };
  if (score < 50) return { label: "Zayıf", color: "text-orange-500" };
  if (score < 70) return { label: "Orta", color: "text-amber-500" };
  if (score < 90) return { label: "İyi", color: "text-emerald-500" };
  return { label: "Güçlü", color: "text-emerald-700" };
}

function getBarColor(score) {
  if (score < 30) return "bg-rose-500";
  if (score < 50) return "bg-orange-500";
  if (score < 70) return "bg-amber-500";
  if (score < 90) return "bg-emerald-500";
  return "bg-emerald-700";
}

function renderRules(password) {
  rulesList.innerHTML = "";

  RULES.forEach((rule) => {
    const met = rule.check(password);
    const li = document.createElement("li");
    li.className = `rule-item flex items-center gap-2 p-2 rounded-lg border ${met ? "met border-emerald-100 bg-emerald-50" : "unmet border-slate-100 bg-slate-50"}`;
    li.innerHTML = `
      <svg class="w-4 h-4 ${met ? "text-emerald-500" : "text-slate-300"}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        ${met ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>' : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>'}
      </svg>
      <span class="text-xs font-medium">${rule.label}</span>
    `;
    rulesList.appendChild(li);
  });
}

function analyze() {
  const password = passwordInput.value;
  currentPassword = password;

  if (!password) {
    scoreText.textContent = "0/100";
    scoreText.className = "text-sm font-mono font-bold text-slate-600";
    scoreBar.className = "h-full bg-slate-200 rounded-full w-0 transition-all duration-300";
    scoreBar.style.width = "0%";
    strengthLabel.textContent = "Şifre giriniz";
    strengthLabel.className = "text-xs font-semibold uppercase tracking-wider text-slate-400";
    btnCopy.classList.add("hidden");
    renderRules("");
    return;
  }

  const score = calculateScore(password);
  const strength = getStrengthLabel(score);
  const barColor = getBarColor(score);

  scoreText.textContent = `${score}/100`;
  scoreText.className = `text-sm font-mono font-bold ${strength.color}`;
  scoreBar.className = `h-full ${barColor} rounded-full w-0 transition-all duration-300`;
  scoreBar.style.width = `${score}%`;
  strengthLabel.textContent = strength.label;
  strengthLabel.className = `text-xs font-semibold uppercase tracking-wider ${strength.color}`;
  btnCopy.classList.remove("hidden");

  renderRules(password);
}

// Şifre göster/gizle
btnToggle.addEventListener("click", () => {
  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";
  btnToggle.innerHTML = isPassword
    ? `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.243M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 7.823M7.011 7.011a1 1 0 10-1.414-1.414l-3.29 3.29m7.532 7.532l-3.29-3.29m3.29 6.704L3 17.59m13-11l3.59-3.59m0 0A9.953 9.953 0 0012 5c-4.478 0-8.268 2.943-9.543 7a10.025 10.025 0 004.132 7.823"></path></svg>`
    : `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.482 7.925 7.584 5.003 12 5c4.417 0 8.52 2.923 9.562 7M2.458 12c1.004 4.041 5.099 6.958 9.562 7 1.042 0 2.01-.125 2.986-.352M12 18l-.002-.028M12 6l.002-.028"></path></svg>`;
});

// Kopyala
btnCopy.addEventListener("click", () => {
  if (!currentPassword) return;
  navigator.clipboard.writeText(currentPassword).then(() => {
    const original = btnCopy.textContent;
    btnCopy.textContent = "Kopyalandı!";
    btnCopy.classList.add("text-emerald-600");
    setTimeout(() => {
      btnCopy.textContent = original;
      btnCopy.classList.remove("text-emerald-600");
    }, 1200);
  });
});

// Olaylar
passwordInput.addEventListener("input", analyze);

// Başlangıç
analyze();