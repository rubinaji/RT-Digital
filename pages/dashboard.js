/*================================================== 
  RT DIGITAL - MODUL DASHBOARD (REAL-TIME DATA)
==================================================*/ 

async function dashboardPage() {
    const mainContent = document.getElementById("main-content");
    if (!mainContent) return;

    // 🔄 Tampilkan loading state transparan saat mengambil data ke Google Sheet
    mainContent.innerHTML = `
        <div style="padding: 50px 20px; text-align: center; color: #0f766e; font-weight: bold; font-size: 0.95rem;">
            🔄 Menghubungkan ke kas RT...
        </div>
    `;

    // Ambil data agregat real-time via api.js
    let respon = await api("dashboard");

    if (respon.status === "success") {
        // Format angka numerik saldo ke standar Rupiah mata uang lokal
        let formatSaldo = "Rp " + respon.totalSaldo.toLocaleString("id-ID");
        
        // Hitung persentase ketercapaian pembayaran iuran warga
        let persenLunas = respon.totalRumah > 0 ? Math.round((respon.totalLunas / respon.totalRumah) * 100) : 0;

        // Iterasi deretan log transaksi menjadi elemen HTML list belanja/pemasukan
        let htmlAktivitas = respon.aktivitas.map(item => `
            <div class="activity-item" style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
                <span style="color: #475569; font-size: 0.85rem; font-weight: 500;">${item.keterangan}</span>
                <b style="color: #0f766e; font-size: 0.85rem;">${item.jumlah}</b>
            </div>
        `).join('');

        // Tembakkan markup dashboard final ke dalam layout utama
        mainContent.innerHTML = `
            <div class="header" style="background: linear-gradient(135deg, #0f766e, #14b8a6); padding: 25px 20px; color: white; border-radius: 0 0 24px 24px;">
                <h2 style="margin: 0; font-size: 1.4rem; font-weight: 700; letter-spacing: -0.02em;">RT DIGITAL</h2>
                <p style="margin: 4px 0 0 0; opacity: 0.9; font-size: 0.8rem;">Sistem Informasi Kas & Iuran Warga</p>
            </div>

            <div class="balance" style="margin: -20px 20px 20px 20px; background: white; padding: 20px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.03); border: 1px solid #e2e8f0;">
                <span style="color: #64748b; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Total Kas RT Terkumpul</span>
                <h1 style="margin: 8px 0 0 0; font-size: 1.85rem; color: #0f766e; font-weight: 800; letter-spacing: -0.03em;">${formatSaldo}</h1>
            </div>

            <div class="progress-card" style="margin: 20px; background: white; padding: 20px; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.01);">
                <b style="color: #1e293b; font-size: 0.9rem; font-weight: 700;">Progress Pembayaran Iuran Bulan Ini</b>
                <div class="progress" style="height: 10px; background: #e2e8f0; border-radius: 10px; overflow: hidden; margin: 12px 0;">
                    <div style="width: ${persenLunas}%; height: 100%; background: linear-gradient(90deg, #0f766e, #14b8a6); border-radius: 10px; transition: width 0.5s ease;"></div>
                </div>
                <span style="color: #64748b; font-size: 0.8rem; font-weight: 600;">${persenLunas}% (${respon.totalLunas} dari ${respon.totalRumah} Rumah Telah Lunas)</span>
            </div>

            <div class="stats" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; padding: 0 20px;">
                <div class="stat" style="background: white; padding: 15px; border-radius: 16px; text-align: center; border: 1px solid #e2e8f0;">
                    <span style="font-size: 1.3rem;">🏠</span>
                    <h2 style="margin: 6px 0 2px 0; font-size: 1.4rem; color: #1e293b; font-weight: 700;">${respon.totalRumah}</h2>
                    <p style="margin: 0; font-size: 0.75rem; color: #64748b; font-weight: 600;">Total Rumah</p>
                </div>
                <div class="stat" style="background: white; padding: 15px; border-radius: 16px; text-align: center; border: 1px solid #e2e8f0;">
                    <span style="font-size: 1.3rem;">✅</span>
                    <h2 style="margin: 6px 0 2px 0; font-size: 1.4rem; color: #16a34a; font-weight: 700;">${respon.totalLunas}</h2>
                    <p style="margin: 0; font-size: 0.75rem; color: #64748b; font-weight: 600;">Warga Lunas</p>
                </div>
            </div>

            <div class="activity" style="margin: 20px; background: white; border-radius: 16px; padding: 20px; border: 1px solid #e2e8f0;">
                <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 0.95rem; font-weight: 700;">Aktivitas Transaksi Terakhir</h3>
                <div class="activity-list" style="display: flex; flex-direction: column;">
                    ${htmlAktivitas}
                </div>
            </div>
        `;
    } else {
        mainContent.innerHTML = `
            <div style="padding: 30px; text-align: center; color: #dc2626; font-size: 0.9rem; font-weight: 600;">
                ❌ Gagal memuat ringkasan kas: ${respon.message}
            </div>
        `;
    }
}
