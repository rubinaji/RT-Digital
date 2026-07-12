/*================================================== 
  RT DIGITAL - API BRIDGE (js/api.js) 
==================================================*/ 

// URL deployment Web App Google Apps Script milikmu
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxK7wlnfTk2eLiPXfVCN6X1w-c34LFx_bxzpdtTT8hKsMn25P4sv4WB_gJjHG1p2pkv/exec"; 

/**
 * Fungsi utama untuk memanggil backend (Google Apps Script)
 * @param {string} action - Nama aksi (contoh: 'dashboard', 'login')
 * @param {Object} params - Data parameter tambahan (opsional)
 * @return {Object} Hasil response dari server
 */
async function api(action, params = {}) {
    // Munculkan layar loading setiap kali memanggil API
    if (typeof showLoading === "function") showLoading();
    
    try {
        // Menggunakan POST agar aman saat mengirim data kredensial atau iuran
        const response = await fetch(SCRIPT_URL, {
            method: "POST",
            body: JSON.stringify({ action: action, ...params })
        });
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("API Error:", error);
        alert("Gagal terhubung ke server. Periksa koneksi internet.");
        return { status: "failed", message: error.message };
    } finally {
        // Sembunyikan layar loading setelah data didapat atau gagal
        if (typeof hideLoading === "function") hideLoading();
    }
}
