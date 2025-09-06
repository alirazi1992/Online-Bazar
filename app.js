// app.js — robust Home handling + dashboards + demo data (lint-safe)

// ===== Fix /index.html issues: rewrite to "/" and fix links =====
(function fixHomeLinksAndIndexNav(){
  try {
    if (/\/index\.html$/i.test(location.pathname)) {
      const target = location.pathname.replace(/index\.html$/i, "") + location.search + location.hash;
      history.replaceState(null, "", target || "/");
    }
  } catch {}
  function rewriteIndexLinks() {
    document.querySelectorAll('a[href]').forEach(a => {
      const raw = a.getAttribute('href'); if (!raw) return;
      let url; try { url = new URL(raw, location.href); } catch { return; }
      if (/\/index\.html$/i.test(url.pathname)) {
        const newPath = url.pathname.replace(/index\.html$/i, "");
        const newHref = newPath + url.search + url.hash || "./";
        a.setAttribute('href', newHref || "./");
      }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", rewriteIndexLinks);
  else rewriteIndexLinks();
})();

// ===== Nav Active (robust) =====
(function activateNavRobust(){
  function normalizePath(u) {
    try {
      const url = new URL(u, location.origin);
      let p = url.pathname.toLowerCase();
      if (p.endsWith("/")) p += "index.html";
      if (p.endsWith("/index")) p += ".html";
      return p;
    } catch { return location.pathname.toLowerCase(); }
  }
  const current = normalizePath(location.href);
  const nav = document.getElementById("site-nav"); if (!nav) return;
  const links = Array.from(nav.querySelectorAll("a.nav-link,[data-tab]"));
  let activated = false;
  for (const a of links) {
    const href = a.getAttribute("href") || a.href || "";
    const path = normalizePath(href);
    if (current.endsWith(path) || path.endsWith(current)) { a.classList.add("active"); activated = true; }
  }
  if (!activated) nav.querySelector('[data-tab="home"]')?.classList.add("active");
})();

// ===== LocalStorage helper =====
const DB = {
  get(key, fallback) { try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; } catch { return fallback; } },
  set(key, value) { localStorage.setItem(key, JSON.stringify(value)); },
};
function money(n){ try { return Number(n).toLocaleString("fa-IR"); } catch { return String(n); } }

// ===== Seed demo data =====
(function seedData(){
  if (!DB.get("orders", null)) {
    DB.set("orders", [
      { id:"ORD-1201", date:"2025-08-27", vendor:"ketab-cafe",  status:"delivered",  amount:  98000, invoice:"INV-1201.pdf" },
      { id:"ORD-1202", date:"2025-08-30", vendor:"homey",       status:"delivered",  amount: 640000, invoice:"INV-1202.pdf" },
      { id:"ORD-1203", date:"2025-09-01", vendor:"negin-shoes", status:"processing", amount:1850000, invoice:"INV-1203.pdf" },
      { id:"ORD-1204", date:"2025-09-03", vendor:"arad-mobile", status:"shipping",   amount:9200000, invoice:"INV-1204.pdf" },
      { id:"ORD-1205", date:"2025-09-04", vendor:"almas-bags",  status:"delivered",  amount: 760000, invoice:"INV-1205.pdf" },
      { id:"ORD-1206", date:"2025-09-05", vendor:"sportio",     status:"refunded",   amount: 325000, invoice:"INV-1206.pdf" },
    ]);
  }
  if (!DB.get("vendorProducts", null)) {
    DB.set("vendorProducts", [
      { id:"P-1", title:"کفش زنانه مدل آوا",  price:  950000, stock: 23, image:"https://picsum.photos/seed/retail1/320/320", desc:"رویه تنفس‌پذیر، زیره EVA" },
      { id:"P-2", title:"کفش مردانه مدل رادین", price: 1250000, stock: 11, image:"https://picsum.photos/seed/retail2/320/320", desc:"مقاوم و سبک" },
    ]);
  }
  if (!DB.get("vendorOrders", null)) {
    DB.set("vendorOrders", [
      { id:"VORD-1", customer:"علی رضایی",  items:2, amount:2150000, status:"processing" },
      { id:"VORD-2", customer:"نگین کریمی", items:1, amount: 950000, status:"shipping"   },
      { id:"VORD-3", customer:"سارا محمدی",  items:3, amount:3150000, status:"delivered"  },
    ]);
  }
  if (!DB.get("receipts", null)) {
    DB.set("receipts", [
      { id:1, date:"2025-09-02", title:"هزینه ارسال مرسوله", amount:120000, file:"receipt-1.pdf" },
      { id:2, date:"2025-09-03", title:"بسته‌بندی ویژه",     amount: 45000, file:"receipt-2.jpg"  },
    ]);
  }
})();

// ===== Search =====
(function mountSearch(){
  const q = document.getElementById("search-q");
  const btn = document.getElementById("search-btn");
  const results = document.getElementById("search-results");
  if (!q || !btn || !results) return;
  const SHOPS = [
    { slug:"negin-shoes", name:"کفش نگین",       cat:"مد و پوشاک" },
    { slug:"arad-mobile", name:"موبایل آراد",     cat:"کالای دیجیتال" },
    { slug:"ketab-cafe",  name:"کافه کتاب",       cat:"فرهنگی و هنری" },
    { slug:"almas-bags",  name:"کیف و کفش الماس", cat:"مد و پوشاک" },
    { slug:"homey",       name:"هومى هوم",        cat:"خانه و آشپزخانه" },
    { slug:"sportio",     name:"اسپورتیو",        cat:"ورزش و سفر" },
  ];
  function draw(list){
    results.innerHTML = list.map(s => (
      `<a class="card hover:shadow" href="./shop.html?shop=${s.slug}">
         <b>${s.name}</b><div class="muted">${s.cat}</div>
       </a>`
    )).join("");
  }
  draw(SHOPS);
  btn.addEventListener("click", () => {
    const v = (q.value||"").trim();
    if (!v) return draw(SHOPS);
    draw(SHOPS.filter(s => s.name.includes(v) || s.cat.includes(v)));
  });
})();

// ===== Categories =====
(function mountCategories(){
  const ul = document.getElementById("cat-list");
  if (!ul) return;
  const cats = [
    { name:"مد و پوشاک",     count:124 },
    { name:"کالای دیجیتال",   count: 89 },
    { name:"خوراک و نوشیدنی", count: 62 },
    { name:"زیبایی و سلامت",  count: 75 },
    { name:"خانه و آشپزخانه", count: 57 },
    { name:"ورزش و سفر",      count: 41 },
  ];
  ul.innerHTML = cats.map(c => (
    `<li class="card flex items-center justify-between">
       <span>${c.name}</span><span class="muted">${c.count} فروشگاه</span>
     </li>`
  )).join("");
})();

// ===== Vendor Profile =====
(function mountVendor(){
  const featured = document.getElementById("vendor-featured");
  const contacts = document.getElementById("vendor-contacts");
  if (!featured || !contacts) return;
  const prods = DB.get("vendorProducts", []);
  featured.innerHTML = prods.map(p => (
    `<div class="card"><b>${p.title}</b><div class="muted mt-1">${money(p.price)} تومان</div></div>`
  )).join("");
  contacts.innerHTML = `
    <li>اینستاگرام: <a class="text-indigo-600" href="#">@shop</a></li>
    <li>وب‌سایت: <a class="text-indigo-600" href="#">example.com</a></li>
  `;
})();

// ===== Client Dashboard =====
(function mountClientDashboard(){
  const tbody = document.getElementById("orders-tbody");
  const filter = document.getElementById("order-filter");
  const statOrders = document.getElementById("stat-orders");
  const statOpen = document.getElementById("stat-open");
  const statSpent = document.getElementById("stat-spent");
  const statAvg = document.getElementById("stat-avg");
  const timeline = document.getElementById("timeline");
  if (!tbody || !filter || !statOrders || !statOpen || !statSpent || !statAvg || !timeline) return;

  const orders = DB.get("orders", []);
  function badgeClass(s){
    switch (s) {
      case "processing": return "badge-yellow";
      case "shipping":   return "badge-blue";
      case "delivered":  return "badge-green";
      case "refunded":   return "badge-yellow";
      default:           return "badge-yellow";
    }
  }
  function statusText(s){
    switch (s) {
      case "processing": return "در حال پردازش";
      case "shipping":   return "در حال ارسال";
      case "delivered":  return "تحویل‌شده";
      case "refunded":   return "مرجوعی";
      default:           return s;
    }
  }
  function render(){
    const f = filter.value;
    const rows = orders.filter(o => f==="all" ? true : o.status===f);
    statOrders.textContent = String(orders.length);
    statOpen.textContent = String(orders.filter(o=>["processing","shipping"].includes(o.status)).length);
    const total = orders.reduce((s,o)=> s + (o.amount||0), 0);
    statSpent.textContent = money(total);
    statAvg.textContent = money(Math.round(total / Math.max(1, orders.length)));
    tbody.innerHTML = rows.map(o => (
      `<tr class="border-t hover:bg-gray-50" data-order="${o.id}">
         <td class="py-2">${o.id}</td>
         <td class="py-2">${o.date}</td>
         <td class="py-2">${o.vendor}</td>
         <td class="py-2"><span class="${badgeClass(o.status)}">${statusText(o.status)}</span></td>
         <td class="py-2">${money(o.amount)}</td>
         <td class="py-2"><a class="text-indigo-600" href="#">دانلود</a></td>
       </tr>`
    )).join("");
    Array.from(tbody.querySelectorAll("tr[data-order]")).forEach(tr => {
      tr.addEventListener("click", () => alert(`جزئیات سفارش ${tr.getAttribute("data-order")}`));
    });
    const recent = [...orders].reverse().slice(0,6);
    timeline.innerHTML = recent.map(o => (
      `<li>
         <div class="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full bg-indigo-500"></div>
         <div class="ms-4 text-sm"><b>${o.id}</b> • ${statusText(o.status)} <span class="muted">• ${o.date} • ${o.vendor}</span></div>
       </li>`
    )).join("");
  }
  document.getElementById("export-orders")?.addEventListener("click", () => {
    const header = "id,date,vendor,status,amount\n";
    const csv = header + orders.map(o=>[o.id,o.date,o.vendor,o.status,o.amount].join(",")).join("\n");
    const blob = new Blob([csv], {type:"text/csv;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "orders.csv"; a.click(); URL.revokeObjectURL(url);
  });
  filter.addEventListener("change", render);
  render();
})();

// ===== Vendor Dashboard KPIs =====
(function mountVendorDashboard(){
  const kToday = document.getElementById("kpi-today");
  const kOpen  = document.getElementById("kpi-open-orders");
  const kAov   = document.getElementById("kpi-aov");
  const kRet   = document.getElementById("kpi-returns");
  if (!kToday || !kOpen || !kAov || !kRet) return;
  const orders = DB.get("vendorOrders", []);
  const today = orders.filter(o => o.status !== "refunded").reduce((s,o)=> s + (o.amount||0), 0);
  kToday.textContent = money(today);
  kOpen.textContent  = String(orders.filter(o => o.status!=="delivered").length);
  const total = orders.reduce((s,o)=> s + (o.amount||0), 0);
  kAov.textContent   = money(Math.round(total / Math.max(1, orders.length)));
  kRet.textContent   = String(orders.filter(o => o.status==="refunded").length);
})();

// ===== Vendor Finance =====
(function mountVendorFinance(){
  const tbody = document.getElementById("receipts-tbody");
  const payoutsList = document.getElementById("payouts");
  if (!tbody || !payoutsList) return;
  const receipts = DB.get("receipts", []);
  const payouts = DB.get("payouts", [
    { date:"2025-09-01", amount: 5500000, status:"پرداخت‌شده" },
    { date:"2025-09-04", amount: 3200000, status:"در صف پرداخت" },
  ]);
  DB.set("payouts", payouts);
  const chart = document.getElementById("chart-revenue");
  if (chart) {
    const days = Array.from({length: 15}, () => Math.round(Math.random()*100)+20);
    chart.innerHTML = `<div class="flex items-end gap-1 h-full p-2">` +
      days.map(v=>`<div class="flex-1 bg-indigo-500/60 rounded" style="height:${v}%"></div>`).join("") +
      `</div>`;
  }
  function render(){
    tbody.innerHTML = receipts.map(r => (
      `<tr class="border-t">
         <td class="py-2">${r.id}</td>
         <td class="py-2">${r.date}</td>
         <td class="py-2">${r.title}</td>
         <td class="py-2">${money(r.amount)}</td>
         <td class="py-2"><a class="text-indigo-600" href="#">مشاهده</a></td>
       </tr>`
    )).join("");
    payoutsList.innerHTML = payouts.map(p => (
      `<li class="flex items-center justify-between border rounded-lg px-3 py-2">
         <span class="muted">${p.date}</span>
         <span class="font-medium">${money(p.amount)} تومان</span>
         <span class="${p.status==='پرداخت‌شده' ? 'badge-green' : 'badge-yellow'}">${p.status}</span>
       </li>`
    )).join("");
  }
  document.getElementById("receipt-file")?.addEventListener("change", (e) => {
    const f = e.target?.files?.[0]; if (!f) return;
    const nextId = (receipts.length ? receipts[receipts.length - 1].id : 0) + 1;
    receipts.push({ id: nextId, date: new Date().toISOString().slice(0,10), title: f.name, amount: Math.round(Math.random()*200000+50000), file: f.name });
    DB.set("receipts", receipts);
    render();
    alert("رسید ثبت شد (نمونه)");
  });
  document.getElementById("download-payouts")?.addEventListener("click", () => {
    const header = "date,amount,status\n";
    const csv = header + DB.get("payouts", []).map(p=>[p.date,p.amount,p.status].join(",")).join("\n");
    const blob = new Blob([csv], {type:"text/csv;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "payouts.csv"; a.click(); URL.revokeObjectURL(url);
  });
  render();
})();

// ===== Vendor Products =====
(function mountVendorProducts(){
  const grid = document.getElementById("products-grid");
  const addBtn = document.getElementById("add-product");
  const modal = document.getElementById("product-modal");
  const closeBtn = document.getElementById("close-product-modal");
  const cancelBtn = document.getElementById("cancel-product");
  const saveBtn = document.getElementById("save-product");
  if (!grid) return;
  let products = DB.get("vendorProducts", []);
  function render(){
    grid.innerHTML = products.map(p => (
      `<div class="card" data-id="${p.id}">
         <img src="${p.image}" class="w-full aspect-square object-cover rounded-lg" />
         <div class="mt-2 flex items-start justify-between">
           <div>
             <b>${p.title}</b>
             <div class="muted mt-1">${money(p.price)} تومان • موجودی ${p.stock}</div>
           </div>
           <div class="flex gap-2">
             <button class="text-indigo-600 text-sm btn-edit">ویرایش</button>
             <button class="text-red-600 text-sm btn-delete">حذف</button>
           </div>
         </div>
       </div>`
    )).join("");
    grid.querySelectorAll(".btn-delete").forEach(btn => {
      btn.addEventListener("click", (ev) => {
        const card = ev.target.closest("[data-id]");
        const id = card ? card.getAttribute("data-id") : null;
        if (!id) return;
        products = products.filter(x => x.id !== id);
        DB.set("vendorProducts", products);
        render();
      });
    });
    grid.querySelectorAll(".btn-edit").forEach(btn => btn.addEventListener("click", () => alert("ویرایش (دمو)")));
  }
  function openModal(){ modal?.classList.remove("hidden"); }
  function closeModal(){ modal?.classList.add("hidden"); }
  addBtn?.addEventListener("click", openModal);
  closeBtn?.addEventListener("click", closeModal);
  cancelBtn?.addEventListener("click", closeModal);
  saveBtn?.addEventListener("click", () => {
    const title = document.getElementById("p-title")?.value.trim() || "";
    const price = Number(document.getElementById("p-price")?.value || 0);
    const stock = Number(document.getElementById("p-stock")?.value || 0);
    const image = document.getElementById("p-image")?.value.trim() || "https://picsum.photos/seed/newprod/320/320";
    const desc  = document.getElementById("p-desc")?.value.trim() || "";
    if (!title || !price) { alert("عنوان و قیمت الزامی است"); return; }
    const id = "P-" + Math.random().toString(36).slice(2,7);
    products.push({ id, title, price, stock, image, desc });
    DB.set("vendorProducts", products);
    closeModal(); render();
  });
  render();
})();

// ===== Vendor Orders =====
(function mountVendorOrders(){
  const tbody = document.getElementById("vendor-orders-tbody");
  const filter = document.getElementById("vendor-order-filter");
  if (!tbody || !filter) return;
  let orders = DB.get("vendorOrders", []);
  function draw(){
    const f = filter.value;
    const rows = orders.filter(o => f==="all" ? true : o.status===f);
    tbody.innerHTML = rows.map(o => (
      `<tr class="border-t" data-id="${o.id}">
         <td class="py-2">${o.id}</td>
         <td class="py-2">${o.customer}</td>
         <td class="py-2">${o.items}</td>
         <td class="py-2">${money(o.amount)}</td>
         <td class="py-2">
           <select class="input text-xs sel-status">
             <option value="processing"${o.status==='processing'?' selected':''}>در حال پردازش</option>
             <option value="shipping"${o.status==='shipping'?' selected':''}>در حال ارسال</option>
             <option value="delivered"${o.status==='delivered'?' selected':''}>تحویل‌شده</option>
             <option value="refunded"${o.status==='refunded'?' selected':''}>مرجوعی</option>
           </select>
         </td>
         <td class="py-2"><button class="btn-outline text-xs btn-label">چاپ برچسب</button></td>
       </tr>`
    )).join("");
    tbody.querySelectorAll("tr[data-id]").forEach(tr => {
      const id = tr.getAttribute("data-id") || "";
      tr.querySelector(".sel-status")?.addEventListener("change", (e) => {
        const val = e.target.value;
        orders = orders.map(x => x.id === id ? { ...x, status: val } : x);
        DB.set("vendorOrders", orders);
      });
      tr.querySelector(".btn-label")?.addEventListener("click", () => alert(`چاپ برچسب ${id}`));
    });
  }
  filter.addEventListener("change", draw);
  draw();
})();
