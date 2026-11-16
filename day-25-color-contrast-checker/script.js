// Day 25 - Renk Kontrast Denetleyici
// WCAG 2.1 kontrast oranı hesaplar. Harici bağımlılık yok.

const fgColorInput = document.getElementById("fg-color");
const bgColorInput = document.getElementById("bg-color");
const fgHexInput = document.getElementById("fg-hex");
const bgHexInput = document.getElementById("bg-hex");
const contrastCard = document.getElementById("contrast-card");
const contrastRatioEl = document.getElementById("contrast-ratio");
const contrastLabelEl = document.getElementById("contrast-label");
const aaNormalEl = document.getElementById("aa-normal");
const aaLargeEl = document.getElementById("aa-large");
const aaaNormalEl = document.getElementById("aaa-normal");
const aaaLargeEl = document.getElementById("aaa-large");
const fgPreview = document.getElementById("fg-preview");
const bgPreview = document.getElementById("bg-preview");

// Hex → RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : null;
}

// Renk kanalının lineerleştirilmesi
function linearize(channel) {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

// Relatif parlaklık
function getLuminance(r, g, b) {
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

// Kontrast oranı
function getContrastRatio(color1, color2) {
  const lum1 = getLuminance(color1.r, color1.g, color1.b);
  const lum2 = getLuminance(color2.r, color2.g, color2.b);
  const light = Math.max(lum1, lum2);
  const dark = Math.min(lum1, lum2);
  return (light + 0.05) / (dark + 0.05);
}

// WCAG geçerlilik
function checkWCAG(ratio) {
  return {
    aaNormal: ratio >= 4.5,    // Normal metin
    aaLarge: ratio >= 3.0,     // Büyük metin (18pt+ veya 14pt+ kalın)
    aaaNormal: ratio >= 7.0,
    aaaLarge: ratio >= 4.5,
  };
}

function formatRatio(ratio) {
  return ratio.toFixed(2);
}

function setStatus(el, passed) {
  el.textContent = passed ? "Geçer" : "Geçmez";
  el.className = `text-xs font-mono font-bold ${passed ? "text-emerald-600" : "text-rose-600"}`;
}

function getLabel(ratio) {
  if (ratio < 3) return { label: "Çok Düşük", color: "text-rose-600" };
  if (ratio < 4.5) return { label: "Düşük", color: "text-orange-500" };
  if (ratio < 7) return { label: "Orta", color: "text-amber-500" };
  return { label: "Yüksek", color: "text-emerald-700" };
}

function analyze() {
  const fg = hexToRgb(fgHexInput.value);
  const bg = hexToRgb(bgHexInput.value);

  if (!fg || !bg) {
    contrastCard.classList.add("hidden");
    return;
  }

  const ratio = getContrastRatio(fg, bg);
  const wcag = checkWCAG(ratio);
  const label = getLabel(ratio);

  contrastRatioEl.textContent = `${formatRatio(ratio)}:1`;
  contrastLabelEl.textContent = label.label;
  contrastLabelEl.className = `text-lg font-bold ${label.color}`;

  setStatus(aaNormalEl, wcag.aaNormal);
  setStatus(aaLargeEl, wcag.aaLarge);
  setStatus(aaaNormalEl, wcag.aaaNormal);
  setStatus(aaaLargeEl, wcag.aaaLarge);

  // Önizleme renkleri
  fgPreview.style.backgroundColor = fgHexInput.value;
  bgPreview.style.backgroundColor = bgHexInput.value;

  // Önizleme metin rengi (okunabilirlik için)
  const fgLum = getLuminance(fg.r, fg.g, fg.b);
  const bgLum = getLuminance(bg.r, bg.g, bg.b);
  fgPreview.querySelector("span").style.color =
    fgLum > 0.5 ? "#1f2937" : "#ffffff";
  bgPreview.querySelector("span").style.color =
    bgLum > 0.5 ? "#1f2937" : "#ffffff";

  contrastCard.classList.remove("hidden");
}

function syncColorInput(input, colorInput, otherInput) {
  input.addEventListener("input", () => {
    const val = input.value.toUpperCase();
    if (/^#[0-9A-F]{6}$/.test(val)) {
      colorInput.value = val;
      otherInput.dispatchEvent(new Event("input"));
    }
  });

  colorInput.addEventListener("input", () => {
    input.value = colorInput.value.toUpperCase();
    otherInput.dispatchEvent(new Event("input"));
  });
}

// Olaylar
syncColorInput(fgHexInput, fgColorInput, bgHexInput);
syncColorInput(bgHexInput, bgColorInput, fgHexInput);

// Başlangıç
analyze();