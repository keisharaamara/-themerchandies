
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => [...ctx.querySelectorAll(sel)];

const PRODUCTS = [
  {id:'tshirt', name:'Kaos Logo', price:120000, tag:'Best Seller', img:'assets/img/products/tshirt.svg'},
  {id:'mug', name:'Mug Keren', price:85000, tag:'Hot', img:'assets/img/products/mug.svg'},
  {id:'keychain', name:'Gantungan Kunci', price:45000, tag:'Lucu', img:'assets/img/products/keychain.svg'},
  {id:'cap', name:'Topi Trucker', price:99000, tag:'New', img:'assets/img/products/cap.svg'},
  {id:'tote', name:'Totebag', price:110000, tag:'Eco', img:'assets/img/products/tote.svg'}
];

const formatIDR = v => new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR'}).format(v);

const Cart = {
  key: 'tm_cart_v1',
  get(){ try{ return JSON.parse(localStorage.getItem(this.key))||[] }catch{ return [] } },
  set(items){ localStorage.setItem(this.key, JSON.stringify(items)); updateCartBadge(); },
  add(productId){
    const items = this.get();
    const item = items.find(i=>i.id===productId);
    if(item){ item.qty += 1 } else { items.push({id:productId, qty:1}) }
    this.set(items);
  },
  remove(productId){
    let items = this.get().filter(i=>i.id!==productId);
    this.set(items);
  },
  inc(productId){ const items = this.get(); const it = items.find(i=>i.id===productId); if(it){ it.qty++; this.set(items);} },
  dec(productId){ const items = this.get(); const it = items.find(i=>i.id===productId); if(it){ it.qty--; if(it.qty<=0){ return this.remove(productId)} this.set(items);} },
  clear(){ this.set([]) }
};

function updateCartBadge(){
  const count = Cart.get().reduce((a,b)=>a+b.qty,0);
  const badge = $('.cart-count');
  if(badge){ badge.textContent = count }
}

function renderSlider(){
  const container = $('.slides');
  container.innerHTML = '';
  PRODUCTS.slice(0,5).forEach(p=>{
    const el = document.createElement('div');
    el.className = 'slide';
    el.innerHTML = `
      <div class="card">
        <img src="${p.img}" alt="${p.name}">
        <div class="meta">
          <h3>${p.name}</h3>
          <p>${p.tag} · <span class="price">${formatIDR(p.price)}</span></p>
          <button class="btn" data-add="${p.id}">Tambahkan ke Keranjang</button>
        </div>
      </div>
      <div class="card">
        <img src="assets/img/dove.svg" alt="Burung merpati">
        <div class="meta">
          <h3>Burung Merpati</h3>
          <p>Ikon damai untuk brand kamu.</p>
          <button class="btn ghost" onclick="window.location='#about'">Lihat Selengkapnya</button>
        </div>
      </div>
    `;
    container.appendChild(el);
  });

  let idx = 0;
  const slides = $$('.slide', container);
  function go(i){
    idx = (i+slides.length)%slides.length;
    container.style.transform = `translateX(-${idx*100}%)`;
  }
  $('#prev').addEventListener('click', ()=>go(idx-1));
  $('#next').addEventListener('click', ()=>go(idx+1));
  setInterval(()=>go(idx+1), 5000);
  container.addEventListener('click', e=>{
    const btn = e.target.closest('[data-add]');
    if(btn){ Cart.add(btn.dataset.add) }
  });
}

function renderGrid(){
  const grid = $('#catalog');
  grid.innerHTML = PRODUCTS.map(p=>`
    <div class="product-card">
      <img src="${p.img}" alt="${p.name}">
      <div class="title">${p.name}</div>
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
        <span class="badge-blue">${p.tag}</span>
        <strong>${formatIDR(p.price)}</strong>
      </div>
      <button class="btn" data-add="${p.id}">Tambahkan ke Keranjang</button>
    </div>
  `).join('');
  grid.addEventListener('click', e=>{
    const btn = e.target.closest('[data-add]');
    if(btn){ Cart.add(btn.dataset.add) }
  });
}

