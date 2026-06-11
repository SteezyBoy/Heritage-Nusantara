/**
 * @file cart.js
 * @description Modul Manajemen Keranjang Belanja.
 * Mengontrol logika penambahan barang, pengurangan, perhitungan total,
 * serta integrasi dengan antarmuka modal keranjang.
 */

const cartManager = {
    // Array untuk menyimpan item yang dipesan secara lokal (State)
    items: [],

    /**
     * Menambahkan item ke keranjang atau menambah kuantitas jika sudah ada
     * @param {Object} product - Objek data menu yang dipilih
     */
    add(product) {
        const existingItemIndex = this.items.findIndex(item => item.name === product.name);
        
        if (existingItemIndex !== -1) {
            // Jika sudah ada, tambah kuantitasnya
            this.items[existingItemIndex].qty += 1;
        } else {
            // Jika item baru, masukkan ke array dengan kuantitas 1
            this.items.push({ ...product, qty: 1 });
        }
        
        // Tampilkan feedback visual ke pengguna
        UI.showToast(`${product.name} berhasil ditambahkan`);
        
        // Sinkronisasi data ke tampilan
        this.updateUI();
    },

    /**
     * Mengubah kuantitas spesifik item (+ atau -)
     * @param {string} productName - Nama item
     * @param {number} delta - Jumlah penambahan/pengurangan (1 atau -1)
     */
    changeQty(productName, delta) {
        const itemIndex = this.items.findIndex(item => item.name === productName);
        
        if (itemIndex !== -1) {
            this.items[itemIndex].qty += delta;
            
            // Jika kuantitas menyentuh angka 0, hapus item dari keranjang
            if (this.items[itemIndex].qty <= 0) {
                this.items.splice(itemIndex, 1);
            }
            this.updateUI();
        }
    },

    /**
     * Memperbarui seluruh elemen visual yang berkaitan dengan keranjang
     */
    updateUI() {
        const badge = document.getElementById('cart-badge');
        const totalElement = document.getElementById('cart-total');
        const checkoutBtn = document.getElementById('checkout-btn');
        
        // 1. Kalkulasi angka badge keranjang
        const totalItems = this.items.reduce((sum, item) => sum + item.qty, 0);
        if (badge) {
            badge.innerText = totalItems > 99 ? '99+' : totalItems;
            // Animasi kecil saat badge berubah
            badge.style.transform = 'scale(1.2)';
            setTimeout(() => badge.style.transform = 'scale(1)', 200);
        }

        // 2. Kalkulasi total harga
        const totalPrice = this.items.reduce((sum, item) => sum + (Number(item.price) * item.qty), 0);
        if (totalElement) {
            totalElement.innerText = UI.formatIDR(totalPrice);
        }

        // 3. Kontrol ketersediaan tombol Checkout
        if (checkoutBtn) {
            if (this.items.length > 0) {
                checkoutBtn.classList.remove('disabled');
                checkoutBtn.removeAttribute('disabled');
            } else {
                checkoutBtn.classList.add('disabled');
                checkoutBtn.setAttribute('disabled', 'true');
            }
        }

        // 4. Render ulang isi keranjang di dalam modal
        this.renderCartItems();
    },

    /**
     * Menggambar isi keranjang ke dalam modal
     */
    renderCartItems() {
        const container = document.getElementById('cart-items');
        if (!container) return;

        if (this.items.length === 0) {
            container.innerHTML = '<div class="empty-cart-msg" style="text-align:center; padding:30px; color:var(--text-muted);">Keranjang Anda masih kosong. Mari pesan hidangan premium kami.</div>';
            return;
        }

        container.innerHTML = this.items.map(item => `
            <div class="cart-item">
                <img src="${item.image || CONFIG.DEFAULT_IMAGE}" alt="${item.name}" class="cart-item-img" onerror="this.src='${CONFIG.DEFAULT_IMAGE}'">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${UI.formatIDR(item.price * item.qty)}</div>
                </div>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="cartManager.changeQty('${item.name.replace(/'/g, "\\'")}', -1)">-</button>
                    <span class="qty-text">${item.qty}</span>
                    <button class="qty-btn" onclick="cartManager.changeQty('${item.name.replace(/'/g, "\\'")}', 1)">+</button>
                </div>
            </div>
        `).join('');
    },

    /**
     * Membuka modal keranjang
     */
    openModal() {
        const modal = document.getElementById('cart-modal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Kunci scroll background
        }
    },

    /**
     * Menutup modal keranjang
     */
    closeModal() {
        const modal = document.getElementById('cart-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = ''; // Lepaskan kunci scroll
        }
    },

    /**
     * Menangani proses akhir pesanan (Checkout)
     */
    checkout() {
        if (this.items.length === 0) return;
        
        // Logika sementara, nantinya bisa diarahkan ke WhatsApp API
        UI.showToast("Memproses pembayaran Anda...", "success");
        setTimeout(() => {
            alert("Sistem Checkout terhubung dengan baik! Lanjutkan instruksi untuk integrasi spesifik.");
        }, 500);
    }
};