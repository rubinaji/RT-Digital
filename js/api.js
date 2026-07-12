/*==================================================
  RT DIGITAL - API BRIDGE (js/api.js)
==================================================*/

// ⚠️ GANTI STRING INI DENGAN URL DEPLOYMENT WEB APP GOOGLE APPS SCRIPT-MU
const SCRIPT_URL = "TARUH_URL_WEB_APP_KAMU_DI_SINI";

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
    // Susun parameter URL (contoh: ?action=login&hp=0812...)
    let url = `${SCRIPT_URL}?action=${action}`;
    for (let key in params) {
      url += `&${key}=${encodeURIComponent(params[key])}`;
    }

    // Lakukan request (fetch) data ke server GAS
    const response = await fetch(url);
    const result = await response.json();
    
    return result;
  } catch (error) {
    console.error("API Error:", error);
    alert("Gagal terhubung ke server. Periksa koneksi internet.");
    return { status: false, pesan: error.message };
  } finally {
    // Sembunyikan layar loading setelah data berhasil didapat (atau gagal)
    if (typeof hideLoading === "function") hideLoading();
  }
}
