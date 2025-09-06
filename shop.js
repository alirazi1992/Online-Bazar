// shop.js — per-shop microsite + checkout using localStorage
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
function getSlug(){ return new URL(location.href).searchParams.get("shop") || "negin-shoes"; }
function money(n){ return Number(n).toLocaleString("fa-IR"); }
function getShops(){ try { return JSON.parse(localStorage.getItem("shops")) || []; } catch { return []; } }
function getShop(slug){ return getShops().find(s => s.slug === slug); }
function setShops(list){ localStorage.setItem("shops", JSON.stringify(list)); }

// Seed demo shops (rich)
(function seedShops(){
  if (getShops().length) return;
  setShops([
    { slug:"negin-shoes", name:"کفش نگین", category:"مد و پوشاک", tagline:"کیفیت و راحتی در هر قدم", rating:4.7, delivery:"ارسال سریع تهران",
      verified:true, address:"تهران، ولیعصر، پلاک ۱۲۳", phone:"021-12345678", website:"https://example.com/negin", instagram:"https://instagram.com/negin",
      about:"فروشگاه کفش نگین با بیش از ۱۰ سال تجربه ...", policies:["۷ روز ضمانت بازگشت","ارسال رایگان بالای ۱.۵ میلیون"],
      products:[
        {id:"N-1",title:"کفش زنانه مدل آوا",price:950000,image:"https://picsum.photos/seed/negin1/600/400",popular:true},
        {id:"N-2",title:"کفش مردانه مدل رادین",price:1250000,image:"https://picsum.photos/seed/negin2/600/400",popular:true},
        {id:"N-3",title:"کتانی اسپرت لایت",price:780000,image:"https://picsum.photos/seed/negin3/600/400"}
      ],
      reviews:[{user:"سارا",text:"کیفیت عالی 👌",stars:5}] },
    { slug:"arad-mobile", name:"موبایل آراد", category:"کالای دیجیتال", tagline:"گوشی‌های روز با گارانتی", rating:4.5, delivery:"پست پیشتاز",
      verified:false, address:"اصفهان، چهارباغ بالا، پلاک ۴۵", phone:"031-44556677", website:"https://example.com/arad", instagram:"https://instagram.com/arad",
      about:"جدیدترین گوشی‌ها و لوازم جانبی با بهترین قیمت.", policies:["ضمانت رجیستری","پرداخت در محل (شهری)"],
      products:[
        {id:"A-1",title:"گوشی X12 Pro",price:12900000,image:"https://picsum.photos/seed/arad1/600/400",popular:true},
        {id:"A-2",title:"هندزفری بی‌سیم Alpha",price:980000,image:"https://picsum.photos/seed/arad2/600/400"}
      ],
      reviews:[{user:"نیلوفر",text:"پشتیبانی عالی.",stars:5}] },
    { slug:"ketab-cafe", name:"کافه کتاب", category:"فرهنگی و هنری", tagline:"کتاب، قهوه و آرامش", rating:4.8, delivery:"پیک شهری + پست",
      verified:true, address:"شیراز، خیابان زند، پلاک ۹۹", phone:"071-33334455", website:"https://example.com/ketاب", instagram:"https://instagram.com/ketab",
      about:"کتاب‌فروشی و کافه با مجموعه‌ای از رمان‌ها.", policies:["ارسال روزانه","بسته‌بندی هدیه","۷ روز مرجوعی"],
      products:[
        {id:"K-1",title:"رمان کلاسیک",price:120000,image:"https://picsum.photos/seed/book1/600/400",popular:true},
        {id:"K-2",title:"قهوه اسپرسو 250g",price:180000,image:"https://picsum.photos/seed/coffee1/600/400"}
      ],
      reviews:[{user:"لیلا",text:"بسته‌بندی عالی و ارسال سریع.",stars:5}] },
    { slug:"homey", name:"هومى هوم", category:"خانه و آشپزخانه", tagline:"اکسسوری‌های مینیمال برای خانه", rating:4.4, delivery:"پست پیشتاز",
      verified:false, address:"تبریز، ولیعصر، پلاک ۲۰", phone:"041-11223344", website:"https://example.com/homey", instagram:"https://instagram.com/homey",
      about:"لوازم دکوراتیو و منسوجات خانگی.", policies:["ارسال رایگان بالای ۵۰۰ هزار","۱۴ روز مرجوعی"],
      products:[
        {id:"H-1",title:"گلدان سرامیکی دست‌ساز",price:230000,image:"https://picsum.photos/seed/vase1/600/400",popular:true},
        {id:"H-2",title:"ست شمع معطر",price:195000,image:"https://picsum.photos/seed/candle1/600/400"}
      ],
      reviews:[{user:"مهسا",text:"کیفیت ساخت عالی بود 🌿",stars:5}] }
  ]);
})();

