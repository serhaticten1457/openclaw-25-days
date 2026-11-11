# Kripto Para Takibi

Tarayıcı tabanlı, kurulum gerektirmeyen bir kripto para fiyat takip aracıdır. CoinGecko API'den gerçek zamanlı (gerçek) coin fiyatlarını ve 24 saatlik değişim yüzdesini gösterir.

## Özellikler

- 10 popüler coin: Bitcoin, Ethereum, Tether, Binance Coin, Solana, Ripple, Dogecoin, Cardano, Avalanche, Polkadot
- USD fiyatları
- 24 saatlik yüzde değişim (yeşil/ kırmızı)
- Coin arama filtresi
- Manuel yenileme butonu
- Otomatik yenileme (60 saniyede bir)
- API anahtarı gerekmez (CoinGecko public API)
- Kurulum gerektirmez — doğrudan tarayıcıda çalışır

## Kullanılan Teknolojiler

- HTML5
- CSS3
- Vanilla JavaScript (Fetch API)
- [Tailwind CSS](https://tailwindcss.com) (CDN ile)
- [CoinGecko API](https://www.coingecko.com/api) (ücretsiz, kimlik gerektirmeyen public endpoint)

## Yerel Çalıştırma

Proje klasöründeki `index.html` dosyasını çift tıklayarak herhangi bir modern web tarayıcısında açabilirsiniz. Sunucu kurulumu gerekmez.

```bash
cd day-09-crypto-tracker
open index.html   # macOS
# veya
xdg-open index.html # Linux
```

## Not

CoinGecko'un public API'sı rate limit koyabilir. Yoğun kullanım durumunda kısa bir süre sonra tekrar deneyin.

## Lisans

MIT