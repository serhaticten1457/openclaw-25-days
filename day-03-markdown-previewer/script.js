// Day 03 - Markdown Önizleyici
// Canlı Markdown önizleme, HTML kopyalama, MD kopyalama

const editor = document.getElementById("editor");
const preview = document.getElementById("preview");
const btnCopyMd = document.getElementById("btn-copy-md");
const btnCopyHtml = document.getElementById("btn-copy-html");

// Başlangıç içeriği
const initialContent = `# Merhaba Dünya

Bu bir **Markdown** önizleyicisidir. Yazarken anındaönizlemeyi görebilirsiniz.

## Özellikler

- Canlı önizleme
- **Kalın**, *italik*, ~~üstü çizili~~ metinler
- Liste ve alıntı desteği
- Kod blokları ve sözdizimi vurgulaması
- Bağlantı ve görüntü ekleme
- Tek tıkla kopyalama

> "Basitlik, sophistikasyonun sonucudur." — Leonardo da Vinci

### Kod örneği

\`\`\`javascript
function selamla(isim) {
  console.log("Merhaba, " + isim + "!");
  return true;
}

selamla("Dünya");
\`\`\`

---

Başlamak için editördeki metni değiştirin!`;

// marked.js ayarları (GFM stilli)
marked.use({
  gfm: true,
  breaks: true,
  highlight: (code, lang) => {
    // Basit bir renklendirme: marked zaten HTML verir, burada sadece sarmalayıcıyı döndürüyoruz.
    // Gerçek highlight.js veya prism.js entegrasyonu eklenebilir.
    return code;
  },
});

function renderMarkdown() {
  const md = editor.value;
  preview.innerHTML = marked.parse(md || "");
}

function copyToClipboard(text, button, label) {
  navigator.clipboard.writeText(text).then(() => {
    const original = button.textContent;
    button.textContent = label;
    button.classList.add("text-emerald-600");
    setTimeout(() => {
      button.textContent = original;
      button.classList.remove("text-emerald-600");
    }, 1500);
  });
}

// Olaylar
editor.addEventListener("input", renderMarkdown);

btnCopyMd.addEventListener("click", () => {
  copyToClipboard(editor.value, btnCopyMd, "MD Kopyalandı!");
});

btnCopyHtml.addEventListener("click", () => {
  copyToClipboard(preview.innerHTML, btnCopyHtml, "HTML Kopyalandı!");
});

// Başlangıç
editor.value = initialContent;
renderMarkdown();

// Sayfa görünmezken scroll'u korumak için editör/önizleme senkronizasyonu (isteğe bağlı)
let isSyncing = false;
editor.addEventListener("scroll", () => {
  if (isSyncing) return;
  isSyncing = true;
  const ratio = editor.scrollTop / (editor.scrollHeight - editor.clientHeight);
  preview.scrollTop = ratio * (preview.scrollHeight - preview.clientHeight);
  isSyncing = false;
});

preview.addEventListener("scroll", () => {
  if (isSyncing) return;
  isSyncing = true;
  const ratio = preview.scrollTop / (preview.scrollHeight - preview.clientHeight);
  editor.scrollTop = ratio * (editor.scrollHeight - editor.clientHeight);
  isSyncing = false;
});