function getCartKey(slug){ return `cart_${slug}`; }
function getCart(slug){ try { return JSON.parse(localStorage.getItem(getCartKey(slug))) || []; } catch{ return []; } }
function setCart(slug, cart){ localStorage.setItem(getCartKey(slug), JSON.stringify(cart)); updateCartBadge(slug); }
function addToCart(slug, item){
  const cart = getCart(slug);
  const f = cart.find(c => c.id === item.id);
  if (f) f.qty += 1; else cart.push({...item, qty:1});
  setCart(slug, cart); alert("به سبد اضافه شد");
}
function updateCartBadge(slug){
  const el = document.getElementById("cart-count"); if (!el) return;
  el.textContent = getCart(slug).reduce((s,x)=> s+x.qty, 0);
}

function renderShop(shop){
  document.title = shop.name + " | بازار آنلاین";
  $("#shop-name").textContent = shop.name;
  $("#shop-category").textContent = shop.category;
  $("#shop-tagline").textContent = shop.tagline;
  $("#shop-rating").textContent = `امتیاز ${shop.rating}`;
  $("#shop-delivery").textContent = shop.delivery;
  if (shop.verified) $("#shop-verified").classList.remove("hidden");
  $("#shop-info").innerHTML = `
    <li>📍 ${shop.address}</li>
    <li>📞 ${shop.phone}</li>
    <li>🌐 <a class="text-indigo-600 ltr-support" href="${shop.website}" target="_blank">${shop.website}</a></li>
    <li>📷 <a class="text-indigo-600 ltr-support" href="${shop.instagram}" target="_blank">${shop.instagram}</a></li>`;
  $("#shop-about").textContent = shop.about;
  $("#shop-policies").innerHTML = (shop.policies||[]).map(p=>`<li>• ${p}</li>`).join("");

  const q=$("#q"), sort=$("#sort"), grid=$("#grid");
  function draw(){
    let list=[...(shop.products||[])];
    const query=(q.value||"").trim();
    if(query) list=list.filter(p=>p.title.includes(query));
    if(sort.value==="price-asc") list.sort((a,b)=>a.price-b.price);
    if(sort.value==="price-desc") list.sort((a,b)=>b.price-a.price);
    if(sort.value==="popular") list.sort((a,b)=>(b.popular?1:0)-(a.popular?1:0));
    grid.innerHTML=list.map(p=>`
      <div class="card">
        <img src="${p.image}" class="w-full aspect-[4/3] object-cover rounded-lg" />
        <div class="mt-2 flex items-start justify-between">
          <div><b>${p.title}</b><div class="muted">${money(p.price)} تومان</div></div>
          <button class="btn-outline text-xs" data-add="${p.id}">افزودن</button>
        </div>
      </div>`).join("");
    $$("#grid [data-add]").forEach(btn=>{
      btn.addEventListener("click",()=>{
        const id=btn.getAttribute("data-add");
        const item=(shop.products||[]).find(p=>p.id===id);
        if(item) addToCart(shop.slug,item);
      });
    });
  }
  q.addEventListener("input",draw); sort.addEventListener("change",draw); draw();
  $("#reviews-list").innerHTML=(shop.reviews||[]).map(r=>`<div class="card"><b>${r.user}</b><p class="text-sm">${r.text}</p></div>`).join("");
  updateCartBadge(shop.slug);
}

function renderCheckout(){
  const slug=sessionStorage.getItem("checkout_slug")||getSlug();
  const cart=getCart(slug); const list=$("#cart-items");
  const total=cart.reduce((s,x)=>s+x.price*x.qty,0);
  list.innerHTML=cart.length?cart.map(c=>`
    <div class="flex items-center justify-between border rounded-lg px-3 py-2">
      <div>${c.title} <span class="muted">x${c.qty}</span></div>
      <div>${money(c.price*c.qty)} تومان</div>
    </div>`).join(""):`<div class="muted">سبد خرید خالی است.</div>`;
  const totalEl = $("#cart-total"); if (totalEl) totalEl.textContent=money(total);
  $("#checkout-form")?.addEventListener("submit",e=>{
    e.preventDefault();
    const oid="ORD-"+Math.floor(1000+Math.random()*9000);
    localStorage.setItem("lastOrderId",oid);
    const orders=JSON.parse(localStorage.getItem("orders")||"[]");
    orders.push({id:oid,date:new Date().toISOString().slice(0,10),vendor:slug,status:"processing",amount:total,invoice:oid+".pdf"});
    localStorage.setItem("orders",JSON.stringify(orders));
    setCart(slug,[]); location.href="./order-success.html";
  });
}

// Init for shop.html / checkout.html
(function init(){
  if(document.getElementById("grid")){ const slug=getSlug(); const shop=getShop(slug); if(shop){ sessionStorage.setItem("checkout_slug",slug); renderShop(shop);} }
  else if(document.getElementById("checkout-form")){ renderCheckout(); }
})();
