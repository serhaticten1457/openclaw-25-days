# Gider Takip Uygulaması

Tarayıcı tabanlı, kurulum gerektirmeyen bir gider/bütçe takip uygulaması. Giderlerinizi tutar, kategori, açıklama ve tarih ile kaydedebilir, listeleyebilir ve silebilirsiniz. Tüm veriler tarayıcınızda yerel olarak saklanır (localStorage).

## Özellikler

- Gider ekleme (tutar, kategori, açıklama, tarih)
- 6 kategori: Yemek, Ulaşım, Ev Faturaları, Eğlence, Sağlık, Diğer
- Gider listesini görüntüleme
- Tekil gider silme
- Tüm giderleri temizleme
- Özet kartları: toplam gider, kayıt sayısı, ortalama harcama
- Para formatı Türk Lirası (₺)
- localStorage ile sayfa yenilendiğinde veri kalıcılığı
- Kurulum gerektirmez — doğrudan tarayıcıda çalışır

## Kullanılan Teknolojiler

- HTML5
- CSS3
- Vanilla JavaScript
- [Tailwind CSS](https://tailwindcss.com) (CDN ile)

## Yerel Çalıştırma

Proje klasöründeki `index.html` dosyasını çift tıklayarak herhangi bir modern web tarayıcısında açabilirsiniz. Sunucu kurulumu gerekmez.

```bash
cd day-17-expense-tracker
open index.html   # macOS
# veya
xdg-open index.html # Linux
```

## Lisans

MIT