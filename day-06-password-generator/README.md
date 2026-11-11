# Şifre Üreteci

Tarayıcı tabanlı, kurulum gerektirmeyen bir şifre üretecisidir. Güçlü ve rastgele şifreler oluşturur; tüm işlem yerel olarak gerçekleşir, hiçbir veri sunucuya gönderilmez.

## Özellikler

- Özelleştirilebilir şifre uzunluğu (6–64 karakter)
- Küçük harf, büyük harf, rakam ve sembol seçenekleri
- Karışık karakterleri (i, L, 1, o, O, 0) çıkarma seçeneği
- Gerçek zamanlı şifre gücü göstergesi (6 seviye)
- Tek tıkla panoya kopyalama
- Yerel rastgele üretim (Web Crypto API), sunucuya veri yok
- Kurulum gerektirmez — doğrudan tarayıcıda çalışır

## Kullanılan Teknolojiler

- HTML5
- CSS3
- Vanilla JavaScript (Web Crypto API)
- [Tailwind CSS](https://tailwindcss.com) (CDN ile)

## Yerel Çalıştırma

Proje klasöründeki `index.html` dosyasını çift tıklayarak herhangi bir modern web tarayıcısında açabilirsiniz. Sunucu kurulumu gerekmez.

```bash
cd day-06-password-generator
open index.html   # macOS
# veya
xdg-open index.html # Linux
```

## Güvenlik Notu

Tüm şifre üretimi tarayıcınızda yerel olarak gerçekleşir. Üretilen şifreler internet üzerinden gönderilmez veya saklanmaz.

## Lisans

MIT