// Day 02 - Renk Paleti Üreticisi
// Tüm mantık tek dosyada, harici bağımlılık yok (Tailwind CDN hariç)

// DOM elementleri
const paletteContainer = document.getElementById("palette");
const colorList = document.getElementById("color-list");
const baseColorInput = document.getElementById("base-color");
const modeBtns = document.querySelectorAll(".mode-btn");
const countSlider = document.getElementById("count-slider");
const countVal = document.getElementById("count-val");
const btnRandom = document.getElementById("btn-random");
const btnCopyAll = document.getElementById("btn-copy-all");
const toast = document.getElementById("copy-toast");
const paletteInfo = document.getElementById("palette-info");

// Durum
let state = {
  mode: "random", // random | monochromatic | analogous | complementary
  baseColor: "#6366f1",
  count: 5,
  colors: [],
};

// --- Renk yardımcıları ---

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

function rgbToHsl(r, g, b) {
  (r /= 255), (g /= 255), (b /= 255);
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

function getLuminance(r, g, b) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastColor(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return "#000000";
  const lum = getLuminance(rgb.r, rgb.g, rgb.b);
  return lum > 0.5 ? "#000000" : "#ffffff";
}

// --- Palet üreticiler ---

function generateRandomColors(count) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    colors.push(rgbToHex(r, g, b));
  }
  return colors;
}

function generateMonochromatic(baseHex, count) {
  const rgb = hexToRgb(baseHex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const colors = [];
  const step = 100 / (count + 1);
  for (let i = 1; i <= count; i++) {
    const lightness = Math.min(100, Math.max(0, hsl.l + (i - (count + 1) / 2) * step * 1.5));
    const newRgb = hslToRgb(hsl.h, hsl.s, lightness);
    colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }
  return colors;
}

function generateAnalogous(baseHex, count) {
  const rgb = hexToRgb(baseHex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const colors = [];
  const step = 60 / (count - 1);
  const start = hsl.h - 30;
  for (let i = 0; i < count; i++) {
    const h = ((start + i * step) % 360 + 360) % 360;
    const newRgb = hslToRgb(h, hsl.s, hsl.l);
    colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }
  return colors;
}

function generateComplementary(baseHex, count) {
  const rgb = hexToRgb(baseHex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const complementH = ((hsl.h + 180) % 360 + 360) % 360;
  const colors = [baseHex];

  // İkili renkler: base ve complement arasındaki aralıktan adım adım
  const steps = Math.max(1, count - 1);
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const h = hsl.h + (complementH - hsl.h) * t;
    const newRgb = hslToRgb(((h % 360) + 360) % 360, hsl.s, hsl.l);
    colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }

  // Eğer count 1 ise sadece base döner
  return colors.slice(0, count);
}

function generatePalette() {
  switch (state.mode) {
    case "monochromatic":
      state.colors = generateMonochromatic(state.baseColor, state.count);
      break;
    case "analogous":
      state.colors = generateAnalogous(state.baseColor, state.count);
      break;
    case "complementary":
      state.colors = generateComplementary(state.baseColor, state.count);
      break;
    default:
      state.colors = generateRandomColors(state.count);
      break;
  }
  render();
}

// --- Render ---

function render() {
  // Palet önizleme
  paletteContainer.innerHTML = "";
  state.colors.forEach((hex, i) => {
    const card = document.createElement("div");
    card.className = "color-card bg-white rounded-xl overflow-hidden flex flex-col h-full";
    card.innerHTML = `
      <div class="swatch h-full" style="background-color: ${hex}"></div>
      <div class="p-3">
        <div class="flex justify-between items-baseline mb-1">
          <span class="text-xs font-mono font-bold text-slate-800">${hex.toUpperCase()}</span>
          <button class="copy-btn p-1.5 rounded bg-slate-200 hover:bg-indigo-500 text-slate-600 hover:text-white transition-colors" title="Kopyala" data-hex="${hex}">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
          </button>
        </div>
        <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div class="h-full bg-slate-300" style="width: ${(i / Math.max(state.colors.length - 1, 1)) * 100}%"></div>
        </div>
      </div>
    `;
    paletteContainer.appendChild(card);
  });

  // Renk listesi
  colorList.innerHTML = "";
  state.colors.forEach((hex, i) => {
    const contrast = getContrastColor(hex);
    const item = document.createElement("div");
    item.className = "flex items-center justify-between p-3 rounded-lg bg-slate-700 border border-slate-600";
    item.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg" style="background-color: ${hex}"></div>
        <span class="text-sm font-mono text-slate-200">${hex.toUpperCase()}</span>
      </div>
      <button class="copy-btn p-2 rounded bg-slate-600 hover:bg-indigo-500 text-white transition-colors" title="Kopyala" data-hex="${hex}">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
      </button>
    `;
    colorList.appendChild(item);
  });

  // Bilgiyi güncelle
  paletteInfo.textContent = `${state.colors.length} renk · ${state.mode}`;

  // Kopyala butonları
  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const hex = btn.dataset.hex;
      copyToClipboard(hex);
      btn.classList.add("ring-2", "ring-indigo-500");
      setTimeout(() => btn.classList.remove("ring-2", "ring-indigo-500"), 600);
    });
  });
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast();
    // Tüm kartlara kısa bir flashed efekt ver
    document.querySelectorAll(".color-card").forEach((c) => c.classList.add("copied"));
    setTimeout(() => document.querySelectorAll(".color-card").forEach((c) => c.classList.remove("copied")), 400);
  });
}

function showToast() {
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 2000);
}

// --- Olaylar ---

btnRandom.addEventListener("click", () => {
  generatePalette();
});

baseColorInput.addEventListener("input", (e) => {
  state.baseColor = e.target.value;
  if (state.mode !== "random") {
    generatePalette();
  }
});

modeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    modeBtns.forEach((b) => {
      b.classList.remove("bg-indigo-600", "text-white", "shadow-sm");
      b.classList.add("bg-slate-700", "text-slate-300", "border", "border-slate-600");
    });
    btn.classList.remove("bg-slate-700", "text-slate-300", "border", "border-slate-600");
    btn.classList.add("bg-indigo-600", "text-white", "shadow-sm");
    state.mode = btn.dataset.mode;
    if (state.mode === "random") {
      state.colors = generateRandomColors(state.count);
    } else {
      generatePalette();
    }
  });
});

countSlider.addEventListener("input", (e) => {
  state.count = parseInt(e.target.value);
  countVal.textContent = state.count;
  generatePalette();
});

btnCopyAll.addEventListener("click", () => {
  const allHex = state.colors.map((c) => c.toUpperCase()).join("\n");
  navigator.clipboard.writeText(allHex).then(showToast);
});

// Başlangıçta paleti oluştur
generatePalette();