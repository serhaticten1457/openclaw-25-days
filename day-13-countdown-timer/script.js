// Day 13 - Geri Sayım Zamanlayıcısı
// Hedef tarih seçimi, gün/saat/dakika/saniye geri sayım, bitişte bildirim.

const targetInput = document.getElementById("target-datetime");
const btnStart = document.getElementById("btn-start");
const btnReset = document.getElementById("btn-reset");
const displayEl = document.getElementById("display");
const progressRing = document.getElementById("progress-ring");
const valEls = {
  d: document.getElementById("val-d"),
  h: document.getElementById("val-h"),
  m: document.getElementById("val-m"),
  s: document.getElementById("val-s"),
};
const finishMessage = document.getElementById("finish-message");

// CIRCUMFERENCE = 2 * PI * 85 ≈ 534.07
const CIRCUMFERENCE = 534.07;

// Durum
let state = {
  targetDate: null,
  isRunning: false,
  intervalId: null,
  totalSeconds: 0,
};

// Varsayılan hedef: 7 gün sonra (şu an için boş, kullanıcı seçecek)

// Format: iki basamaklı
function pad(n) {
  return String(n).padStart(2, "0");
}

// Geri sayımı güncelle
function updateCountdown() {
  if (!state.targetDate || !state.isRunning) return;

  const now = Date.now();
  const diffMs = state.targetDate - now;

  if (diffMs <= 0) {
    // Bitti
    state.isRunning = false;
    clearInterval(state.intervalId);
    state.intervalId = null;

    valEls.d.textContent = "00";
    valEls.h.textContent = "00";
    valEls.m.textContent = "00";
    valEls.s.textContent = "00";
    displayEl.textContent = "00:00:00:00";
    progressRing.style.strokeDashoffset = 0;

    btnStart.textContent = "Başlat";
    btnStart.classList.replace("bg-rose-600", "bg-indigo-600");
    btnStart.classList.replace("hover:bg-rose-500", "hover:bg-indigo-500");

    finishMessage.classList.remove("hidden");

    // Tarayıcı bildirimi
    if (Notification.permission === "granted") {
      new Notification("Geri Sayım Bitti!", {
        body: "Hedef tarihe ulaşıldı.",
        icon: "https://cdn-icons-png.flaticon.com/512/2444/2444803.png",
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission();
    }

    return;
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  valEls.d.textContent = pad(days);
  valEls.h.textContent = pad(hours);
  valEls.m.textContent = pad(minutes);
  valEls.s.textContent = pad(seconds);

  displayEl.textContent = `${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  // Progress ring: toplam sürenin oranına göre (yaklaşık, sadece görsel)
  // totalSeconds'ı state'de tutuyoruz; oran = kalan / toplam
  const ratio = totalSeconds / state.totalSeconds;
  const offset = CIRCUMFERENCE - ratio * CIRCUMFERENCE;
  progressRing.style.strokeDashoffset = Math.max(0, offset);
}

function start() {
  if (!targetInput.value) {
    alert("Lütfen bir hedef tarih ve saat seçin.");
    targetInput.focus();
    return;
  }

  if (!state.isRunning) {
    const target = new Date(targetInput.value).getTime();
    if (isNaN(target)) {
      alert("Geçersiz tarih.");
      return;
    }

    state.targetDate = target;
    state.totalSeconds = Math.max(1, Math.floor((target - Date.now()) / 1000));
    state.isRunning = true;

    btnStart.textContent = "Durdur";
    btnStart.classList.replace("bg-indigo-600", "bg-rose-600");
    btnStart.classList.replace("hover:bg-indigo-500", "hover:bg-rose-500");

    finishMessage.classList.add("hidden");

    state.intervalId = setInterval(updateCountdown, 1000);
    updateCountdown();
  } else {
    state.isRunning = false;
    clearInterval(state.intervalId);
    state.intervalId = null;

    btnStart.textContent = "Başlat";
    btnStart.classList.replace("bg-rose-600", "bg-indigo-600");
    btnStart.classList.replace("hover:bg-rose-500", "hover:bg-indigo-500");
  }
}

function reset() {
  state.isRunning = false;
  clearInterval(state.intervalId);
  state.intervalId = null;
  state.targetDate = null;

  valEls.d.textContent = "00";
  valEls.h.textContent = "00";
  valEls.m.textContent = "00";
  valEls.s.textContent = "00";
  displayEl.textContent = "00:00:00:00";
  progressRing.style.strokeDashoffset = CIRCUMFERENCE;

  btnStart.textContent = "Başlat";
  btnStart.classList.replace("bg-rose-600", "bg-indigo-600");
  btnStart.classList.replace("hover:bg-rose-500", "hover:bg-indigo-500");

  finishMessage.classList.add("hidden");
}

// Olaylar
btnStart.addEventListener("click", start);
btnReset.addEventListener("click", reset);

// Tarih değiştiğinde durumunu sıfırla (yeni hedef)
targetInput.addEventListener("change", () => {
  if (!state.isRunning) {
    reset();
  }
});

// Başlangıç
reset();