function openCart(){ $('#cartModal').classList.add('active'); renderCart() }
function closeCart(){ $('#cartModal').classList.remove('active') }

function renderCart(){
  const wrap = $('#cartItems');
  const items = Cart.get();
  if(items.length===0){ wrap.innerHTML = '<p>Keranjang masih kosong.</p>'; $('#cartTotal').textContent = formatIDR(0); return; }
  wrap.innerHTML = items.map(it=>{
    const p = PRODUCTS.find(x=>x.id===it.id);
    return `
      <div class="cart-row">
        <div style="display:flex; gap:10px; align-items:center">
          <img src="${p.img}" alt="${p.name}" style="width:48px;height:48px;border-radius:8px">
          <div>
            <div><strong>${p.name}</strong></div>
            <div class="muted">${formatIDR(p.price)}</div>
          </div>
        </div>
        <div class="qty">
          <button data-dec="${p.id}">-</button>
          <strong>${it.qty}</strong>
          <button data-inc="${p.id}">+</button>
        </div>
        <div><strong>${formatIDR(p.price*it.qty)}</strong></div>
        <button data-del="${p.id}" title="Hapus">×</button>
      </div>
    `;
  }).join('');
  const total = items.reduce((a,b)=> a + b.qty * (PRODUCTS.find(p=>p.id===b.id)?.price||0), 0);
  $('#cartTotal').textContent = formatIDR(total);
}

function cartActions(){
  $('#cartItems').addEventListener('click', e=>{
    const t = e.target;
    if(t.dataset.inc){ Cart.inc(t.dataset.inc); renderCart(); }
    if(t.dataset.dec){ Cart.dec(t.dataset.dec); renderCart(); }
    if(t.dataset.del){ Cart.remove(t.dataset.del); renderCart(); }
  });
}

function initTestimonials(){
  const seed = [
    {name:'Rani', stars:5, text:'Barang lucu-lucu, kualitas mantap!'},
    {name:'Bimo', stars:4, text:'Pengiriman cepat, desain eksklusif.'},
    {name:'Tara', stars:5, text:'Suka banget sama mugnya ☕'}
  ];
  const key='tm_testi_v1';
  const data = JSON.parse(localStorage.getItem(key)) || seed;
  const list = $('#testiList');
  const render = ()=>{
    list.innerHTML = data.map(t=>`
      <div class="card quote">
        <div class="stars">${'★'.repeat(t.stars)}${'☆'.repeat(5-t.stars)}</div>
        <div>"${t.text}"</div>
        <div style="color:#a0aec0">— ${t.name}</div>
      </div>
    `).join('');
  };
  render();

  $('#testiForm').addEventListener('submit', e=>{
    e.preventDefault();
    const name = e.target.name.value.trim() || 'Anonim';
    const stars = +e.target.stars.value || 5;
    const text = e.target.text.value.trim();
    if(text){
      data.unshift({name, stars, text});
      localStorage.setItem(key, JSON.stringify(data));
      e.target.reset();
      render();
    }
  });
}

function initFeedback(){
  $('#feedbackForm').addEventListener('submit', e=>{
    e.preventDefault();
    const payload = {
      name: e.target.name.value.trim(),
      message: e.target.message.value.trim(),
      ts: new Date().toISOString()
    };
    const list = JSON.parse(localStorage.getItem('tm_feedback_v1')||'[]');
    list.unshift(payload);
    localStorage.setItem('tm_feedback_v1', JSON.stringify(list));
    alert('Terima kasih atas kritik & sarannya!');
    e.target.reset();
  });
}

function wire(){
  $('#openCart').addEventListener('click', openCart);
  $('#closeCart').addEventListener('click', closeCart);
  $('#checkoutBtn').addEventListener('click', ()=>{
    window.location.href = 'checkout.html';
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderSlider();
  renderGrid();
  cartActions();
  initTestimonials();
  initFeedback();
  wire();
  updateCartBadge();
});
