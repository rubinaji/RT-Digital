/*==================================================
   RT DIGITAL - MODUL KEUANGAN
==================================================*/

function KeuanganPage() {
    return `
        <div style="padding: 20px;">
            <div style="background: #0f766e; color: white; padding: 20px; border-radius: 16px; margin-bottom: 20px;">
                <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">Total Saldo Kas</p>
                <h1 style="margin: 5px 0 0 0;">Rp 2.500.000</h1>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0;">Riwayat Transaksi</h3>
                <button style="background: #0f766e; color: white; border: none; padding: 5px 10px; border-radius: 6px; cursor: pointer;">+ Kas</button>
            </div>

            <div style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 15px;">
                <div style="border-bottom: 1px solid #f1f5f9; padding-bottom: 10px; margin-bottom: 10px;">
                    <p style="margin: 0; font-weight: bold;">Iuran Warga - Blok A-01</p>
                    <p style="margin: 0; color: #16a34a; font-weight: bold;">+ Rp 50.000</p>
                </div>
                <div>
                    <p style="margin: 0; font-weight: bold;">Bayar Sampah</p>
                    <p style="margin: 0; color: #dc2626; font-weight: bold;">- Rp 150.000</p>
                </div>
            </div>
        </div>
    `;
}
