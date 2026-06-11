// ==================== KONFIGURASI ====================
const APPS_SCRIPT_URL = "PASTE_YOUR_APPS_SCRIPT_URL_HERE"; // Ganti dengan URL Apps Script Anda

let currentCategory = "all";
let currentItem = null;
let cart = [];
let favorites = JSON.parse(localStorage.getItem("hn_favorites") || "[]");
let currentSearchKeyword = "";
let quickAddItem = null;
let quickQty = 1;
let isDarkMode = localStorage.getItem("hn_darkmode") === "true";

// Data menu akan diisi dari Google Sheets
let menuData = { makanan: [], minuman: [], dessert: [] };

// ==================== INIT ====================
document.addEventListener("DOMContentLoaded", async () => {
  applyDarkMode();
  showSkeletonLoading();
  await loadMenuFromSheet(); // Ambil menu dari Sheets
  renderMenu();
});

// ==================== AMBIL MENU DARI GOOGLE SHEETS ====================
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
      // Pastikan setiap item punya field yang diperlukan
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
    console.error("Gagal mengambil menu dari Sheets, pakai default:", err);
    setDefaultMenu();
  }
}

function setDefaultMenu() {
  menuData = {
    makanan: [
      { name: "Tahu Isi Goreng", category: "Appetizer", bestSeller: true, image: "images/TAHU ISI GORENG.jpeg", desc: "Tahu renyah...", price: 35000 },
      { name: "Lumpia Semarang", category: "Appetizer", bestSeller: false, image: "images/LUMPIA SEMARANG.jpeg", desc: "Camilan legendaris...", price: 45000 },
      // ... tambahkan default menu lainnya (sesuai file script.js lama Anda)
    ],
    minuman: [ /* ... */ ],
    dessert: [ /* ... */ ]
  };
}

// ==================== FUNGSI LAINNYA (renderMenu, cart, dll) ====================
// (Sisanya sama persis dengan script.js Anda sebelumnya, 
//  hanya bagian getAllItems() dan renderMenu() otomatis menggunakan menuData global)

function getAllItems() {
  return [...menuData.makanan, ...menuData.dessert, ...menuData.minuman];
}

// ... sisanya sama (formatPrice, showSuccessPopup, renderMenu, search, sort, cart, dll)
// Namun pastikan fungsi openPayment() tetap mengirim order ke Sheets seperti semula.
