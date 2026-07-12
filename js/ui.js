/*==================================================
  RT DIGITAL - UI COMPONENTS (js/ui.js)
==================================================*/

/**
 * Menampilkan layar loading (overlay)
 */
function showLoading() {
  const overlay = document.getElementById("loading-overlay");
  if (overlay) {
    overlay.classList.remove("hidden");
    overlay.style.display = "flex"; // Pastikan tampil
  }
}

/**
 * Menyembunyikan layar loading (overlay)
 */
function hideLoading() {
  const overlay = document.getElementById("loading-overlay");
  if (overlay) {
    overlay.classList.add("hidden");
    overlay.style.display = "none";
  }
}

/**
 * Komponen Card Saldo Utama untuk Dashboard
 * @param {number} total - Jumlah uang (integer)
 */
function cardSaldoBesar(total) {
  // Format angka ke format Rupiah standar Indonesia
  const rupiah = total.toLocaleString('id-ID');
  
  return `
    <div class="card" style="background-color: var(--primary); color: white; padding: var(--space-lg); border-radius: var(--radius-lg); margin-bottom: var(--space-md); box-shadow: var(--shadow-md);">
      <p style="margin: 0; font-size: 0.9rem; opacity: 0.9; font-weight: 500;">Saldo Keseluruhan</p>
      <h2 style="margin: 8px 0 0 0; font-size: 2.2rem; font-weight: 700;">Rp ${rupiah}</h2>
    </div>
  `;
}

/**
 * Komponen Card Statistik Kecil (Rumah Lunas, dll)
 */
function cardStatistik(judul, nilai, warnaTeks) {
  return `
    <div class="card" style="background-color: var(--bg-card); padding: var(--space-md); border-radius: var(--radius-md); box-shadow: var(--shadow-sm); flex: 1; text-align: center; border: 1px solid var(--border);">
      <h3 style="margin: 0; font-size: 1.5rem; color: var(--${warnaTeks}); font-weight: 700;">${nilai}</h3>
      <p style="margin: 4px 0 0 0; font-size: 0.75rem; color: var(--text-muted);">${judul}</p>
    </div>
  `;
}
