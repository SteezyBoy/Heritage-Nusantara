// ==================== MENU DATA ====================
const menuData = {
    makanan: [
        { name: "Tahu Isi Goreng", category: "Appetizer", bestSeller: true, image: "images/TAHU ISI GORENG.jpeg", desc: "Tahu renyah yang digoreng keemasan, berisi sayuran segar pilihan. Disajikan dengan saus sambal pedas manis yang menggugah selera.", price: 35000 },
        { name: "Lumpia Semarang", category: "Appetizer", bestSeller: false, image: "images/LUMPIA SEMARANG.jpeg", desc: "Camilan legendaris khas Semarang dengan isian rebung manis gurih, dibalut kulit lumpia yang renyah sempurna.", price: 45000 },
        { name: "Perkedel Kentang", category: "Appetizer", bestSeller: false, image: "images/PERKEDEL KENTANG.jpeg", desc: "Perkedel kentang lembut dengan paduan bumbu rempah tradisional, digoreng hingga kecokelatan. Pendamping setia untuk setiap hidangan.", price: 45000 },
        { name: "Soto Ayam Lamongan", category: "Soup", bestSeller: true, image: "images/SOTO AYAM LAMONGAN.jpeg", desc: "Kuah soto kuning kaya rempah dengan suwiran ayam kampung, telur rebus, dan taburan koya gurih khas Lamongan.", price: 40000 },
        { name: "Soup Buntut", category: "Soup", bestSeller: true, image: "images/SOP BUNTUT.jpeg", desc: "Potongan buntut sapi premium yang dimasak perlahan hingga empuk, disajikan dalam kaldu bening bertabur sayuran segar.", price: 70000 },
        { name: "Soup Ikan Batam", category: "Soup", bestSeller: false, image: "images/SOUP IKAN BATAM.jpeg", desc: "Sop ikan segar khas perairan Kepulauan Riau dengan kuah asam gurih yang ringan, dilengkapi irisan tomat hijau dan selada.", price: 70000 },
        { name: "Nasi Goreng Kampung", category: "Main Course", bestSeller: true, image: "images/NASI GORENG KAMPUNG.jpeg", desc: "Nasi goreng beraroma terasi khas pedesaan, disajikan lengkap dengan telur mata sapi, kerupuk, dan acar segar.", price: 75000 },
        { name: "Ayam Bakar Taliwang", category: "Main Course", bestSeller: true, image: "images/AYAM BAKAR TALIWANG.jpeg", desc: "Ayam kampung bakar bumbu pedas manis khas Lombok, meresap sempurna hingga ke tulang. Menghadirkan sensasi pedas yang bikin nagih.", price: 85000 },
        { name: "Rendang Daging Sapi", category: "Main Course", bestSeller: true, image: "images/RENDANG DAGING SAPI.jpeg", desc: "Mahakarya kuliner Minang. Daging sapi pilihan yang dimasak perlahan dengan santan dan bumbu rahasia berjam-jam hingga empuk dan kaya rasa.", price: 90000 }
    ],
    minuman: [
        { name: "Es Teh", category: "Beverage", bestSeller: false, image: "images/ES TEH.jpeg", desc: "Seduhan teh melati pilihan yang dihidangkan dingin. Kesegaran klasik yang tak pernah salah di segala suasana.", price: 25000 },
        { name: "Es Kelapa Muda", category: "Beverage", bestSeller: true, image: "images/ES KELAPA MUDA.jpeg", desc: "Air kelapa segar murni dengan serutan daging kelapa muda yang lembut. Penghilang dahaga paling alami yang memanjakan tenggorokan.", price: 65000 },
        { name: "Teh Rosella", category: "Beverage", bestSeller: false, image: "images/TEH ROSELLA.jpeg", desc: "Seduhan bunga rosella merah merona yang kaya antioksidan, memberikan sensasi rasa asam manis yang menenangkan hati.", price: 35000 },
        { name: "Es Jeruk", category: "Beverage", bestSeller: false, image: "images/ES JERUK.jpeg", desc: "Perasan jeruk peras asli yang manis dan menyegarkan, penuh dengan kebaikan vitamin C alami untuk hari Anda.", price: 30000 },
        { name: "Teh Tarik", category: "Beverage", bestSeller: true, image: "images/TEH TARIK.jpeg", desc: "Paduan teh hitam pekat dan susu kental manis yang 'ditarik' hingga berbusa lembut. Cita rasa kopitiam otentik khas Nusantara.", price: 35000 },
        { name: "Wedang Jahe", category: "Beverage", bestSeller: false, image: "images/WEDANG JAHE.jpeg", desc: "Minuman tradisional penghangat tubuh dari jahe bakar asli dan gula aren. Cocok dinikmati saat bersantai menenangkan pikiran.", price: 25000 },
        { name: "Beer Pletok", category: "Beverage", bestSeller: false, image: "images/BEER PLETOK.jpeg", desc: "Minuman rempah non-alkohol khas Betawi yang memadukan jahe, secang, dan serai. Hangat di tenggorokan, segar di badan.", price: 45000 },
        { name: "Kopi Bali", category: "Beverage", bestSeller: true, image: "images/KOPI BALI.jpeg", desc: "Kopi tubruk dari biji kopi Bali premium dengan aroma rempah khas yang kuat dan body yang tebal. Pilihan sempurna para pencinta kopi.", price: 30000 },
        { name: "Equil Water", category: "Beverage", bestSeller: false, image: "images/EQUIL Water.jpeg", desc: "Air mineral alami berkarbonasi premium, diproses secara higienis untuk mengembalikan kesegaran alami tubuh Anda.", price: 50000 }
    ],
    dessert: [
        { name: "Klepon", category: "Dessert", bestSeller: true, image: "images/KLEPON.jpeg", desc: "Jajanan pasar kenyal bertabur kelapa parut segar, dengan kejutan gula aren cair yang lumer dan manis di mulut.", price: 30000 },
        { name: "Puding Gula Aren", category: "Dessert", bestSeller: false, image: "images/PUDING GULA AREN.jpeg", desc: "Makanan penutup lembut dengan manisnya gula aren asli dan siraman vla santan gurih. Cita rasa klasik yang memanjakan lidah.", price: 45000 },
        { name: "Es Cendol", category: "Dessert", bestSeller: true, image: "images/ES CENDOL.jpeg", desc: "Paduan kenyalnya cendol pandan, manisnya sirup gula aren lekat, dan gurihnya santan berpadu sempurna dalam kesegaran es serut.", price: 45000 }
    ]
};

