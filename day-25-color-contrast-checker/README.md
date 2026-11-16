# Renk Kontrast Denetleyici

Tarayıcı tabanlı, kurulum gerektirmeyen bir renk kontrast oranı hesaplayıcısıdır. İki renk arasındaki WCAG 2.1 kontrast oranını hesaplar ve erişilebilirlik uygunluğunu gösterir.

## Özellikler

- Ön plan ve arka plan rengi seçicileri (renk picker + hex giriş)
- WCAG 2.1 kontrast oranı hesaplama
- Uygunluk kontrolü:
  - WCAG AA Normal metin (4.5:1)
  - WCAG AA Büyük metin (3:1)
  - WCAG AAA Normal metin (7:1)
  - WCAG AAA Büyük metin (4.5:1)
- Renk önizleme ve okunabilirlik için otomatik metin rengi
- Geçerli / Geçmez durum göstergesi
- Kurulum gerektirmez — doğrudan tarayıcıda çalışır

## Hesaplama

Kontrast oranı = (L₁ + 0.05) / (L₂ + 0.05), burada L₁ daha açık renğin, L₂ daha koyu renğin relatif parlaklığıdır. Relatif parlaklık sRGB lineerleştirmesiyle hesaplanır.

## Kullanılan Teknolojiler

- HTML5
- CSS3
- Vanilla JavaScript
- [Tailwind CSS](https://tailwindcss.com) (CDN ile)

## Yerel Çalıştırma

Proje klasöründeki `index.html` dosyasını çift tıklayarak herhangi bir modern web tarayıcısında açabilirsiniz. Sunucu kurulumu gerekmez.

```bash
cd day-25-color-contrast-checker
open index.html   # macOS
# veya
xdg-open index.html # Linux
```

## Lisans

MIT