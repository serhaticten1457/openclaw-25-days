// Day 11 - Kronometre
// Başlat/durdur, tur kayıtları, sıfırla, çeyrek saniyelik hassasiyet

const displayEl = document.getElementById("display");
const stateLabelEl = document.getElementById("state-label");
const progressRing = document.getElementById("progress-ring");
const btnStart = document.getElementById("btn-start");
const btnLap = document.getElementById("btn-lap");
const btnReset = document.getElementById("btn-reset");
const lapList = document.getElementById("lap-list");
const emptyLaps = document.getElementById("empty-laps");

// CIRCUMFERENCE = 2 * PI * 85 ≈ 534.07
const CIRCUMFERENCE = 534.07;

// Durum
let state = {
  isRunning: false,
  startTime: null, // performance.now() reference
  elapsed: 0, // toplam geçen süre (ms) durdurulduğunda
  laps: [], // { id, time, label }
  lapCounter: 0,
  animationFrame: null,
};

// Format: MM:SS.t
function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const tenths = Math.floor((ms % 1000) / 100);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${tenths}`;
}

function updateDisplay() {
  const nowMs = state.isRunning
    ? state.elapsed + (performance.now() - state.startTime)
    : state.elapsed;

  displayEl.textContent = formatTime(nowMs);

  // Progress ring (her 10 saniyede bir döngü, sadece görsel)
  const cycle = nowMs % 10000;
  const offset = CIRCUMFERENCE - (cycle / 10000) * CIRCUMFERENCE;
  progressRing.style.strokeDashoffset = offset;

  stateLabelEl.textContent = state.isRunning ? "Çalışıyor" : "Durduruldu";
  stateLabelEl.className = state.isRunning
    ? "text-xs font-semibold text-emerald-400 uppercase tracking-wider mt-1"
    : "text-xs font-semibold text-indigo-400 uppercase tracking-wider mt-1";
}

function start() {
  if (state.isRunning) return;
  state.isRunning = true;
  state.startTime = performance.now();
  btnStart.textContent = "Durdur";
  btnStart.classList.replace("bg-indigo-600", "bg-rose-600");
  btnStart.classList.replace("hover:bg-indigo-500", "hover:bg-rose-500");
  btnLap.disabled = false;
  btnLap.classList.replace("bg-slate-800", "bg-indigo-600");
  btnLap.classList.replace("text-slate-300", "text-white");
  btnLap.classList.replace("border-slate-700", "border-indigo-600");
  btnLap.classList.replace("hover:bg-slate-700", "hover:bg-indigo-700");
  requestAnimationFrame(renderLoop);
}

function pause() {
  if (!state.isRunning) return;
  state.elapsed += performance.now() - state.startTime;
  state.startTime = null;
  state.isRunning = false;
  btnStart.textContent = "Başlat";
  btnStart.classList.replace("bg-rose-600", "bg-indigo-600");
  btnStart.classList.replace("hover:bg-rose-500", "hover:bg-indigo-500");
  cancelAnimationFrame(state.animationFrame);
  state.animationFrame = null;
  updateDisplay();
}

function reset() {
  pause();
  state.elapsed = 0;
  state.laps = [];
  state.lapCounter = 0;
  renderLaps();
  updateDisplay();
}

function addLap() {
  if (!state.isRunning) return;
  const nowMs = state.elapsed + (performance.now() - state.startTime);
  state.lapCounter++;
  state.laps.unshift({
    id: state.lapCounter,
    time: nowMs,
    label: `Tur ${state.lapCounter}`,
  });
  renderLaps();
}

function renderLaps() {
  lapList.innerHTML = "";

  if (state.laps.length === 0) {
    emptyLaps.classList.remove("hidden");
    return;
  }
  emptyLaps.classList.add("hidden");

  state.laps.forEach((lap) => {
    const el = document.createElement("div");
    el.className = "lap-item flex justify-between items-center p-3 rounded-xl border border-slate-800 bg-slate-800/50";
    el.innerHTML = `
      <span class="text-sm font-mono text-slate-300">${lap.label}</span>
      <span class="text-sm font-mono text-indigo-400">${formatTime(lap.time)}</span>
    `;
    lapList.appendChild(el);
  });
}

function renderLoop() {
  if (!state.isRunning) return;
  updateDisplay();
  state.animationFrame = requestAnimationFrame(renderLoop);
}

// Olaylar
btnStart.addEventListener("click", () => {
  if (state.isRunning) pause();
  else start();
});

btnLap.addEventListener("click", addLap);

btnReset.addEventListener("click", reset);

// Başlangıç
updateDisplay();