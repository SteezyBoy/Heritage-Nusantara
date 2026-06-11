// ==================== KONFIGURASI ====================
const APPS_SCRIPT_URL = "PASTE_YOUR_APPS_SCRIPT_URL_HERE"; // Ganti dengan URL dari Apps Script

let currentCategory = "all";
let currentItem = null;
let cart = [];
let favorites = JSON.parse(localStorage.getItem("hn_favorites") || "[]");
let currentSearchKeyword = "";
let quickAddItem = null;
let quickQty = 1;
let isDarkMode = localStorage.getItem("hn_darkmode") === "true";

let menuData = { makanan: [], minuman: [], dessert: [] };

// ==================== INIT ====================
document.addEventListener("DOMContentLoaded", async () => {
  applyDarkMode();
  showSkeletonLoading();
  await loadMenuFromSheet();
  renderMenu();
});

// ==================== AMBIL MENU DARI SHEETS ====================
async function loadMenuFromSheet() {
  if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL === "PASTE_YOUR_APPS_SCRIPT_URL_HERE") {
    console.warn("URL Apps Script belum diset, pakai menu default");
    setDefaultMenu();
    return;
  }
  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?action=getMenu`);
    const data = await res.json();
    if (data.menu) {
      menuData = data.menu;
      for (let cat in menuData) {
        menuData[cat] = menuData[cat].map(item => ({
          ...item,
          price: Number(item.price),
          bestSeller: item.bestSeller === true || item.bestSeller === "true"
        }));
      }
    } else {
      setDefaultMenu();
    }
  } catch (err) {
    console.error("Gagal ambil menu dari Sheets:", err);
    setDefaultMenu();
  }
}

function setDefaultMenu() {
  menuData = {
    makanan: [
      { name: "Tahu Isi Goreng", category: "Appetizer", bestSeller: true, image: "images/TAHU ISI GORENG.jpeg", desc: "Tahu renyah isi sayuran segar", price: 35000 },
      { name: "Lumpia Semarang", category: "Appetizer", bestSeller: false, image: "images/LUMPIA SEMARANG.jpeg", desc: "Camilan legendaris khas Semarang", price: 45000 },
      { name: "Soto Ayam Lamongan", category: "Soup", bestSeller: true, image: "images/SOTO AYAM LAMONGAN.jpeg", desc: "Kuah kuning kaya rempah", price: 40000 },
      { name: "Rendang Daging Sapi", category: "Main Course", bestSeller: true, image: "images/RENDANG DAGING SAPI.jpeg", desc: "Mahakarya kuliner Minang", price: 90000 },
    ],
    minuman: [
      { name: "Es Teh", category: "Beverage", bestSeller: false, image: "images/ES TEH.jpeg", desc: "Teh melati dingin", price: 25000 },
      { name: "Es Kelapa Muda", category: "Beverage", bestSeller: true, image: "images/ES KELAPA MUDA.jpeg", desc: "Air kelapa segar", price: 65000 },
    ],
    dessert: [
      { name: "Klepon", category: "Dessert", bestSeller: true, image: "images/KLEPON.jpeg", desc: "Jajanan pasar kenyal", price: 30000 },
    ]
  };
}

// ==================== DARK MODE ====================
function toggleDarkMode() {
  isDarkMode = !isDarkMode;
  localStorage.setItem("hn_darkmode", isDarkMode);
  applyDarkMode();
}
function applyDarkMode() {
  document.documentElement.setAttribute("data-theme", isDarkMode ? "dark" : "light");
  const icon = document.getElementById("darkmodeIcon");
  if (icon) icon.textContent = isDarkMode ? "☀️" : "🌙";
}

// ==================== HELPERS ====================
function formatPrice(price) {
  return "Rp " + price.toLocaleString("id-ID");
}
function getAllItems() {
  return [...menuData.makanan, ...menuData.dessert, ...menuData.minuman];
}
function showSuccessPopup() {
  const popup = document.getElementById("success-popup");
  if (!popup) return;
  popup.classList.add("show");
  setTimeout(() => popup.classList.remove("show"), 2000);
}
function showShareToast(msg) {
  const toast = document.getElementById("shareToast");
  if (toast) { toast.textContent = msg; toast.classList.add("show"); setTimeout(() => toast.classList.remove("show"), 2500); }
}

// ==================== SKELETON & RENDER ====================
function showSkeletonLoading() {
  const menuList = document.getElementById("menu-list");
  if (!menuList) return;
  menuList.innerHTML = "";
  for (let i = 0; i < 4; i++) {
    menuList.innerHTML += `<div class="skeleton-card"><div class="skeleton-img skeleton-pulse"></div><div class="skeleton-body"><div class="skeleton-tag skeleton-pulse"></div><div class="skeleton-title skeleton-pulse"></div><div class="skeleton-price skeleton-pulse"></div><div class="skeleton-desc skeleton-pulse"></div><div class="skeleton-btns"><div class="skeleton-btn skeleton-pulse"></div><div class="skeleton-btn skeleton-pulse"></div></div></div></div>`;
  }
}

function getFilteredAndSortedItems() {
  let items = currentCategory === "all" ? getAllItems() : [...menuData[currentCategory] || []];
  if (currentSearchKeyword.trim() !== "") {
    items = items.filter(item => item.name.toLowerCase().includes(currentSearchKeyword.toLowerCase()));
  }
  const sortValue = document.getElementById("sortMenu")?.value;
  if (sortValue === "az") items.sort((a,b) => a.name.localeCompare(b.name));
  else if (sortValue === "za") items.sort((a,b) => b.name.localeCompare(a.name));
  else if (sortValue === "low") items.sort((a,b) => a.price - b.price);
  else if (sortValue === "high") items.sort((a,b) => b.price - a.price);
  return items;
}

function renderMenu() {
  const items = getFilteredAndSortedItems();
  const menuList = document.getElementById("menu-list");
  if (!menuList) return;
  menuList.innerHTML = "";
  if (items.length === 0) {
    menuList.innerHTML = `<div class="empty-state"><div class="empty-state-icon">🍽️</div><h3>Menu tidak ditemukan</h3><p>Coba kata kunci lain</p><button class="empty-state-btn" onclick="clearSearch()">Clear Search</button></div>`;
    return;
  }
  items.forEach((item, idx) => {
    const safeName = item.name.replace(/'/g, "\\'");
    const isFav = favorites.includes(item.name);
    const card = document.createElement("div");
    card.className = "menu-card";
    card.style.animationDelay = `${idx * 0.06}s`;
    card.innerHTML = `
      <div class="image-wrapper">
        ${item.bestSeller ? `<div class="best-seller">🔥 BEST SELLER</div>` : ''}
        <button class="card-fav-btn ${isFav ? 'active' : ''}" onclick="toggleFav(event,'${safeName}')" title="Favorite">${isFav ? '❤️' : '🤍'}</button>
        <img src="${item.image}" alt="${item.name}" loading="lazy" class="menu-img" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22240%22><rect fill=%22%23f1f5f9%22 width=%22400%22 height=%22240%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2240%22>🍽️</text></svg>'">
      </div>
      <div class="menu-info">
        <div class="food-tag">${item.category}</div>
        <h3>${item.name}</h3>
        <div class="price">${formatPrice(item.price)}</div>
        <p>${item.desc}</p>
        <div class="card-actions">
          <button class="detail-btn" onclick="openModalByName('${safeName}')">View Details</button>
          <button class="add-to-cart-btn" onclick="openQuickAddPopup('${safeName}')">+ Add To Cart</button>
        </div>
      </div>`;
    menuList.appendChild(card);
  });
}

// ==================== FAVORITES ====================
function toggleFav(event, itemName) {
  event.stopPropagation();
  const idx = favorites.indexOf(itemName);
  if (idx === -1) favorites.push(itemName); else favorites.splice(idx,1);
  localStorage.setItem("hn_favorites", JSON.stringify(favorites));
  renderMenu();
  if (currentItem && currentItem.name === itemName) updateModalFavBtn();
}
function toggleFavFromModal() {
  if (!currentItem) return;
  const idx = favorites.indexOf(currentItem.name);
  if (idx === -1) favorites.push(currentItem.name); else favorites.splice(idx,1);
  localStorage.setItem("hn_favorites", JSON.stringify(favorites));
  updateModalFavBtn();
  renderMenu();
}
function updateModalFavBtn() {
  const btn = document.getElementById("modalFavBtn");
  if (!btn || !currentItem) return;
  const isFav = favorites.includes(currentItem.name);
  btn.textContent = isFav ? "❤️" : "♡";
  btn.classList.toggle("fav-active", isFav);
}
function openFavModal() {
  const favList = document.getElementById("fav-list");
  const favEmpty = document.getElementById("fav-empty");
  if (!favList) return;
  favList.innerHTML = "";
  if (favorites.length === 0) {
    if(favEmpty) favEmpty.style.display = "block";
    favList.style.display = "none";
  } else {
    if(favEmpty) favEmpty.style.display = "none";
    favList.style.display = "block";
    const allItems = getAllItems();
    favorites.forEach(name => {
      const item = allItems.find(i => i.name === name);
      if (!item) return;
      const safeName = item.name.replace(/'/g, "\\'");
      favList.innerHTML += `<div class="fav-item"><img src="${item.image}"><div class="fav-item-info"><strong>${item.name}</strong><span>${formatPrice(item.price)}</span></div><div class="fav-item-actions"><button class="fav-add-btn" onclick="closeFavModal(); openQuickAddPopup('${safeName}')">+ Cart</button><button class="fav-remove-btn" onclick="removeFav('${safeName}')">🗑</button></div></div>`;
    });
  }
  document.getElementById("favModal").style.display = "flex";
}
function closeFavModal() { document.getElementById("favModal").style.display = "none"; }
function removeFav(name) {
  const idx = favorites.indexOf(name);
  if (idx !== -1) favorites.splice(idx,1);
  localStorage.setItem("hn_favorites", JSON.stringify(favorites));
  renderMenu();
  openFavModal();
}

// ==================== MODAL DETAIL ====================
function openModalByName(itemName) {
  const items = getAllItems();
  currentItem = items.find(i => i.name === itemName);
  if (!currentItem) return;
  document.getElementById("modal-qty").innerText = "1";
  document.getElementById("modal-notes").value = "";
  document.getElementById("modal-image").src = currentItem.image;
  document.getElementById("modal-name").innerText = currentItem.name;
  document.getElementById("modal-category").innerText = currentItem.category;
  document.getElementById("modal-price").innerText = formatPrice(currentItem.price);
  document.getElementById("modal-desc").innerText = currentItem.desc;
  updateModalFavBtn();
  const scrollable = document.querySelector(".modal-scrollable");
  if (scrollable) scrollable.scrollTop = 0;
  document.getElementById("modal").style.display = "flex";
}
function closeModal() { document.getElementById("modal").style.display = "none"; currentItem = null; }
function increaseModalQty() { let s=document.getElementById("modal-qty"); s.innerText = parseInt(s.innerText)+1; }
function decreaseModalQty() { let s=document.getElementById("modal-qty"); let v=parseInt(s.innerText); if(v>1) s.innerText = v-1; }
function addToCartFromModal() {
  if (!currentItem) return;
  const qty = parseInt(document.getElementById("modal-qty").innerText);
  const notes = document.getElementById("modal-notes").value.trim();
  addItemToCart(currentItem, qty, notes);
  closeModal(); showSuccessPopup();
}

// ==================== QUICK ADD ====================
function openQuickAddPopup(itemName) {
  const items = getAllItems();
  quickAddItem = items.find(i => i.name === itemName);
  if (!quickAddItem) return;
  quickQty = 1;
  document.getElementById("quickQty").innerText = quickQty;
  document.getElementById("quickAddItemName").innerText = quickAddItem.name;
  document.getElementById("quickNotes").value = "";
  document.getElementById("quickAddModal").style.display = "flex";
}
function closeQuickAddModal() { document.getElementById("quickAddModal").style.display = "none"; quickAddItem = null; }
function increaseQuickQty() { quickQty++; document.getElementById("quickQty").innerText = quickQty; }
function decreaseQuickQty() { if(quickQty>1){ quickQty--; document.getElementById("quickQty").innerText = quickQty; } }
function confirmQuickAdd() {
  if (!quickAddItem) return;
  const notes = document.getElementById("quickNotes").value.trim();
  addItemToCart(quickAddItem, quickQty, notes);
  closeQuickAddModal(); showSuccessPopup();
}

// ==================== CART ====================
function addItemToCart(item, qty, notes) {
  const existing = cart.find(c => c.name === item.name);
  if (existing) {
    existing.quantity += qty;
    if (notes) existing.notes = existing.notes ? existing.notes + "; " + notes : notes;
  } else {
    cart.push({ ...item, quantity: qty, notes: notes });
  }
  updateCartBadge();
  animateCartIcon();
}
function updateCartBadge() {
  const totalItems = cart.reduce((sum,i) => sum + i.quantity, 0);
  const badge = document.getElementById("cart-count");
  if (badge) badge.innerText = totalItems;
}
function animateCartIcon() {
  const btn = document.getElementById("cartIconBtn");
  if(!btn) return;
  btn.classList.remove("cart-pop");
  void btn.offsetWidth;
  btn.classList.add("cart-pop");
  setTimeout(()=>btn.classList.remove("cart-pop"),500);
}
function updateCart() {
  updateCartBadge();
  const container = document.getElementById("cart-items");
  const emptyState = document.getElementById("cart-empty-state");
  if(!container) return;
  container.innerHTML = "";
  if (cart.length === 0) {
    if(emptyState) emptyState.style.display = "block";
    container.style.display = "none";
    const totalSpan = document.getElementById("cart-total");
    if(totalSpan) totalSpan.innerText = formatPrice(0);
    return;
  }
  if(emptyState) emptyState.style.display = "none";
  container.style.display = "block";
  let total = 0;
  cart.forEach((item,idx) => {
    total += item.price * item.quantity;
    container.innerHTML += `<div class="cart-item"><div class="cart-item-info"><strong>${item.name}</strong><div class="cart-item-price">${formatPrice(item.price * item.quantity)}</div>${item.notes ? `<span class="cart-notes">📝 ${item.notes}</span>` : ''}</div><div class="cart-item-controls"><button class="btn-qty" onclick="changeCartQty(${idx}, -1)">-</button><span>${item.quantity}</span><button class="btn-qty" onclick="changeCartQty(${idx}, 1)">+</button><button class="btn-remove" onclick="removeCartItem(${idx})">🗑️</button></div></div>`;
  });
  document.getElementById("cart-total").innerText = formatPrice(total);
}
function changeCartQty(index, amount) {
  cart[index].quantity += amount;
  if (cart[index].quantity <= 0) cart.splice(index,1);
  updateCart();
}
function removeCartItem(index) { cart.splice(index,1); updateCart(); }
function clearCart() { if(cart.length && confirm("Clear all items?")) { cart=[]; updateCart(); } }

function openCart() {
  updateCart();
  document.getElementById("cartModal").style.display = "block";
  document.getElementById("cart-screen").style.display = "block";
  document.getElementById("order-summary-screen").style.display = "none";
  document.getElementById("payment-screen").style.display = "none";
}
function closeCart() { document.getElementById("cartModal").style.display = "none"; }

function openOrderSummary() {
  if (cart.length === 0) { showShareToast("Cart kosong!"); return; }
  const summaryContainer = document.getElementById("order-summary-items");
  if(!summaryContainer) return;
  summaryContainer.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.quantity;
    summaryContainer.innerHTML += `<div class="summary-item"><div class="summary-item-left"><span class="summary-item-qty">${item.quantity}×</span><span class="summary-item-name">${item.name}</span>${item.notes?`<span class="summary-item-note">📝 ${item.notes}</span>`:''}</div><span class="summary-item-price">${formatPrice(item.price*item.quantity)}</span></div>`;
  });
  document.getElementById("order-summary-grand-total").innerText = formatPrice(total);
  const now = new Date();
  const timeStr = now.toLocaleString("id-ID", { dateStyle:"medium", timeStyle:"short" });
  document.getElementById("order-time-display").innerHTML = `🕐 Order Time: ${timeStr}`;
  document.getElementById("cart-screen").style.display = "none";
  document.getElementById("order-summary-screen").style.display = "block";
}

async function openPayment() {
  const tableNum = document.getElementById("tableNumber")?.value.trim() || "—";
  const total = cart.reduce((sum,item)=>sum+item.price*item.quantity,0);
  const now = new Date();
  const timeStr = now.toLocaleString("id-ID",{dateStyle:"medium",timeStyle:"short"});
  if(document.getElementById("payTableInfo")) document.getElementById("payTableInfo").innerHTML = `🪑 Table: <strong>${tableNum}</strong>`;
  if(document.getElementById("payTotalInfo")) document.getElementById("payTotalInfo").innerHTML = `💰 Total: <strong>${formatPrice(total)}</strong>`;
  if(document.getElementById("payTimeInfo")) document.getElementById("payTimeInfo").innerHTML = `🕐 Time: <strong>${timeStr}</strong>`;
  document.getElementById("order-summary-screen").style.display = "none";
  document.getElementById("payment-screen").style.display = "block";

  if (APPS_SCRIPT_URL && APPS_SCRIPT_URL !== "PASTE_YOUR_APPS_SCRIPT_URL_HERE") {
    try {
      const orderData = {
        action: "newOrder",
        tableNumber: tableNum,
        items: cart.map(item => ({ name: item.name, qty: item.quantity, price: item.price, notes: item.notes || "" }))
      };
      const res = await fetch(APPS_SCRIPT_URL, { method:"POST", headers:{ "Content-Type":"text/plain" }, body:JSON.stringify(orderData) });
      const result = await res.json();
      if (result.status === "ok" && document.getElementById("payOrderId")) {
        document.getElementById("payOrderId").innerHTML = `✅ Order ID: <strong>${result.orderId}</strong>`;
        cart = [];
        updateCartBadge();
      }
    } catch(err) { console.warn("Gagal kirim ke Sheets:", err); if(document.getElementById("payOrderId")) document.getElementById("payOrderId").innerHTML = `⚠️ Pesanan tersimpan lokal`; }
  }
}
function backToCart() { document.getElementById("order-summary-screen").style.display = "none"; document.getElementById("cart-screen").style.display = "block"; }
function backToSummary() { document.getElementById("payment-screen").style.display = "none"; document.getElementById("order-summary-screen").style.display = "block"; }

// ==================== SEARCH, SORT, CATEGORY ====================
function searchMenu() { currentSearchKeyword = document.getElementById("searchInput")?.value || ""; renderMenu(); }
function sortMenu() { renderMenu(); }
function changeCategory(btn, category) {
  document.querySelectorAll(".category-btn").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
  currentCategory = category;
  currentSearchKeyword = "";
  const searchInput = document.getElementById("searchInput");
  if(searchInput) searchInput.value = "";
  showSkeletonLoading();
  setTimeout(()=>renderMenu(), 400);
}
function clearSearch() {
  const searchInput = document.getElementById("searchInput");
  if(searchInput) searchInput.value = "";
  currentSearchKeyword = "";
  renderMenu();
}

// ==================== CLOSE MODAL OUTSIDE CLICK ====================
window.onclick = function(event) {
  const modal = document.getElementById("modal");
  const cartModal = document.getElementById("cartModal");
  const quickModal = document.getElementById("quickAddModal");
  const favModal = document.getElementById("favModal");
  if (event.target === modal) closeModal();
  if (event.target === cartModal) closeCart();
  if (event.target === quickModal) closeQuickAddModal();
  if (event.target === favModal) closeFavModal();
};
