/**
 * @file api.js
 * @description Lapisan komunikasi jaringan (Ultra-Resilient Version).
 * Dilengkapi dengan Auto-Extractor untuk membaca segala jenis format JSON dari Google Sheets.
 */

const API = {
    async getMenuData() {
        console.log("[API] Menghubungi server Google Apps Script...");
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // Batas waktu 15 detik

        try {
            const response = await fetch(`${CONFIG.APP_SCRIPT_URL}?action=getMenu`, {
                method: 'GET',
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            // 1. Ekstraksi sebagai teks mentah untuk mencegah crash (Mendeteksi Error HTML dari Google)
            const rawText = await response.text();
            
            let rawData;
            try {
                rawData = JSON.parse(rawText);
            } catch (parseError) {
                console.error("[API] Fatal: Server tidak mengirimkan JSON. Balasan server:", rawText.substring(0, 150) + "...");
                throw new Error("Format respons server bukan JSON. Pastikan Web App Google Sheets di-deploy dengan akses 'Anyone'.");
            }

            console.log("[API] Berhasil membaca JSON mentah:", rawData);

            // ==========================================
            // 2. ALGORITMA PENCARI ARRAY OTOMATIS (AUTO-EXTRACTOR)
            // ==========================================
            let validMenuArray = [];
            
            if (Array.isArray(rawData)) {
                // Skenario A: Data langsung berupa Array [...]
                validMenuArray = rawData;
            } else if (rawData && typeof rawData === 'object') {
                // Skenario B: Objek yang di dalamnya terdapat Array. 
                // Kita akan melacak secara otomatis di mana Array tersebut bersembunyi.
                for (const key in rawData) {
                    if (Array.isArray(rawData[key])) {
                        validMenuArray = rawData[key];
                        console.log(`[API] Data Array berhasil ditemukan pada properti: '${key}'`);
                        break;
                    }
                }
            }

            if (validMenuArray.length === 0) {
                throw new Error("Tidak ditemukan struktur daftar makanan di dalam database Anda.");
            }

            // 3. Sanitasi Data (Pembersihan baris kosong dari Excel/Sheets)
            const sanitizedMenu = validMenuArray.filter(item => item.name);
            
            console.log(`[API] ${sanitizedMenu.length} menu valid siap dikirim ke layar.`);
            return sanitizedMenu;

        } catch (error) {
            clearTimeout(timeoutId);
            
            if (error.name === 'AbortError') {
                console.error("[API] Timeout: Server sangat lambat merespon (Lebih dari 15 detik).");
            } else {
                console.error("[API] Kegagalan Sistem Koneksi:", error.message);
            }
            
            // Kembalikan null agar App.js tahu dan memunculkan UI "Koneksi Terganggu" secara elegan
            return null; 
        }
    }
};