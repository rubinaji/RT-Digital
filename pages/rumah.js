/*==================================================
  RT DIGITAL - HALAMAN DATA RUMAH & WARGA
==================================================*/

/**
 * Fungsi utama yang dipanggil oleh router saat menu 'Rumah' diklik
 */
function RumahPage() {
  // Beri jeda sedikit agar wadah HTML siap
  setTimeout(loadRumahData, 50);

  return `
    <div id="rumah-container" style="animation: fadeIn 0.3s ease; padding: 20px;">
      <div style="text-align: center; margin-top: 50px; color: #64748b;">
        <div class="spinner" style="margin: 0 auto 10px auto;"></div>
        <p>Memuat data warga...</p>
      </div>
    </div>
  `;
}

/**
 * Fungsi untuk menyuntikkan data dummy ke layar
 */
function loadRumahData() {
  const container = document.getElementById("rumah-container");
  if (!container) return;

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h2 style="margin: 0; color: #0f766e; font-size: 1.5rem;">Data Rumah</h2>
      <button class="btn-primary" style="padding: 8px 15px; font-size: 0.9rem;">+ Tambah</button>
    </div>

    <div style="margin-bottom: 20px;">
      <input type="text" placeholder="Cari nama atau blok rumah..." style="width: 100%; padding: 12px 15px; border-radius: 10px; border: 1px solid #e2e8f0; outline: none; font-size: 1rem; box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);">
    </div>

    <div style="display: flex; flex-direction: column; gap: 12px;">

      <div style="background: white; padding: 15px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h4 style="margin: 0; color: #0f172a; font-size: 1.1rem;">Blok A-01</h4>
          <p style="margin: 3px 0 0 0; font-size: 0.9rem; color: #64748b;">Bpk. Budi Santoso</p>
        </div>
        <span style="background: #dcfce7; color: #16a34a; padding: 5px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: bold;">Ditempati</span>
      </div>

      <div style="background: white; padding: 15px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h4 style="margin: 0; color: #0f172a; font-size: 1.1rem;">Blok A-02</h4>
          <p style="margin: 3px 0 0 0; font-size: 0.9rem; color: #94a3b8; font-style: italic;">Belum ada penghuni</p>
        </div>
        <span style="background: #fef2f2; color: #dc2626; padding: 5px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: bold;">Kosong</span>
      </div>

      <div style="background: white; padding: 15px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h4 style="margin: 0; color: #0f172a; font-size: 1.1rem;">Blok A-03</h4>
          <p style="margin: 3px 0 0 0; font-size: 0.9rem; color: #64748b;">Ibu Siti Aminah</p>
        </div>
        <span style="background: #fef08a; color: #a16207; padding: 5px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: bold;">Dikontrak</span>
      </div>

    </div>
  `;
}
