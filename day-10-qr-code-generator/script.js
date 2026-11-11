// Day 10 - QR Kod Oluşturucu
// QRCode.js kullanarak metin/URL'den QR kod üretir ve PNG olarak indirme sağlar.

const qrInput = document.getElementById("qr-input");
const qrSizeSelect = document.getElementById("qr-size");
const qrColorInput = document.getElementById("qr-color");
const btnGenerate = document.getElementById("btn-generate");
const btnDownload = document.getElementById("btn-download");
const qrPreview = document.getElementById("qr-preview");
const qrImage = document.getElementById("qr-image");
const qrInfo = document.getElementById("qr-info");

let qrcodeInstance = null;

function generateQR() {
  const text = qrInput.value.trim();
  if (!text) {
    alert("Lütfen bir metin veya URL girin.");
    qrInput.focus();
    return;
  }

  const size = parseInt(qrSizeSelect.value, 10);
  const color = qrColorInput.value;

  // Önceki QR kodunu temizle
  const container = qrImage.parentElement;
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  // Yeni QR kod oluştur
  qrcodeInstance = new QRCode(container, {
    text: text,
    width: size,
    height: size,
    colorDark: color,
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
  });

  // Önizlemeyi göster
  qrPreview.classList.remove("hidden");
  qrInfo.textContent = `${size}×${size} px`;
  btnDownload.classList.remove("hidden");
}

function downloadQR() {
  const img = qrImage.querySelector("img");
  if (!img) return;

  const link = document.createElement("a");
  link.download = "qr-kod.png";
  link.href = img.src;
  link.click();
}

// Olaylar
btnGenerate.addEventListener("click", generateQR);
btnDownload.addEventListener("click", downloadQR);

// Enter tuşu ile oluşturma (textarea'da shift+enter yeni satır için)
qrInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    generateQR();
  }
});

// Başlangıçta bir örnek oluştur
qrInput.value = "https://openclaw.ai";
generateQR();