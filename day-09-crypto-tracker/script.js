// Day 09 - Kripto Para Takibi
// CoinGecko API'den gerçek coin fiyatları. Hiçbir API anahtarı gerektirmez.

const coinList = document.getElementById("coin-list");
const searchInput = document.getElementById("search");
const btnRefresh = document.getElementById("btn-refresh");
const lastUpdated = document.getElementById("last-updated");

// Takip edilecek coinler (CoinGecko ID'leri)
const COIN_IDS = [
  "bitcoin",
  "ethereum",
  "tether",
  "binancecoin",
  "solana",
  "ripple",
  "dogecoin",
  "cardano",
  "avalanche-2",
  "polkadot",
];

let allCoins = []; // Tüm fetched veriler

// Fetch
async function fetchCoins() {
  showLoading(true);
  lastUpdated.textContent = "Yükleniyor...";

  try {
    const ids = COIN_IDS.join("%2C");
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_last_updated_at=true`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`API error: ${res.status}`);

    const data = await res.json();

    allCoins = COIN_IDS.map((id) => {
      const d = data[id];
      if (!d) return null;
      return {
        id,
        name: id.charAt(0).toUpperCase() + id.slice(1),
        symbol: id.toUpperCase(),
        price: d.usd,
        change24h: d.usd_24h_change,
        updated: d.last_updated_at ? d.last_updated_at * 1000 : Date.now(),
      };
    }).filter(Boolean);

    render();
    lastUpdated.textContent = `Güncelleme: ${new Date().toLocaleTimeString("tr-TR")}`;
  } catch (err) {
    console.error(err);
    coinList.innerHTML = `
      <tr class="error-row">
        <td colspan="3" class="py-8 text-center text-rose-500 text-sm">
          Veri yüklenemedi. Lütfen bir sonraki yenilemede tekrar deneyin.<br>
          <span class="text-slate-500 text-xs">${err.message}</span>
        </td>
      </tr>
    `;
    lastUpdated.textContent = "Hata oluştu";
  } finally {
    showLoading(false);
  }
}

function showLoading(loading) {
  const rows = coinList.querySelectorAll("tr");
  rows.forEach((r) => r.remove());
  if (loading) {
    const tr = document.createElement("tr");
    tr.className = "loading-row";
    tr.innerHTML = `<td colspan="3" class="py-8 text-center text-slate-500 text-sm">Yükleniyor...</td>`;
    coinList.appendChild(tr);
  }
}

// Render
function render() {
  coinList.innerHTML = "";

  const query = searchInput.value.toLowerCase();
  const filtered = allCoins.filter(
    (c) => c.name.toLowerCase().includes(query) || c.id.toLowerCase().includes(query)
  );

  if (filtered.length === 0) {
    coinList.innerHTML = `
      <tr>
        <td colspan="3" class="py-8 text-center text-slate-500 text-sm">Eşleşen coin bulunamadı.</td>
      </tr>
    `;
    return;
  }

  filtered.forEach((coin) => {
    const tr = document.createElement("tr");
    tr.className = "coin-row border-b border-slate-800";

    const isPositive = coin.change24h >= 0;
    const changeColor = isPositive ? "text-emerald-400" : "text-rose-400";
    const changeSign = isPositive ? "+" : "";

    tr.innerHTML = `
      <td class="py-4 pl-2 font-semibold text-slate-200 flex items-center gap-2">
        <span class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-indigo-400">
          ${coin.symbol.charAt(0)}
        </span>
        <span>${coin.name}</span>
      </td>
      <td class="py-4 pr-4 font-mono text-sm text-slate-300 text-right">
        $${formatNumber(coin.price)}
      </td>
      <td class="py-4 pr-4 font-mono text-sm ${changeColor} text-right font-semibold">
        ${changeSign}${coin.change24h.toFixed(2)}%
      </td>
    `;

    coinList.appendChild(tr);
  });
}

function formatNumber(n) {
  if (n >= 1000) {
    return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return n.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 6 });
}

// Olaylar
btnRefresh.addEventListener("click", fetchCoins);

searchInput.addEventListener("input", render);

// Başlangıç
fetchCoins();

// 60 saniyede bir otomatik yenile
setInterval(fetchCoins, 60000);