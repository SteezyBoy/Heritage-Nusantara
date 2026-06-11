/**
 * @file api.js
 * @description Lapisan komunikasi jaringan (CORS & Redirect Bypass Version).
 * Fokus pada penanganan keamanan Google Apps Script (Redirect 302 & CORS).
 */

const API = {
    async getMenuData() {
        console.log("[API] Mencoba menembus koneksi ke Google Apps Script...");
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        try {
            // PERBAIKAN KRITIS: Memastikan browser mengikuti redirect Google (302)
            // tanpa mengirimkan header yang bisa memicu blokir CORS
            const response = await fetch(`${CONFIG.APP_SCRIPT_URL}?action=getMenu`, {
                method: 'GET',
                redirect: 'follow', // Wajib untuk melewati redirect eksekusi Google
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            const rawText = await response.text();

            // DETEKSI BLOKIR GOOGLE: Jika yang kembali adalah halaman HTML (biasanya halaman login Google)
            if (rawText.trim().startsWith('<')) {
                console.error("[API ERROR] Terhalang Keamanan Google. Server mengembalikan HTML:", rawText.substring(0, 200));
                
                // Menampilkan error langsung ke layar agar kita tahu pasti penyebabnya
                UI.showToast("Akses API diblokir oleh Google. Cek Console (F12).", "error");
                return null;
            }

            // Parsing JSON dengan aman
            const rawData = JSON.parse(rawText);
            
            // Pencarian Array Otomatis
            let validMenuArray = [];
            if (Array.isArray(rawData)) {
                validMenuArray = rawData;
            } else if (rawData && typeof rawData === 'object') {
                for (const key in rawData) {
                    if (Array.isArray(rawData[key])) {
                        validMenuArray = rawData[key];
                        break;
                    }
                }
            }

            if (validMenuArray.length === 0) {
                console.error("[API ERROR] JSON berhasil ditarik, tapi tidak ada Array makanan di dalamnya.");
                return null;
            }

            return validMenuArray.filter(item => item.name);

        } catch (error) {
            clearTimeout(timeoutId);
            console.error(`[API FATAL ERROR] Alasan spesifik: ${error.message}`);
            
            // Jika error berupa "Failed to fetch", biasanya karena dibuka via file:/// 
            // atau Web App Google belum di-set 'Anyone'
            if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
                UI.showToast("Koneksi diblokir oleh Browser (CORS).", "error");
            }
            return null;
        }
    }
};