// ==================== GLOBAL STATE ====================
let currentCategory = "all";
let currentItem = null;
let cart = [];
let favorites = JSON.parse(localStorage.getItem("hn_favorites") || "[]");
let currentSearchKeyword = "";
let quickAddItem = null;
let quickQty = 1;
let isDarkMode = localStorage.getItem("hn_darkmode") === "true";

// ==================== INIT ====================
document.addEventListener("DOMContentLoaded", () => {
    applyDarkMode();
    showSkeletonLoading();
    setTimeout(() => {
        renderMenu();
    }, 700);
});

// ==================== DARK MODE ====================
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    localStorage.setItem("hn_darkmode", isDarkMode);
    applyDarkMode();
}

function applyDarkMode() {
    document.documentElement.setAttribute("data-theme", isDarkMode ? "dark" : "light");
    document.getElementById("darkmodeIcon").textContent = isDarkMode ? "☀️" : "🌙";
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
    popup.classList.add("show");
    setTimeout(() => { popup.classList.remove("show"); }, 2000);
}

function showShareToast(msg) {
    const toast = document.getElementById("shareToast");
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
}

// ==================== SKELETON LOADING ====================
function showSkeletonLoading() {
    const menuList = document.getElementById("menu-list");
    menuList.innerHTML = "";
    for (let i = 0; i < 4; i++) {
        menuList.innerHTML += `
        <div class="skeleton-card">
            <div class="skeleton-img skeleton-pulse"></div>
            <div class="skeleton-body">
                <div class="skeleton-tag skeleton-pulse"></div>
                <div class="skeleton-title skeleton-pulse"></div>
                <div class="skeleton-price skeleton-pulse"></div>
                <div class="skeleton-desc skeleton-pulse"></div>
                <div class="skeleton-btns">
                    <div class="skeleton-btn skeleton-pulse"></div>
                    <div class="skeleton-btn skeleton-pulse"></div>
                </div>
            </div>
        </div>`;
    }
}

