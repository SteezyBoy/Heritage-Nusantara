/**
 * @file config.js
 * @description Konfigurasi utama aplikasi Heritage Nusantara. 
 * Memisahkan konfigurasi dari logika untuk memudahkan pemeliharaan.
 */

const CONFIG = {
    // 1. ENDPOINT API (URL dari Google Apps Script)
    APP_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbyn30grZC520L63gtHJ7lYITjgqSwHyNowaMVtqd_ysjpN22wbsB0mzGu8q7OIfNft80w/exec",

    // 2. PENGATURAN REQUEST
    // Batas waktu maksimal menunggu server membalas (15 detik)
    REQUEST_TIMEOUT: 15000, 

    // 3. FORMATTING MATA UANG
    CURRENCY: {
        LOCALE: 'id-ID',
        CODE: 'IDR'
    },

    // 4. FALLBACK ASSETS (Jika gambar gagal dimuat dari Sheets)
    DEFAULT_IMAGE: "https://via.placeholder.com/400x300?text=Gambar+Tidak+Tersedia"
};

// Mencegah konfigurasi diubah secara tidak sengaja oleh script lain (Immutability)
Object.freeze(CONFIG);
console.log("[System] Konfigurasi berhasil dimuat.");
