/*==================================================
   RT DIGITAL - MODUL LAPORAN & STATISTIK
==================================================*/

function LaporanPage() {
    // 🔒 CEK PERAN: Hanya Admin yang bisa buka Pusat Laporan
    if (currentRole !== 'admin') {
        return `<div style="padding: 20px; text-align: center; color: #ef4444; margin-top: 50px;">🚫 Akses Ditolak</div>`;
    }

    return `
        <div style="padding: 20px; animation: fadeIn 0.3s ease;">
            
            <div style="margin-bottom: 25px;">
                <h2 style="margin: 0; color: #1e293b;">📊 Laporan RT</h2>
                <p style="margin: 5px 0 0 0; color: #64748b; font-size: 0.9rem;">Rekapitulasi data warga dan keuangan bulan ini.</p>
            </div>

            <div class="card" style="padding: 20px; margin-bottom: 15px; border-left: 5px solid #3b82f6;">
                <h4 style="margin: 0 0 15px 0; color: #0f172a; font-size: 1.1rem;">📈 Statistik Rumah</h4>
                <div style="display: flex; justify-content: space-between; font-size: 0.95rem; color: #475569; margin-bottom: 8px;">
                    <span>Total Rumah Terdaftar</span> <strong style="color: #1e293b;">3 Unit</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.95rem; color: #475569; margin-bottom: 8px;">
                    <span>Rumah Ditempati</span> <strong style="color: #16a34a;">1 Unit</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.95rem; color: #475569;">
                    <span>Rumah Kosong</span> <strong style="color: #ef4444;">1 Unit</strong>
                </div>
            </div>

            <div class="card" style="padding: 20px; margin-bottom: 20px; border-left: 5px solid #eab308;">
                <h4 style="margin: 0 0 15px 0; color: #0f172a; font-size: 1.1rem;">💸 Arus Kas</h4>
                <div style="display: flex; justify-content: space-between; font-size: 0.95rem; color: #475569; margin-bottom: 8px;">
                    <span>Total Pemasukan</span> <strong style="color: #16a34a;">+ Rp 50.000</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.95rem; color: #475569; margin-bottom: 8px;">
                    <span>Total Pengeluaran</span> <strong style="color: #ef4444;">- Rp 150.000</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 1rem; color: #0f172a; border-top: 1px dashed #cbd5e1; padding-top: 10px; margin-top: 5px;">
                    <span><strong>Saldo Saat Ini</strong></span> <strong>- Rp 100.000</strong>
                </div>
            </div>

            <button onclick="alert('Fitur Generate PDF sedang dirakit, Bos!')" style="width: 100%; padding: 15px; background: #0f766e; color: white; border: none; border-radius: 12px; font-weight: bold; cursor: pointer; font-size: 1rem; box-shadow: 0 4px 6px -1px rgba(15, 118, 110, 0.2);">
                🖨️ Cetak Laporan (PDF)
            </button>
        </div>
    `;
}
