/**
 * @file app.js
 * @description Core Application Bootstrapper.
 * Entry point (titik awal) aplikasi yang mengoordinasikan antara Layer API (Data),
 * Layer UI (Antarmuka), dan Layer Cart (State Management).
 */

'use strict'; // Menerapkan strict mode untuk keamanan, performa, dan mencegah kebocoran memori

const AppMain = {
    /**
     * Menyiapkan pendengar event global (Global Event Listeners)
     * untuk interaksi yang tidak terikat pada item spesifik di layar.
     */
    setupGlobalEventListeners() {
        // 1. Menutup modal keranjang jika pengguna mengklik area overlay (di luar box putih)
        const modalOverlay = document.getElementById('cart-modal');
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (event) => {
                // Pastikan yang diklik murni overlay-nya, bukan konten di dalamnya
                if (event.target === modalOverlay) {
                    cartManager.closeModal();
                }
            });
        }

        // 2. Menutup modal dengan tombol 'Escape' pada keyboard (Aksesibilitas / UX Standar)
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                const isModalOpen = !modalOverlay.classList.contains('hidden');
                if (isModalOpen) {
                    cartManager.closeModal();
                }
            }
        });
        
        console.log("[App] Global event listeners berhasil diinisialisasi.");
    },

    /**
     * Fungsi inisialisasi utama (Boot sequence)
     * Mengatur urutan eksekusi aplikasi dari awal hingga layar siap digunakan.
     */
    async init() {
        // Mengelompokkan log untuk menjaga kerapian Console (F12)
        console.groupCollapsed("🚀 Booting Heritage Nusantara System...");
        console.log(`[App] Lingkungan eksekusi siap. Memulai sinkronisasi data dengan server.`);
        
        // Pasang sensor interaksi global
        this.setupGlobalEventListeners();

        try {
            // 1. Panggil API untuk menjemput data dari Google Sheets
            // Proses ini akan tertunda (await) hingga server memberikan respon
            const rawMenuData = await API.getMenuData();

            // 2. Evaluasi hasil kembalian API
            if (rawMenuData && Array.isArray(rawMenuData) && rawMenuData.length > 0) {
                console.log(`[App] Sinkronisasi sukses. Menyiapkan render untuk ${rawMenuData.length} item.`);
                
                // Simpan ke memori UI (Master Data) untuk keperluan fitur pencarian Live Search
                UI.masterData = rawMenuData;
                
                // Render ke layar (Secara otomatis akan menghapus Skeleton Loading/Animasi loading)
                UI.renderMenu(rawMenuData);
                
                // Aktifkan sensor pencarian (Search Bar)
                UI.initSearch();
                
            } else {
                // Skenario Error Handling Kritis: Data gagal ditarik atau Google Sheets kosong
                console.error("[App] Kegagalan kritis: Data menu tidak valid, kosong, atau koneksi terputus.");
                
                const container = document.getElementById('menu-list');
                if (container) {
                    // Suntikkan UI Error yang elegan (Bukan layar putih kosong)
                    container.innerHTML = `
                        <div class="empty-state" style="grid-column: 1 / -1; padding: 60px 20px;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="var(--error-color)" stroke-width="2" style="width: 64px; height: 64px; margin-bottom: 20px;">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            <h3 style="color: var(--primary-color); margin-bottom: 10px; font-weight: 600;">Koneksi Terganggu</h3>
                            <p style="color: var(--text-muted); font-size: 14px; line-height: 1.6; max-width: 300px; margin: 0 auto;">
                                Kami tidak dapat memuat menu dari database saat ini. Mohon periksa koneksi internet Anda.
                            </p>
                            <button onclick="window.location.reload()" style="margin-top: 25px; padding: 12px 30px; background: var(--primary-color); color: white; border: none; border-radius: 50px; font-weight: 500; box-shadow: var(--shadow-sm); cursor: pointer; transition: var(--transition);">
                                Segarkan Halaman
                            </button>
                        </div>
                    `;
                }
                UI.showToast("Gagal memuat katalog menu.", "error");
            }
        } catch (error) {
            console.error("[App] Unhandled Exception selama proses inisialisasi:", error);
        } finally {
            console.log("[App] Proses booting selesai.");
            console.groupEnd();
        }
    }
};

// ==========================================
// TRIGGER UTAMA APLIKASI
// ==========================================
// Listener ini memastikan bahwa AppMain.init() HANYA dijalankan
// setelah seluruh struktur HTML (DOM) selesai di-download dan dibaca oleh browser.
document.addEventListener('DOMContentLoaded', () => {
    AppMain.init();
});