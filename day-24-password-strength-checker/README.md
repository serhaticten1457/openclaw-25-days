# Şifre Gücü Denetleyici

Tarayıcı tabanlı, kurulum gerektirmeyen bir şifre gücü analiz aracıdır. Yazdığınız şifrenin güvenliğini anında değerlendirir ve güç kurallarını gösterir.

## Özellikler

- Şifre gücü puanı (0–100)
- Görsel güç çubuğu ve seviye etiketi (Çok Zayıf → Güçlü)
- Güç kuralları listesi (uzunluk, harf, rakam, sembol, boşluk yok)
- Şifreyi göster/gizle butonu
- Şifreyi panoya kopyalama
- Yerel olarak çalışır (şifre asla sunucuya gönderilmez)
- Kurulum gerektirmez — doğrudan tarayıcıda çalışır

## Güç Skoru Nasıl Hesaplanır?

- Kurallar uyumu (60 puan): 6 kuralın her biri 10 puan
- Uzunluk bonusu (20 puan): 8+ (5), 10+ (10), 12+ (20)
- Çeşitsizlik bonusu (20 puan): her karakter türü 5 puan

## Kullanılan Teknolojiler

- HTML5
- CSS3
- Vanilla JavaScript
- [Tailwind CSS](https://tailwindcss.com) (CDN ile)

## Yerel Çalıştırma

Proje klasöründeki `index.html` dosyasını çift tıklayarak herhangi bir modern web tarayıcısında açabilirsiniz. Sunucu kurulumu gerekmez.

```bash
cd day-24-password-strength-checker
open index.html   # macOS
# veya
xdg-open index.html # Linux
```

## Güvenlik Notu

Tüm analiz tarayıcınızda yerel olarak gerçekleşir. Şifreniz asla internet üzerinden gönderilmez veya saklanmaz.

## Lisans

MIT