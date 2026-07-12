/*================================================== 
  RT DIGITAL - API BRIDGE (js/api.js) 
==================================================*/ 

// URL Web App Google Apps Script RT Digital (TERBARU)
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw7J9ef4f8YDuEhdXh7JTuttYzpGNciBDNNUy0QVNeGIliyytIHH1NwQfxk7kA4rZh0Yg/exec"; 

/**
 * Fungsi utama untuk memanggil backend (Google Apps Script)
 * @param {string} action - Nama aksi (contoh: 'login', 'dashboard', 'getRumah')
 * @param {Object} params - Data parameter tambahan (opsional)
 * @return {Object} Hasil response dari server
 */
async function api(action, params = {}) {
    // Munculkan layar loading jika fungsinya tersedia di UI
    if (typeof showLoading === "function") showLoading();
    
    try {
        // Menggunakan POST agar sesuai dengan penanganan doPost(e) di Apps Script
        const response = await fetch(SCRIPT_URL, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8" // Menghindari masalah CORS
            },
            body: JSON.stringify({ action: action, ...params })
        });
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("API Error:", error);
        alert("Gagal terhubung ke server. Periksa koneksi internet.");
        return { status: "failed", message: error.message };
    } finally {
        // Sembunyikan kembali layar loading setelah proses selesai atau gagal
        if (typeof hideLoading === "function") hideLoading();
    }
}
