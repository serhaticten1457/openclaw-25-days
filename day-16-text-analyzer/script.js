// Day 16 - Metin Analizi
// Karakter, kelime, cümle, paragraf, okuma süresi ve sık kullanılan kelime analizi.

const inputText = document.getElementById("input-text");
const btnClear = document.getElementById("btn-clear");
const btnLoadSample = document.getElementById("btn-load-sample");
const btnCopy = document.getElementById("btn-copy");
const wordList = document.getElementById("word-list");

// Değer elementleri
const vals = {
  chars: document.getElementById("val-chars"),
  charsNs: document.getElementById("val-chars-ns"),
  words: document.getElementById("val-words"),
  sentences: document.getElementById("val-sentences"),
  paragraphs: document.getElementById("val-paragraphs"),
  reading: document.getElementById("val-reading"),
};

// Örnek metin
const SAMPLE_TEXT = `Yapay zeka, insan zekasının bazı özelliklerini taklit edebilen bilgisayar sistemlerinin geliştirilmesiyle ilgilenen bilgisayar bilimi dalıdır. Öğrenme, raciocínio, problem çözme, algılama ve dil anlama gibi becerileri içerir.

Günümüzde yapay zeka; sağlık, finans, ulaşım, eğlence ve üretim gibi birçok alanda kullanılmaktadır. Akıllı asistanlardan öneri sistemlerine, otomatik sürüşlü arabalardan tıbbi tanıya kadar geniş bir uygulama yelkazene sahiptir.

Bu metin, metin analiz aracının karakter, kelime, cümle ve paragraf sayma yeteneklerini test etmek için hazırlanmıştır.`;

// Analiz fonksiyonu
function analyze(text) {
  if (!text || text.trim() === "") {
    return {
      chars: 0,
      charsNoSpaces: 0,
      words: 0,
      sentences: 0,
      paragraphs: 0,
      readingTime: "0 dakika",
      topWords: [],
    };
  }

  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;

  // Kelime sayısı (boşluklara göre böl, boş dizeleri filtrele)
  const words = text.split(/\s+/).filter((w) => w.length > 0).length;

  // Cümle sayısı (. ! ? ile bitenler)
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;

  // Paragraf sayısı (iki veya daha fazla satır sonu ile ayrılan bloklar)
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;

  // Okuma süresi (ortalama dakikada 200 kelime)
  const minutes = Math.ceil(words / 200);
  const readingTime = minutes < 1 ? "1 dakika" : `${minutes} dakika`;

  // En sık kelimeler (basit temizleme + sıklık)
  const wordFreq = {};
  const cleaned = text.toLowerCase().replace(/[^\w\sğüşıçö]/g, "");
  cleaned.split(/\s+/).forEach((w) => {
    if (w.length > 2) {
      wordFreq[w] = (wordFreq[w] || 0) + 1;
    }
  });

  const topWords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));

  return {
    chars,
    charsNoSpaces,
    words,
    sentences,
    paragraphs,
    readingTime,
    topWords,
  };
}

// Render
function render() {
  const text = inputText.value;
  const result = analyze(text);

  vals.chars.textContent = result.chars.toLocaleString("tr-TR");
  vals.charsNs.textContent = result.charsNoSpaces.toLocaleString("tr-TR");
  vals.words.textContent = result.words.toLocaleString("tr-TR");
  vals.sentences.textContent = result.sentences.toLocaleString("tr-TR");
  vals.paragraphs.textContent = result.paragraphs.toLocaleString("tr-TR");
  vals.reading.textContent = result.readingTime;

  // Kelime listesi
  wordList.innerHTML = "";
  if (result.topWords.length === 0) {
    wordList.innerHTML = `<div class="py-4 text-center text-slate-400 text-sm">Henüz metin girilmedi.</div>`;
    return;
  }

  result.topWords.forEach(({ word, count }) => {
    const barWidth = Math.min(100, (count / result.topWords[0].count) * 100);
    const el = document.createElement("div");
    el.className = "word-item flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50";
    el.innerHTML = `
      <span class="text-sm font-medium text-slate-800">${word}</span>
      <div class="flex items-center gap-2">
        <span class="text-[10px] font-bold text-indigo-600">${count}x</span>
        <div class="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div class="h-full bg-indigo-400" style="width: ${barWidth}%"></div>
        </div>
      </div>
    `;
    wordList.appendChild(el);
  });
}

// Olaylar
inputText.addEventListener("input", render);

btnClear.addEventListener("click", () => {
  inputText.value = "";
  render();
});

btnLoadSample.addEventListener("click", () => {
  inputText.value = SAMPLE_TEXT;
  render();
});

btnCopy.addEventListener("click", () => {
  navigator.clipboard.writeText(inputText.value).then(() => {
    const original = btnCopy.textContent;
    btnCopy.textContent = "Kopyalandı!";
    btnCopy.classList.add("text-emerald-600");
    setTimeout(() => {
      btnCopy.textContent = original;
      btnCopy.classList.remove("text-emerald-600");
    }, 1200);
  });
});

// Başlangıç
render();