// ==================== EMPTY STATE ====================
function showEmptyState(keyword) {
    const menuList = document.getElementById("menu-list");
    menuList.innerHTML = `
    <div class="empty-state">
        <div class="empty-state-icon">🍽️</div>
        <h3>No menu found</h3>
        <p>No results for "<strong>${keyword}</strong>"</p>
        <button class="empty-state-btn" onclick="clearSearch()">Clear Search</button>
    </div>`;
}

function clearSearch() {
    document.getElementById("searchInput").value = "";
    currentSearchKeyword = "";
    renderMenu();
}

// ==================== RENDER MENU ====================
function getFilteredAndSortedItems() {
    let items = currentCategory === "all" ? getAllItems() : [...menuData[currentCategory]];
    if (currentSearchKeyword.trim() !== "") {
        items = items.filter(item => item.name.toLowerCase().includes(currentSearchKeyword.toLowerCase()));
    }
    const sortValue = document.getElementById("sortMenu").value;
    if (sortValue === "az") items.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortValue === "za") items.sort((a, b) => b.name.localeCompare(a.name));
    else if (sortValue === "low") items.sort((a, b) => a.price - b.price);
    else if (sortValue === "high") items.sort((a, b) => b.price - a.price);
    return items;
}

function renderMenu() {
    const items = getFilteredAndSortedItems();
    const menuList = document.getElementById("menu-list");
    menuList.innerHTML = "";

    if (items.length === 0) {
        showEmptyState(currentSearchKeyword || "this category");
        return;
    }

    items.forEach((item, index) => {
        const safeName = item.name.replace(/'/g, "\\'");
        const isFav = favorites.includes(item.name);
        const card = document.createElement("div");
        card.className = "menu-card";
        card.style.animationDelay = `${index * 0.06}s`;
        card.innerHTML = `
            <div class="image-wrapper">
                ${item.bestSeller ? `<div class="best-seller">🔥 BEST SELLER</div>` : ''}
                <button class="card-fav-btn ${isFav ? 'active' : ''}" onclick="toggleFav(event,'${safeName}')" title="Favorite">
                    ${isFav ? '❤️' : '🤍'}
                </button>
                <img src="${item.image}" alt="${item.name}" loading="lazy" class="menu-img"
                     onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22240%22><rect fill=%22%23f1f5f9%22 width=%22400%22 height=%22240%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2240%22>🍽️</text></svg>'">
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
    if (idx === -1) {
        favorites.push(itemName);
    } else {
        favorites.splice(idx, 1);
    }
    localStorage.setItem("hn_favorites", JSON.stringify(favorites));
    renderMenu();
    // Update modal fav button jika terbuka
    if (currentItem && currentItem.name === itemName) updateModalFavBtn();
}

function toggleFavFromModal() {
    if (!currentItem) return;
    const idx = favorites.indexOf(currentItem.name);
    if (idx === -1) {
        favorites.push(currentItem.name);
    } else {
        favorites.splice(idx, 1);
    }
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
    favList.innerHTML = "";
    if (favorites.length === 0) {
        favEmpty.style.display = "block";
        favList.style.display = "none";
    } else {
        favEmpty.style.display = "none";
        favList.style.display = "block";
        const allItems = getAllItems();
        favorites.forEach(name => {
            const item = allItems.find(i => i.name === name);
            if (!item) return;
            const safeName = item.name.replace(/'/g, "\\'");
            favList.innerHTML += `
            <div class="fav-item">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
                <div class="fav-item-info">
                    <strong>${item.name}</strong>
                    <span>${formatPrice(item.price)}</span>
                </div>
                <div class="fav-item-actions">
                    <button class="fav-add-btn" onclick="closeFavModal(); openQuickAddPopup('${safeName}')">+ Cart</button>
                    <button class="fav-remove-btn" onclick="removeFav('${safeName}')">🗑</button>
                </div>
            </div>`;
        });
    }
    document.getElementById("favModal").style.display = "flex";
}

function closeFavModal() {
    document.getElementById("favModal").style.display = "none";
}

function removeFav(name) {
    const idx = favorites.indexOf(name);
    if (idx !== -1) favorites.splice(idx, 1);
    localStorage.setItem("hn_favorites", JSON.stringify(favorites));
    renderMenu();
    openFavModal();
}

// ==================== SHARE MENU ====================
function shareItem() {
    if (!currentItem) return;
    const text = `🍽️ ${currentItem.name}\n${formatPrice(currentItem.price)}\n\n${currentItem.desc}\n\n— Heritage Nusantara, Authentic Indonesian Cuisine`;
    if (navigator.share) {
        navigator.share({ title: currentItem.name, text: text })
            .catch(() => {});
    } else {
        navigator.clipboard.writeText(text).then(() => {
            showShareToast("📋 Menu info copied to clipboard!");
        }).catch(() => {
            showShareToast("💡 Share: " + currentItem.name);
        });
    }
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
    // Scroll ke atas saat buka
    const scrollable = document.querySelector(".modal-scrollable");
    if (scrollable) scrollable.scrollTop = 0;
    document.getElementById("modal").style.display = "flex";
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
    currentItem = null;
}

function increaseModalQty() {
    let qtySpan = document.getElementById("modal-qty");
    qtySpan.innerText = parseInt(qtySpan.innerText) + 1;
}

function decreaseModalQty() {
    let qtySpan = document.getElementById("modal-qty");
    let val = parseInt(qtySpan.innerText);
    if (val > 1) qtySpan.innerText = val - 1;
}

function addToCartFromModal() {
    if (!currentItem) return;
    const qty = parseInt(document.getElementById("modal-qty").innerText);
    const notes = document.getElementById("modal-notes").value.trim();
    addItemToCart(currentItem, qty, notes);
    closeModal();
    showSuccessPopup();
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

function closeQuickAddModal() {
    document.getElementById("quickAddModal").style.display = "none";
    quickAddItem = null;
}

function increaseQuickQty() { quickQty++; document.getElementById("quickQty").innerText = quickQty; }
function decreaseQuickQty() { if (quickQty > 1) { quickQty--; document.getElementById("quickQty").innerText = quickQty; } }

function confirmQuickAdd() {
    if (!quickAddItem) return;
    const notes = document.getElementById("quickNotes").value.trim();
    addItemToCart(quickAddItem, quickQty, notes);
    closeQuickAddModal();
    showSuccessPopup();
}

// ==================== CART CORE ====================
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
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById("cart-count");
    badge.innerText = totalItems;
}

function animateCartIcon() {
    const btn = document.getElementById("cartIconBtn");
    if (!btn) return;
    btn.classList.remove("cart-pop");
    void btn.offsetWidth;
    btn.classList.add("cart-pop");
    setTimeout(() => btn.classList.remove("cart-pop"), 500);
}

function updateCart() {
    updateCartBadge();
    const container = document.getElementById("cart-items");
    const emptyState = document.getElementById("cart-empty-state");
    container.innerHTML = "";

    if (cart.length === 0) {
        emptyState.style.display = "block";
        container.style.display = "none";
        document.getElementById("cart-total").innerText = formatPrice(0);
        return;
    }

    emptyState.style.display = "none";
    container.style.display = "block";

    let total = 0;
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
        <div class="cart-item-info">
            <strong>${item.name}</strong>
            <div class="cart-item-price">${formatPrice(item.price * item.quantity)}</div>
            ${item.notes ? `<span class="cart-notes">📝 ${item.notes}</span>` : ''}
        </div>
        <div class="cart-item-controls">
            <button class="btn-qty" onclick="changeCartQty(${index}, -1)">-</button>
            <span>${item.quantity}</span>
            <button class="btn-qty" onclick="changeCartQty(${index}, 1)">+</button>
            <button class="btn-remove" onclick="removeCartItem(${index})">🗑️</button>
        </div>`;
        container.appendChild(div);
    });
    document.getElementById("cart-total").innerText = formatPrice(total);
}

function changeCartQty(index, amount) {
    cart[index].quantity += amount;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    updateCart();
}

function removeCartItem(index) {
    cart.splice(index, 1);
    updateCart();
}

function clearCart() {
    if (cart.length === 0) return;
    if (confirm("Clear all items from cart?")) {
        cart = [];
        updateCart();
    }
}

// ==================== CART MODAL NAVIGATION ====================
function openCart() {
    updateCart();
    document.getElementById("cartModal").style.display = "block";
    document.getElementById("cart-screen").style.display = "block";
    document.getElementById("order-summary-screen").style.display = "none";
    document.getElementById("payment-screen").style.display = "none";
}

function closeCart() {
    document.getElementById("cartModal").style.display = "none";
}

function openOrderSummary() {
    if (cart.length === 0) {
        showShareToast("🛒 Your cart is empty!");
        return;
    }
    // Render order summary items
    const summaryContainer = document.getElementById("order-summary-items");
    summaryContainer.innerHTML = "";
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
        summaryContainer.innerHTML += `
        <div class="summary-item">
            <div class="summary-item-left">
                <span class="summary-item-qty">${item.quantity}×</span>
                <span class="summary-item-name">${item.name}</span>
                ${item.notes ? `<span class="summary-item-note">📝 ${item.notes}</span>` : ''}
            </div>
            <span class="summary-item-price">${formatPrice(item.price * item.quantity)}</span>
        </div>`;
    });
    document.getElementById("order-summary-grand-total").innerText = formatPrice(total);
    // Timestamp
    const now = new Date();
    const timeStr = now.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
    document.getElementById("order-time-display").innerHTML = `🕐 Order Time: ${timeStr}`;

    document.getElementById("cart-screen").style.display = "none";
    document.getElementById("order-summary-screen").style.display = "block";
}

