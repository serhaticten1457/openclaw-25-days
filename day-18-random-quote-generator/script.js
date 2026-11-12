// Day 18 - Rastgele Alıntı Üreticisi
// Kategorilere ayrılmış alıntılar, rastgele seçme, kopyalama, filtreleme. Harici API yok.

const quoteText = document.getElementById("quote-text");
const quoteAuthor = document.getElementById("quote-author");
const quoteCategory = document.getElementById("quote-category");
const btnNew = document.getElementById("btn-new");
const btnCopy = document.getElementById("btn-copy");
const catBtns = document.querySelectorAll(".cat-btn");

// Alıntı veritabanı (kategori, metin, yazar)
const QUOTES = [
  {
    id: 1,
    text: "Başlamanın yolu, konuşmayı bırakıp işe koyulmaktır.",
    author: "Walt Disney",
    category: "motivation",
  },
  {
    id: 2,
    text: "Hayallerinizin peşinden koşun, onlar sizi gerçeklikte bulur.",
    author: "Bilinmez",
    category: "motivation",
  },
  {
    id: 3,
    text: "Başarı, son nokta değil; başarısızlık da yok olma değil. Önemli olan devam etmek."

    ,
    author: "Winston Churchill",
    category: "success",
  },
  {
    id: 4,
    text: "Yapabileceğinize inanıyorsanız, yarım yolunu katettiniz demektir.",
    author: "Theodore Roosevelt",
    category: "motivation",
  },
  {
    id: 5,
    text: "Tek tek yapabileceğiniz şeyler sınırlıdır, birliktekleri ise sonsuzdur.",
    author: "Helen Keller",
    category: "success",
  },
  {
    id: 6,
    text: "Bilgi gücüdür.",
    author: "Francis Bacon",
    category: "wisdom",
  },
  {
    id: 7,
    text: "Hayat, size ne yönettiğiyle değil, size yaşadığınızla ölçülür.",
    author: "Bilinmez",
    category: "wisdom",
  },
  {
    id: 8,
    text: "Bugününüz, yarının için hazırladığınız temelidir.",
    author: "Bilinmez",
    category: "life",
  },
  {
    id: 9,
    text: "Gücünüz, düşüncelerinizden kaynaklanır.",
    author: "Bilinmez",
    category: "wisdom",
  },
  {
    id: 10,
    text: "Her sabah yeni bir başlangıçtır.",
    author: "Bilinmez",
    category: "life",
  },
  {
    id: 11,
    text: "Risksiz bir hayat, yaşamın tadını çıkarmamanız demektir.",
    author: "Bilinmez",
    category: "motivation",
  },
  {
    id: 12,
    text: "Küçük adımlar, büyük değişimler yaratır.",
    author: "Bilinmez",
    category: "success",
  },
];

let currentCategory = "all"; // all | motivation | success | wisdom | life
let currentQuote = null;

// Rastgele alıntı seç (kategoriye göre filtreli)
function getRandomQuote() {
  const filtered =
    currentCategory === "all"
      ? QUOTES
      : QUOTES.filter((q) => q.category === currentCategory);

  const index = Math.floor(Math.random() * filtered.length);
  return filtered[index];
}

// Alıntıyı render et (basit fade efektli)
function renderQuote() {
  currentQuote = getRandomQuote();

  // Fade out
  quoteText.classList.add("fade-out");
  quoteAuthor.classList.add("fade-out");
  quoteCategory.classList.add("fade-out");

  setTimeout(() => {
    quoteText.textContent = `“${currentQuote.text}”`;
    quoteAuthor.textContent = `— ${currentQuote.author}`;
    quoteCategory.textContent = currentQuote.category.toUpperCase();

    // Fade in
    quoteText.classList.remove("fade-out");
    quoteAuthor.classList.remove("fade-out");
    quoteCategory.classList.remove("fade-out");
  }, 250);
}

function copyQuote() {
  if (!currentQuote) return;
  const text = `${currentQuote.text} — ${currentQuote.author}`;
  navigator.clipboard.writeText(text).then(() => {
    const original = btnCopy.textContent;
    btnCopy.textContent = "Kopyalandı!";
    btnCopy.classList.add("text-emerald-600");
    setTimeout(() => {
      btnCopy.textContent = original;
      btnCopy.classList.remove("text-emerald-600");
    }, 1200);
  });
}

// Olaylar
btnNew.addEventListener("click", renderQuote);
btnCopy.addEventListener("click", copyQuote);

catBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    catBtns.forEach((b) => {
      b.classList.remove("bg-indigo-600", "text-white", "shadow-sm");
      b.classList.add("bg-white", "text-slate-600", "border", "border-slate-200");
    });
    btn.classList.remove("bg-white", "text-slate-600", "border", "border-slate-200");
    btn.classList.add("bg-indigo-600", "text-white", "shadow-sm");
    currentCategory = btn.dataset.category;
    renderQuote();
  });
});

// Başlangıç
renderQuote();