// Day 19 - Bahşiş Hesaplayıcı
// Hesap tutarı, bahşiş yüzdesi ve kişi sayısına göre toplam ve kişi başına tutar hesaplar.

const billAmountInput = document.getElementById("bill-amount");
const customTipInput = document.getElementById("custom-tip");
const peopleCountInput = document.getElementById("people-count");
const tipBtns = document.querySelectorAll(".tip-btn");
const resultCard = document.getElementById("result-card");
const tipAmountEl = document.getElementById("tip-amount");
const totalAmountEl = document.getElementById("total-amount");
const perPersonEl = document.getElementById("per-person");

// Durum
let state = {
  billAmount: 0,
  tipPercent: 15,
  peopleCount: 1,
};

function formatCurrency(value) {
  return value.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " ₺";
}

function calculate() {
  const bill = parseFloat(billAmountInput.value) || 0;
  const tipPercent = state.tipPercent;
  const people = parseInt(peopleCountInput.value) || 1;

  const tipAmount = bill * (tipPercent / 100);
  const totalAmount = bill + tipAmount;
  const perPerson = totalAmount / people;

  tipAmountEl.textContent = formatCurrency(tipAmount);
  totalAmountEl.textContent = formatCurrency(totalAmount);
  perPersonEl.textContent = formatCurrency(perPerson);

  resultCard.classList.remove("hidden");
}

function setTipPercent(percent) {
  state.tipPercent = percent;
  tipBtns.forEach((btn) => {
    const p = parseInt(btn.dataset.tip, 10);
    if (p === percent) {
      btn.classList.remove("bg-white", "text-slate-600", "border", "border-slate-200", "hover:bg-slate-50");
      btn.classList.add("bg-indigo-600", "text-white", "shadow-sm");
    } else {
      btn.classList.remove("bg-indigo-600", "text-white", "shadow-sm");
      btn.classList.add("bg-white", "text-slate-600", "border", "border-slate-200", "hover:bg-slate-50");
    }
  });
  customTipInput.value = "";
  calculate();
}

// Olaylar
[billAmountInput, peopleCountInput].forEach((el) => {
  el.addEventListener("input", calculate);
});

customTipInput.addEventListener("input", (e) => {
  const val = parseFloat(e.target.value);
  if (!isNaN(val) && val >= 0 && val <= 100) {
    state.tipPercent = val;
    tipBtns.forEach((btn) => {
      btn.classList.remove("bg-indigo-600", "text-white", "shadow-sm");
      btn.classList.add("bg-white", "text-slate-600", "border", "border-slate-200", "hover:bg-slate-50");
    });
    calculate();
  }
});

tipBtns.forEach((btn) => {
  btn.addEventListener("click", () => setTipPercent(parseInt(btn.dataset.tip, 10)));
});

// Başlangıç
setTipPercent(15);
calculate();