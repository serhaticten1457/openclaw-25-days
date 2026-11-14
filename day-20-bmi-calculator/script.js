// Day 20 - VKİ Hesaplayıcı
// Vücut kitle endeksi hesaplar, kategori ve aralık çubuğu gösterir.

const heightInput = document.getElementById("height");
const weightInput = document.getElementById("weight");
const btnCalculate = document.getElementById("btn-calculate");
const resultCard = document.getElementById("result-card");
const bmiValueEl = document.getElementById("bmi-value");
const bmiCategoryEl = document.getElementById("bmi-category");
const bmiDescriptionEl = document.getElementById("bmi-description");
const bmiBarEl = document.getElementById("bmi-bar");

// VKİ kategorileri (alt sınır, üst sınır, kategori, açıklama, renk, bar yüzdesi)
const CATEGORIES = [
  { min: 0, max: 16.0, label: "Ciddi Zayıf", desc: "Hemen sağlık profesyoneline danışın.", color: "text-rose-600", bar: "w-1/10" },
  { min: 16.0, max: 17.0, label: "Orta Derecede Zayıf", desc: "Diyetisyen tavsiyesi alınması önerilir.", color: "text-rose-500", bar: "w-2/10" },
  { min: 17.0, max: 18.5, label: "Hafif Zayıf", desc: "Biraz daha kilo almanız sağlıklı olabilir.", color: "text-amber-500", bar: "w-3/10" },
  { min: 18.5, max: 25.0, label: "Normal", desc: "Sağlıklı bir ağırlıktasınız.", color: "text-emerald-600", bar: "w-5/10" },
  { min: 25.0, max: 30.0, label: "Fazla Kilolu", desc: "Düzenli egzersiz ve dengeli beslenme önerilir.", color: "text-amber-600", bar: "w-7/10" },
  { min: 30.0, max: 35.0, label: "Obez (Sınıf I)", desc: "Sağlık uzmanına danışmanız önerilir.", color: "text-orange-600", bar: "w-8/10" },
  { min: 35.0, max: 40.0, label: "Obez (Sınıf II)", desc: "Tıbbi destek almanız önemlidir.", color: "text-rose-600", bar: "w-9/10" },
  { min: 40.0, max: 999, label: "Aşırı Obez (Sınıf III)", desc: "Acil tıbbi müdahale önerilir.", color: "text-rose-700", bar: "w-full" },
];

function getCategory(bmi) {
  return CATEGORIES.find((c) => bmi >= c.min && bmi < c.max) || CATEGORIES[CATEGORIES.length - 1];
}

function calculate() {
  const heightCm = parseFloat(heightInput.value);
  const weightKg = parseFloat(weightInput.value);

  if (!heightCm || heightCm <= 0 || !weightKg || weightKg <= 0) {
    resultCard.classList.add("hidden");
    return;
  }

  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  const rounded = Math.round(bmi * 10) / 10;

  const cat = getCategory(rounded);

  bmiValueEl.textContent = rounded.toFixed(1);
  bmiCategoryEl.textContent = cat.label;
  bmiCategoryEl.className = `text-xl font-bold ${cat.color}`;
  bmiDescriptionEl.textContent = cat.desc;
  bmiBarEl.className = `h-full bg-indigo-500 rounded-full transition-all duration-500 ${cat.bar}`;

  resultCard.classList.remove("hidden");
}

btnCalculate.addEventListener("click", calculate);

[heightInput, weightInput].forEach((el) => {
  el.addEventListener("input", () => {
    if (!el.value) {
      resultCard.classList.add("hidden");
    }
  });
});