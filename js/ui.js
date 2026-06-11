/**
 * @file ui.js
 * @description Modul Antarmuka Pengguna (UI Engine). 
 * Bertanggung jawab merender data ke HTML, menangani animasi loading,
 * notifikasi (toast), dan sistem pencarian dinamis (Live Search).
 */

const UI = {
    // Menyimpan salinan data master untuk keperluan filtering/pencarian
    masterData: [],

    /**
     * Utility: Memformat angka menjadi format Rupiah standar Indonesia
     * @param {number} amount - Angka yang akan diformat
     * @returns {string} String berformat Rp xxx.xxx
     */
    formatIDR(amount) {
        return new Intl.NumberFormat(CONFIG.CURRENCY.LOCALE, {
            style: 'currency',
            currency: CONFIG.CURRENCY.CODE,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    },

    /**
     * Utility: Mengamankan input string untuk mencegah serangan XSS
     * @param {string} str - String mentah dari database
     * @returns {string} String yang aman disisipkan ke HTML
     */
    escapeHTML(str) {
        if (!str) return '';
        return str.toString()
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    },

    /**
     * Merender array data menu menjadi elemen HTML di layar
     * @param {Array} menuArray - Kumpulan objek data menu
     */
    renderMenu(menuArray) {
        const container = document.getElementById('menu-list');
        const emptyState = document.getElementById('empty-state');
        
        if (!container || !emptyState) {
            console.error("[UI Error] Elemen DOM utama tidak ditemukan!");
            return;
        }

        // 1. Bersihkan kontainer (termasuk menghapus Skeleton Loading)
        container.innerHTML = '';

        // 2. Tampilkan Empty State jika data kosong
        if (!menuArray || menuArray.length === 0) {
            emptyState.classList.remove('hidden');
            return;
        }

        // 3. Sembunyikan Empty State jika ada data
        emptyState.classList.add('hidden');

        // 4. Bangun elemen HTML secara efisien menggunakan fragmentasi string
        const htmlContent = menuArray.map(item => {
            const safeName = this.escapeHTML(item.name);
            const safeDesc = this.escapeHTML(item.desc || 'Deskripsi belum tersedia untuk hidangan premium ini.');
            const formattedPrice = this.formatIDR(item.price);
            const imageUrl = item.image || CONFIG.DEFAULT_IMAGE;
            
            // Mengubah objek item menjadi string JSON yang aman untuk parameter fungsi onclick
            const itemJson = JSON.stringify(item).replace(/"/g, '&quot;');

            return `
                <article class="menu-card">
                    <div class="card-image-wrapper">
                        <img src="${imageUrl}" 
                             alt="${safeName}" 
                             class="card-image"
                             loading="lazy"
                             onerror="this.src='${CONFIG.DEFAULT_IMAGE}'">
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">${safeName}</h3>
                        <p class="card-desc">${safeDesc}</p>
                        <div class="card-footer">
                            <span class="card-price">${formattedPrice}</span>
                            <button class="btn-add" onclick="cartManager.add(${itemJson})" aria-label="Tambah ${safeName} ke keranjang">
                                Tambah
                            </button>
                        </div>
                    </div>
                </article>
            `;
        }).join('');

        // 5. Suntikkan HTML ke dalam DOM sekaligus (Menghindari Reflow berkali-kali)
        container.innerHTML = htmlContent;
        console.log(`[UI] Berhasil merender ${menuArray.length} item menu.`);
    },

    /**
     * Menginisialisasi pendengar event untuk fitur pencarian
     */
    initSearch() {
        const searchInput = document.getElementById('searchInput');
        if (!searchInput) return;

        // Menggunakan event 'input' untuk Live Search yang instan
        searchInput.addEventListener('input', (event) => {
            const keyword = event.target.value.toLowerCase().trim();
            
            if (keyword === "") {
                this.renderMenu(this.masterData);
                return;
            }

            const filteredData = this.masterData.filter(item => {
                const nameMatch = item.name && item.name.toLowerCase().includes(keyword);
                const descMatch = item.desc && item.desc.toLowerCase().includes(keyword);
                return nameMatch || descMatch;
            });

            this.renderMenu(filteredData);
        });
        console.log("[UI] Modul pencarian diaktifkan.");
    },

    /**
     * Menampilkan notifikasi pop-up bergaya premium
     * @param {string} message - Pesan yang ingin ditampilkan
     * @param {string} type - 'success' | 'error'
     */
    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        
        // Kustomisasi warna berdasarkan tipe notifikasi
        if (type === 'error') {
            toast.style.backgroundColor = 'var(--error-color)';
            toast.style.borderLeft = '4px solid #c0392b';
        } else {
            toast.style.backgroundColor = 'var(--primary-color)';
            toast.style.borderLeft = '4px solid var(--accent-color)';
        }
        
        toast.innerText = message;
        container.appendChild(toast);

        // Hancurkan elemen DOM setelah animasi selesai untuk menjaga memori tetap bersih
        setTimeout(() => {
            if (container.contains(toast)) {
                toast.remove();
            }
        }, 3000);
    }
};