/*==================================================
   RT DIGITAL - MODUL AUDIT & LAPORAN BULANAN
   (SESUAI MATRIKS HAK AKSES RESMI)
==================================================*/

async function laporanPage() {
    const mainContent = document.getElementById("main-content");
    if (!mainContent) return;

    mainContent.innerHTML = `
        <div style="padding: 20px; animation: fadeIn 0.3s ease;">
            <div style="margin-bottom: 20px;">
                <h2 style="margin: 0; color: #0f766e; font-size: 1.4rem; font-weight: 800;">📊 Laporan Bulanan RT</h2>
                <p style="margin: 4px 0 0 0; color: #64748b; font-size: 0.8rem;">Transparansi buku besar kas masuk dan kas keluar lingkungan</p>
            </div>
            <div id="wadah-laporan-dinamis">
                <div style="text-align:center; padding:20px; color:#0f766e; font-weight:bold;">🔄 Mengkalkulasi laporan neraca...</div>
            </div>
        </div>
    `;

    let respon = await api("getKeuangan");
    const wadah = document.getElementById("wadah-laporan-dinamis");

    if (respon.status === "success") {
        let totalMasuk = 0;
        let totalKeluar = 0;
        respon.data.forEach(item => {
            let nom = parseFloat(item.nominal) || 0;
            if (item.jenis.toLowerCase() === "pemasukan" || item.jenis.toLowerCase() === "masuk") {
                totalMasuk += nom;
            } else {
                totalKeluar += nom;
            }
        });
        let saldoAkhir = totalMasuk - totalKeluar;

        let htmlNeraca = `
            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.01); margin-bottom: 20px;">
                <h4 style="margin: 0 0 15px 0; color: #1e293b; font-size: 0.9rem; font-weight: 800; text-transform: uppercase;">📈 REKAPITULASI KAS AKTIF</h4>
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 10px;">
                    <span style="color: #64748b;">Total Pemasukan Iuran</span>
                    <b style="color: #16a34a;">Rp ${totalMasuk.toLocaleString('id-ID')}</b>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 15px;">
                    <span style="color: #64748b;">Total Pengeluaran Operasional</span>
                    <b style="color: #dc2626;">Rp ${totalKeluar.toLocaleString('id-ID')}</b>
                </div>
                <hr style="border: none; border-top: 1px dashed #cbd5e1; margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: #1e293b; font-weight: bold; font-size: 0.9rem;">Sisa Saldo Kas Bersih</span>
                    <b style="color: #0f766e; font-size: 1.1rem; font-weight: 800;">Rp ${saldoAkhir.toLocaleString('id-ID')}</b>
                </div>
            </div>
        `;

        // FILTER MATRIKS: Admin & Bendahara = ✅ Detail Penuh | Warga & Penagih = 👁️ Ringkasan Saja
        if (currentRole === 'admin' || currentRole === 'bendahara') {
            wadah.innerHTML = `
                ${htmlNeraca}
                <h4 style="margin: 0 0 10px 0; color: #1e293b; font-size: 0.9rem; font-weight: 700;">📜 Buku Besar Transaksi (Full Audit View)</h4>
                <div style="overflow-x: auto; background: white; border: 1px solid #e2e8f0; border-radius: 14px;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 0.8rem; text-align: left;">
                        <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; color: #475569; font-weight: bold;">
                            <th style="padding: 12px;">Rincian Transaksi</th>
                            <th style="padding: 12px; text-align: right;">Nominal</th>
                        </tr>
                        ${respon.data.map(item => `
                            <tr style="border-bottom: 1px solid #f1f5f9; color: #1e293b;">
                                <td style="padding: 12px;"><b>${item.ket}</b><br><small style="color:#94a3b8;">${item.jenis.toUpperCase()}</small></td>
                                <td style="padding: 12px; text-align: right; font-weight: bold; color: ${item.jenis.toLowerCase() === 'pemasukan' || item.jenis.toLowerCase() === 'masuk' ? '#16a34a' : '#dc2626'}">
                                    ${item.jenis.toLowerCase() === 'pemasukan' || item.jenis.toLowerCase() === 'masuk' ? '+' : '-'}Rp ${parseFloat(item.nominal).toLocaleString('id-ID')}
                                </td>
                            </tr>
                        `).join('')}
                    </table>
                </div>
            `;
        } else {
            wadah.innerHTML = `
                ${htmlNeraca}
                <div style="padding: 15px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; text-align: center; color: #64748b; font-size: 0.75rem; font-style: italic;">
                    👁️ Ringkasan Publik: Anda melihat transparansi neraca kas RT Digital yang sah.
                </div>
            `;
        }
    } else {
        wadah.innerHTML = `<div style="color:red; text-align:center; padding:20px;">❌ Gagal menyinkronkan database laporan.</div>`;
    }
}
