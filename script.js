// Faixas conhecidas (fonte: Canaltech / portal de devs da Meta)
// rate = preço por mensagem em USD dentro da faixa
const tiers = [
  { min: 1,          max: 250000,     rate: 0.0068, label: "1 – 250.000" },
  { min: 250001,     max: 2000000,    rate: 0.0065, label: "250.001 – 2.000.000" },
  { min: 2000001,    max: 70000000,   rate: 0.0058, label: "2.000.001 – 70.000.000 (estimado*)" },
  { min: 70000001,   max: Infinity,   rate: 0.0051, label: "Acima de 70.000.000" },
];

function fmtBRL(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
function fmtUSD(v) {
  return v.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}
function fmtInt(v) {
  return v.toLocaleString('pt-BR');
}

function calcular() {
  const msgs = parseFloat(document.getElementById('msgs').value) || 0;
  const usdRate = parseFloat(document.getElementById('usd').value) || 0;

  if (msgs <= 0) {
    document.getElementById('results').classList.remove('show');
    return;
  }

  let remaining = msgs;
  let totalUSD = 0;
  const rows = [];

  for (const tier of tiers) {
    if (remaining <= 0) break;
    const tierCapacity = (tier.max === Infinity) ? remaining : (tier.max - tier.min + 1);
    const qty = Math.min(remaining, tierCapacity);
    if (qty <= 0) continue;
    const subtotalUSD = qty * tier.rate;
    totalUSD += subtotalUSD;
    rows.push({ label: tier.label, rate: tier.rate, qty, subtotalBRL: subtotalUSD * usdRate });
    remaining -= qty;
  }

  const totalBRL = totalUSD * usdRate;
  const avgPerMsgBRL = totalBRL / msgs;

  document.getElementById('totalBRL').textContent = fmtBRL(totalBRL);
  document.getElementById('totalUSD').textContent = "≈ " + fmtUSD(totalUSD);
  document.getElementById('avgMsg').textContent = fmtBRL(avgPerMsgBRL);
  document.getElementById('totalAno').textContent = fmtBRL(totalBRL * 12);
  document.getElementById('footTotal').textContent = fmtBRL(totalBRL);

  const body = document.getElementById('breakdownBody');
  body.innerHTML = rows.map(r => `
    <tr>
      <td>${r.label}</td>
      <td>US$ ${r.rate.toFixed(4)}</td>
      <td class="num">${fmtInt(r.qty)}</td>
      <td class="num">${fmtBRL(r.subtotalBRL)}</td>
    </tr>
  `).join('');

  document.getElementById('results').classList.add('show');
}
