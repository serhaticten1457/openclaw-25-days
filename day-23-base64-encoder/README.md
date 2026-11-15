# Base64 Kod Çözücü

Tarayıcı tabanlı, kurulum gerektirmeyen bir Base64 kodlayıcı ve çözücüdür. Metni Base64 formatına dönüştürebilir veya Base64 metni geri çözebilirsiniz.

## Özellikler

- Metin → Base64 (encode)
- Base64 → Metin (decode)
- İki yönlü mod seçimi
- Anlık dönüşüm (yazınca sonuç güncellenir)
- Sonucu panoya kopyalama
- Yerel olarak çalışır (atob/btoa), veri sunucuya çıkmaz
- Kurulum gerektirmez — doğrudan tarayıcıda çalışır

## Kullanılan Teknolojiler

- HTML5
- CSS3
- Vanilla JavaScript (atob / btoa)
- [Tailwind CSS](https://tailwindcss.com) (CDN ile)

## Yerel Çalıştırma

Proje klasöründeki `index.html` dosyasını çift tıklayarak herhangi bir modern web tarayıcısında açabilirsiniz. Sunucu kurulumu gerekmez.

```bash
cd day-23-base64-encoder
open index.html   # macOS
# veya
xdg-open index.html # Linux
```

## Örnekler

- "Merhaba Dünya" → "TWVyaGFiYSBDdW55YQ=="
- "TWVyaGFiYSBDdW55YQ==" → "Merhaba Dünya"

## Lisans

MIT