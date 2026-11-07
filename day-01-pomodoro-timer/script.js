// Day 01 - Pomodoro Zamanlayıcısı
// Tüm mantık tek dosyada, harici bağımlılık yok (Tailwind CDN hariç)

const timerDisplay = document.getElementById("timer");
const sessionLabel = document.getElementById("session-label");
const progressCircle = document.getElementById("progress-circle");
const btnStart = document.getElementById("btn-start");
const btnReset = document.getElementById("btn-reset");
const modeBtns = document.querySelectorAll(".mode-btn");
const inputs = {
  work: document.getElementById("input-work"),
  short: document.getElementById("input-short"),
  long: document.getElementById("input-long"),
};
const cycleCountDisplay = document.getElementById("cycle-count");

// Ayarlar (dakika)
let settings = {
  work: 25,
  short: 5,
  long: 15,
};

// Durum
let state = {
  mode: "work", // work | short | long
  timeLeft: settings.work * 60,
  totalTime: settings.work * 60,
  isRunning: false,
  intervalId: null,
  cycles: 0,
};

// CİRCUMFERENCE = 2 * PI * r = 2 * PI * 80 ≈ 502.65
const CIRCUMFERENCE = 502.65;

// Başlangıçta ekranı güncelle
updateDisplay();

// Mod seçici tıklamaları
modeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const mode = btn.id.replace("mode-", "");
    setMode(mode);
  });
});

// Başlat / Durdur
btnStart.addEventListener("click", () => {
  if (state.isRunning) {
    pause();
  } else {
    start();
  }
});

// Sıfırla
btnReset.addEventListener("click", () => {
  pause();
  state.timeLeft = state.totalTime;
  state.cycles = 0;
  cycleCountDisplay.textContent = "0 tamamlanan tur";
  updateDisplay();
  btnStart.textContent = "Başlat";
  btnStart.classList.replace("bg-indigo-600", "bg-indigo-600");
});

// Süre girişleri
inputs.work.addEventListener("change", (e) => {
  settings.work = Math.max(1, parseInt(e.target.value) || 1);
  if (state.mode === "work" && !state.isRunning) {
    state.totalTime = settings.work * 60;
    state.timeLeft = state.totalTime;
    updateDisplay();
  }
});
inputs.short.addEventListener("change", (e) => {
  settings.short = Math.max(1, parseInt(e.target.value) || 1);
});
inputs.long.addEventListener("change", (e) => {
  settings.long = Math.max(1, parseInt(e.target.value) || 1);
});

function setMode(mode) {
  if (state.isRunning) return;

  state.mode = mode;
  state.timeLeft =
    mode === "work"
      ? settings.work * 60
      : mode === "short"
      ? settings.short * 60
      : settings.long * 60;
  state.totalTime = state.timeLeft;

  // Buton stilleri
  modeBtns.forEach((b) => {
    const bMode = b.id.replace("mode-", "");
    b.classList.remove("bg-indigo-600", "text-white", "shadow-sm");
    b.classList.add("bg-white", "text-slate-600", "border", "border-slate-200");
    if (bMode === mode) {
      b.classList.remove("bg-white", "text-slate-600", "border", "border-slate-200");
      b.classList.add("bg-indigo-600", "text-white", "shadow-sm");
    }
  });

  sessionLabel.textContent =
    mode === "work"
      ? "Çalışma Süresi"
      : mode === "short"
      ? "Kısa Mola"
      : "Uzun Mola";

  updateDisplay();
}

function start() {
  if (state.timeLeft <= 0) return;
  state.isRunning = true;
  btnStart.textContent = "Durdur";
  btnStart.classList.replace("bg-indigo-600", "bg-red-600");
  btnStart.classList.add("hover:bg-red-700");

  state.intervalId = setInterval(() => {
    state.timeLeft--;
    updateDisplay();

    if (state.timeLeft <= 0) {
      completeSession();
    }
  }, 1000);
}

function pause() {
  state.isRunning = false;
  clearInterval(state.intervalId);
  state.intervalId = null;
  btnStart.textContent = "Başlat";
  btnStart.classList.replace("bg-red-600", "bg-indigo-600");
  btnStart.classList.remove("hover:bg-red-700");
}

function completeSession() {
  pause();

  if (state.mode === "work") {
    state.cycles++;
    cycleCountDisplay.textContent = `${state.cycles} tamamlanan tur`;

    // 4 tur sonra uzun mola, ardından kısa mola
    if (state.cycles % 4 === 0) {
      setMode("long");
    } else {
      setMode("short");
    }
  } else {
    setMode("work");
  }

  // Tarayıcı bildirimi (izin varsa)
  if (Notification.permission === "granted") {
    new Notification("Pomodoro Süresi Doldu!", {
      body: sessionLabel.textContent,
      icon: "https://cdn-icons-png.flaticon.com/512/2444/2444803.png",
    });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission();
  }
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function updateDisplay() {
  timerDisplay.textContent = formatTime(state.timeLeft);

  const offset = CIRCUMFERENCE - (state.timeLeft / state.totalTime) * CIRCUMFERENCE;
  progressCircle.style.strokeDashoffset = offset;

  // Sayfa başlığı
  document.title = `Pomodoro | ${formatTime(state.timeLeft)}`;
}

// Sayfa görünmezken zamanlayıcıyı durdurma (isteğe bağlı iyileştirme)
window.addEventListener("beforeunload", () => {
  if (state.isRunning) {
    pause();
  }
});