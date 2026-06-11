/**
 * @file api.js
 * @description Lapisan komunikasi jaringan (Enterprise Deep Scanner Version).
 * Menembus CORS dan mencari array data makanan hingga ke lapisan objek terdalam.
 */

const API = {
    async getMenuData() {
        console.log("[API] Menjalankan protokol sinkronisasi dengan server...");
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        try {
            const response = await fetch(`${CONFIG.APP_SCRIPT_URL}?action=getMenu`, {
                method: 'GET',
                redirect: 'follow',
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            const rawText = await response.text();

            if (rawText.trim().startsWith('<')) {
                console.error("[API ERROR] Respons server berupa HTML. Akses kemungkinan diblokir.");
                return null;
            }

            const rawData = JSON.parse(rawText);

            // ==========================================
            // [X-RAY PAYLOAD] FITUR DIAGNOSTIK PROFESIONAL
            // ==========================================
            console.groupCollapsed("📦 [API DATA PAYLOAD] Klik untuk melihat isi asli dari Google Sheets");
            console.log(JSON.stringify(rawData, null, 2));
            console.groupEnd();

            // ==========================================
            // ALGORITMA DEEP SCANNER (Pencari Array Rekursif)
            // ==========================================
            function extractValidArray(obj) {
                if (Array.isArray(obj)) return obj;
                if (obj !== null && typeof obj === 'object') {
                    for (const key in obj) {
                        const found = extractValidArray(obj[key]);
                        if (found && Array.isArray(found)) return found;
                    }
                }
                return null; // Tidak ada array di lapisan ini
            }

            const validMenuArray = extractValidArray(rawData);

            // ANALISIS KEGAGALAN PRESISI TINGGI
            if (!validMenuArray) {
                throw new Error("JSON berhasil diterima, tapi sama sekali tidak mengandung struktur Array.");
            }

            if (validMenuArray.length === 0) {
                throw new Error("Array berhasil ditemukan, TAPI KOSONG (0 item). Pastikan Apps Script Anda membaca nama Sheet (Tab) yang benar dan baris data tidak kosong.");
            }

            // Pembersihan data (Sanitasi kolom yang wajib ada)
            const sanitizedMenu = validMenuArray.filter(item => item.name);

            if (sanitizedMenu.length === 0) {
                throw new Error("Data ditemukan, tapi tidak ada yang memiliki properti 'name'. Pastikan header (baris 1) di Google Sheets Anda sudah benar.");
            }

            console.log(`[API] Ekstraksi sukses. ${sanitizedMenu.length} menu siap dihidangkan ke UI.`);
            return sanitizedMenu;

        } catch (error) {
            clearTimeout(timeoutId);
            
            // Menampilkan laporan error yang sangat spesifik
            console.error(`[API FATAL ERROR] ${error.message}`);
            return null; 
        }
    }
};
