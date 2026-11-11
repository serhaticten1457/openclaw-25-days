// Day 14 - Yaş Hesaplayıcı
// Doğum tarihinden yaş (yıl, ay, gün, hafta) hesaplar. Yerel olarak çalışır.

const birthDateInput = document.getElementById("birth-date");
const btnCalculate = document.getElementById("btn-calculate");
const resultCard = document.getElementById("result-card");
const yearsEl = document.getElementById("years");
const monthsEl = document.getElementById("months");
const weeksEl = document.getElementById("weeks");
const daysEl = document.getElementById("days");
const totalDaysEl = document.getElementById("total-days");
const nextBirthdayEl = document.getElementById("next-birthday");

// Bugünün tarihini input'un max değeri olarak ayarla (gelecek tarih seçilmesin)
const today = new Date();
const todayStr = today.toISOString().split("T")[0];
birthDateInput.max = todayStr;

function calculateAge(birthDate) {
  const now = new Date();

  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  let days = now.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}

function formatDays(d) {
  return d.toLocaleString("tr-TR");
}

function getNextBirthday(birthDate) {
  const now = new Date();
  const thisYear = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());

  let next = thisYear;
  if (thisYear < now) {
    next = new Date(now.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate());
  }

  const diffMs = next - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return { next, diffDays };
}

function render() {
  const value = birthDateInput.value;
  if (!value) {
    resultCard.classList.add("hidden");
    return;
  }

  const birthDate = new Date(value + "T00:00:00");
  if (birthDate > today) {
    resultCard.classList.add("hidden");
    return;
  }

  const age = calculateAge(birthDate);
  const next = getNextBirthday(birthDate);

  // Toplam gün (yaklaşık)
  const totalDays = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);

  yearsEl.textContent = age.years;
  monthsEl.textContent = age.months;
  weeksEl.textContent = totalWeeks;
  daysEl.textContent = age.days;
  totalDaysEl.textContent = formatDays(totalDays);

  const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  nextBirthdayEl.textContent = `Sonraki doğum gününe ${next.diffDays} gün kaldı (${next.next.getDate()} ${monthNames[next.next.getMonth()]})`;

  resultCard.classList.remove("hidden");
}

btnCalculate.addEventListener("click", render);
birthDateInput.addEventListener("change", render);

// Başlangıçta boş
resultCard.classList.add("hidden");