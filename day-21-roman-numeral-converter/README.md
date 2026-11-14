# Roma Rakamı Dönüştürücü

Tarayıcı tabanlı, kurulum gerektirmeyen bir Roma rakamı dönüştürücüsüdür. Arap rakamları ile Roma rakamları arasında ikili dönüşüm yapar.

## Özellikler

- Arap rakamı → Roma rakamı (1–3999)
- Roma rakamı → Arap rakamı (I–MMMCMXCIX)
- İki yönlü mod seçimi
- Geçerlilik kontrolü (geçersiz Roma rakamları reddedilir)
- Anlık dönüşüm
- Kurulum gerektirmez — doğrudan tarayıcıda çalışır

## Kullanılan Teknolojiler

- HTML5
- CSS3
- Vanilla JavaScript
- [Tailwind CSS](https://tailwindcss.com) (CDN ile)

## Yerel Çalıştırma

Proje klasöründeki `index.html` dosyasını çift tıklayarak herhangi bir modern web tarayıcısında açabilirsiniz. Sunucu kurulumu gerekmez.

```bash
cd day-21-roman-numeral-converter
open index.html   # macOS
# veya
xdg-open index.html # Linux
```

## Örnekler

- 1999 → MCMXCIX
- 2025 → MMXXV
- MCMXCIX → 1999
- MMXXV → 2025

## Lisans

MIT