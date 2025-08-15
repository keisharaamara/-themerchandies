
const $ = (s, c=document)=>c.querySelector(s);
const formatIDR = v => new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR'}).format(v);

document.addEventListener('DOMContentLoaded', ()=>{
  const summary = $('#orderSummary');
  const items = JSON.parse(localStorage.getItem('tm_cart_v1')||'[]');
  if(items.length===0){ summary.innerHTML = '<p>Keranjang kosong.</p>'; return; }
  const PRODUCTS = {
    tshirt: {name:'Kaos Logo', price:120000},
    mug: {name:'Mug Keren', price:85000},
    keychain: {name:'Gantungan Kunci', price:45000},
    cap: {name:'Topi Trucker', price:99000},
    tote: {name:'Totebag', price:110000}
  };
  let total = 0;
  summary.innerHTML = items.map(it=>{
    const p = PRODUCTS[it.id];
    const sub = p.price * it.qty;
    total += sub;
    return `<div style="display:flex;justify-content:space-between"><span>${p.name} × ${it.qty}</span><strong>${formatIDR(sub)}</strong></div>`;
  }).join('');
  $('#orderTotal').textContent = formatIDR(total);

  $('#payForm').addEventListener('submit', e=>{
    e.preventDefault();
    alert('Checkout berhasil (demo). Terima kasih!');
    localStorage.removeItem('tm_cart_v1');
    window.location.href = 'index.html';
  });
});
