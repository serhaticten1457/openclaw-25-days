// Day 05 - Birim Dönüştürücü
// Uzunluk, ağırlık ve sıcaklık dönüşümü. Hiçbir harici API'ye bağımsız değil.

const categoryBtns = document.querySelectorAll(".cat-btn");
const inputValue = document.getElementById("input-value");
const fromUnitSelect = document.getElementById("from-unit");
const toUnitSelect = document.getElementById("to-unit");
const resultValue = document.getElementById("result-value");
const resultUnit = document.getElementById("result-unit");
const resultText = document.getElementById("result-text");
const btnSwap = document.getElementById("btn-swap");
const quickRef = document.getElementById("quick-ref");

// Birim tanımları
// Uzunluk: baz metredir (m)
const LENGTH_UNITS = {
  m: { name: "Metre", factor: 1 },
  km: { name: "Kilometre", factor: 1000 },
  cm: { name: "Santimetre", factor: 0.01 },
  mm: { name: "Milimetre", factor: 0.001 },
  mile: { name: "Mil", factor: 1609.344 },
  yard: { name: "Yarda", factor: 0.9144 },
  ft: { name: "Fit", factor: 0.3048 },
  inch: { name: "İnç", factor: 0.0254 },
};

// Ağırlık: baz kilogram (kg)
const WEIGHT_UNITS = {
  kg: { name: "Kilogram", factor: 1 },
  g: { name: "Gram", factor: 0.001 },
  mg: { name: "Miligram", factor: 0.000001 },
  lb: { name: "Libre", factor: 0.45359237 },
  oz: { name: "Ons", factor: 0.0283495231 },
};

// Sıcaklık: özel dönüşüm (lineer değil)
const TEMP_UNITS = {
  c: { name: "Celsius" },
  f: { name: "Fahrenheit" },
  k: { name: "Kelvin" },
};

function tempToCelsius(value, from) {
  if (from === "c") return value;
  if (from === "f") return (value - 32) * (5 / 9);
  if (from === "k") return value - 273.15;
  return value;
}

function celsiusToTemp(value, to) {
  if (to === "c") return value;
  if (to === "f") return value * (9 / 5) + 32;
  if (to === "k") return value + 273.15;
  return value;
}

// Durum
let state = {
  category: "length", // length | weight | temperature
  units: LENGTH_UNITS,
};

// Arayüzü güncelle
function updateUnitsUI() {
  const units = state.units;
  const keys = Object.keys(units);

  fromUnitSelect.innerHTML = "";
  toUnitSelect.innerHTML = "";

  keys.forEach((key) => {
    const u = units[key];
    const opt1 = document.createElement("option");
    opt1.value = key;
    opt1.textContent = u.name;
    fromUnitSelect.appendChild(opt1);

    const opt2 = document.createElement("option");
    opt2.value = key;
    opt2.textContent = u.name;
    toUnitSelect.appendChild(opt2);
  });

  // Varsayılan olarak ilk ve ikinci birimi seç
  if (keys.length >= 2) {
    fromUnitSelect.value = keys[0];
    toUnitSelect.value = keys[1];
  }

  convert();
  renderQuickRef();
}

// Dönüştür
function convert() {
  const val = parseFloat(inputValue.value);
  if (isNaN(val)) {
    resultValue.textContent = "—";
    resultUnit.textContent = "";
    resultText.textContent = "Geçerli bir sayı girin.";
    return;
  }

  const from = fromUnitSelect.value;
  const to = toUnitSelect.value;
  let result;

  if (state.category === "temperature") {
    const c = tempToCelsius(val, from);
    result = celsiusToTemp(c, to);
  } else {
    const uFrom = state.units[from];
    const uTo = state.units[to];
    const inBase = val * uFrom.factor;
    result = inBase / uTo.factor;
  }

  resultValue.textContent = formatNumber(result);
  resultUnit.textContent = state.units[to].name;
  resultText.textContent = `${formatNumber(val)} ${state.units[from].name} = ${formatNumber(result)} ${state.units[to].name}`;
}

function formatNumber(n) {
  // İsteğe bağlı: fazla ondalık temizleme
  const rounded = Math.round(n * 1e6) / 1e6;
  return rounded % 1 === 0 ? rounded.toString() : rounded.toString();
}

// Hızlı referans (örnek dönüşümler)
function renderQuickRef() {
  const units = state.units;
  const keys = Object.keys(units);
  quickRef.innerHTML = "";

  // İlk birkaç birim için sabit örnek değerler
  const examples = [
    { from: keys[0], to: keys[Math.min(1, keys.length - 1)], val: 1 },
    { from: keys[Math.min(2, keys.length - 1)], to: keys[0], val: 10 },
  ];

  examples.forEach(({ from, to, val }) => {
    const uFrom = units[from];
    const uTo = units[to];
    let res;
    if (state.category === "temperature") {
      res = celsiusToTemp(tempToCelsius(val, from), to);
    } else {
      res = (val * uFrom.factor) / uTo.factor;
    }
    const item = document.createElement("div");
    item.className = "flex justify-between items-center px-3 py-2 rounded bg-slate-50 border border-slate-100";
    item.innerHTML = `
      <span class="font-medium text-slate-700">${formatNumber(val)} ${uFrom.name}</span>
      <span class="text-indigo-600 font-mono font-bold">→ ${formatNumber(res)} ${uTo.name}</span>
    `;
    quickRef.appendChild(item);
  });
}

// Olaylar
categoryBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    categoryBtns.forEach((b) => {
      b.classList.remove("bg-indigo-600", "text-white", "shadow-sm");
      b.classList.add("bg-white", "text-slate-600", "border", "border-slate-200");
    });
    btn.classList.remove("bg-white", "text-slate-600", "border", "border-slate-200");
    btn.classList.add("bg-indigo-600", "text-white", "shadow-sm");

    const cat = btn.dataset.category;
    state.category = cat;
    if (cat === "length") state.units = LENGTH_UNITS;
    else if (cat === "weight") state.units = WEIGHT_UNITS;
    else state.units = TEMP_UNITS;

    updateUnitsUI();
  });
});

inputValue.addEventListener("input", convert);
fromUnitSelect.addEventListener("change", convert);
toUnitSelect.addEventListener("change", convert);

btnSwap.addEventListener("click", () => {
  const from = fromUnitSelect.value;
  const to = toUnitSelect.value;
  fromUnitSelect.value = to;
  toUnitSelect.value = from;
  convert();
});

// Başlat
updateUnitsUI();