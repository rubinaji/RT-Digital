/*==================================================
  RT DIGITAL - DASHBOARD PAGE
==================================================*/

/**
 * Fungsi utama yang dipanggil oleh router saat menu Home diklik
 */
function DashboardPage() {
  // Beri jeda 50ms agar wadah HTML selesai dibuat dulu di layar
  setTimeout(loadDashboardData, 50);

  return `
    <div id="dashboard-container" style="animation: fadeIn 0.3s ease; padding: 20px;">
      <div style="text-align: center; margin-top: 50px; color: #64748b;">
        <div class="spinner" style="margin: 0 auto 10px auto;"></div>
        <p>Memuat data RT...</p>
      </div>
    </div>
  `;
}

/**
 * Fungsi untuk mengambil dan menampilkan data ke layar
 */
async function loadDashboardData() {
  const container = document.getElementById("dashboard-container");
  if (!container) return;

  // Sementara kita pakai data DUMMY (palsu) dulu untuk keperluan desain
  setTimeout(() => {
    container.innerHTML = `
      <div style="background: linear-gradient(135deg, #0f766e, #14b8a6); color: white; padding: 25px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-bottom: 25px;">
        <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">Saldo Kas RT</p>
        <h2 style="margin: 5px 0 0 0; font-size: 2.2rem;">Rp 4.550.000</h2>
      </div>

      <h3 style="margin-bottom: 15px; color: #0f172a; font-size: 1.1rem;">Statistik Warga</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px;">
        <div style="background: white; padding: 20px 15px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); text-align: center; border: 1px solid #e2e8f0;">
          <h3 style="margin: 0; color: #16a34a; font-size: 1.8rem;">42</h3>
          <p style="margin: 5px 0 0 0; font-size: 0.8rem; color: #64748b; font-weight: 500;">Ditempati</p>
        </div>
        <div style="background: white; padding: 20px 15px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); text-align: center; border: 1px solid #e2e8f0;">
          <h3 style="margin: 0; color: #ea580c; font-size: 1.8rem;">5</h3>
          <p style="margin: 5px 0 0 0; font-size: 0.8rem; color: #64748b; font-weight: 500;">Kosong</p>
        </div>
      </div>

      <h3 style="margin-bottom: 15px; color: #0f172a; font-size: 1.1rem;">Aksi Cepat</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <button style="background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; padding: 12px; border-radius: 10px; font-weight: bold; cursor: pointer;">+ Catat Pemasukan</button>
        <button style="background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; padding: 12px; border-radius: 10px; font-weight: bold; cursor: pointer;">- Catat Pengeluaran</button>
      </div>
    `;
  }, 800); // Simulasi loading selama 0.8 detik
}