function openPayment() {
    const tableNum = document.getElementById("tableNumber").value.trim() || "—";
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const now = new Date();
    const timeStr = now.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });

    document.getElementById("payTableInfo").innerHTML = `🪑 Table: <strong>${tableNum}</strong>`;
    document.getElementById("payTotalInfo").innerHTML = `💰 Total: <strong>${formatPrice(total)}</strong>`;
    document.getElementById("payTimeInfo").innerHTML = `🕐 Time: <strong>${timeStr}</strong>`;

    document.getElementById("order-summary-screen").style.display = "none";
    document.getElementById("payment-screen").style.display = "block";
}

function backToCart() {
    document.getElementById("order-summary-screen").style.display = "none";
    document.getElementById("cart-screen").style.display = "block";
}

function backToSummary() {
    document.getElementById("payment-screen").style.display = "none";
    document.getElementById("order-summary-screen").style.display = "block";
}

// ==================== SEARCH, SORT, CATEGORY ====================
function searchMenu() {
    currentSearchKeyword = document.getElementById("searchInput").value;
    renderMenu();
}

function sortMenu() { renderMenu(); }

function changeCategory(btn, category) {
    document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = category;
    currentSearchKeyword = "";
    document.getElementById("searchInput").value = "";
    showSkeletonLoading();
    setTimeout(() => renderMenu(), 400);
}

// ==================== CLOSE ON OUTSIDE CLICK ====================
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