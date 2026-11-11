# Metin Şifreleyici

Tarayıcı tabanlı, kurulum gerektirmeyen bir Caesar Cipher metin şifreleyicisidir. Metinleri şifreleyebilir ve şifreli metinleri geri çözebilirsiniz.

## Özellikler

- Caesar Cipher (kaydırma şifreleme) algoritması
- Şifreleme ve çözme modları
- Anahtar kaydırma değeri: 1–25 arası (varsayılan 13 / ROT13)
- Türkçe ve İngilizce harf desteği (sadece A–Z / a–z shiftlenir)
- Anlık işleme (yazınca sonuç güncellenir)
- Sonucu panoya kopyalama
- Yerel olarak çalışır, veri sunucuya çıkmaz
- Kurulum gerektirmez — doğrudan tarayıcıda çalışır

## Kullanılan Teknolojiler

- HTML5
- CSS3
- Vanilla JavaScript
- [Tailwind CSS](https://tailwindcss.com) (CDN ile)

## Yerel Çalıştırma

Proje klasöründeki `index.html` dosyasını çift tıklayarak herhangi bir modern web tarayıcısında açabilirsiniz. Sunucu kurulumu gerekmez.

```bash
cd day-12-text-encryptor
open index.html   # macOS
# veya
xdg-open index.html # Linux
```

## Güvenlik Notu

Caesar Cipher eğitim amaçlı basit bir şifreleme yöntemidir. Gerçek veri koruması için kullanılmamalıdır.

## Lisans

MIT