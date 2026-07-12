/*================================================== 
  RT DIGITAL - MODUL DASHBOARD (REAL-TIME DATA)
==================================================*/ 

async function dashboardPage() {
    const mainContent = document.getElementById("main-content");
    if (!mainContent) return;

    // 1. Tampilkan loading state saat mengambil data ke Google Sheet
    mainContent.innerHTML = `
        <div style="padding: 50px 20px; text-align: center; color: #0f766e; font-weight: bold; font-size: 0.95rem;">
            🔄 Menghubungkan ke kas RT...
        </div>
    `;

    // 2. Ambil data asli dari server
    let respon = await api("dashboard");

    if (respon.status === "success") {
        // Format angka ke mata uang Rupiah
        let formatSaldo = "Rp " + respon.totalSaldo.toLocaleString("id-ID");
        
        // Hitung persentase
        let persenLunas = respon.totalRumah > 0 ? Math.round((respon.totalLunas / respon.totalRumah) * 100) : 0;

        // Render riwayat transaksi (Jika kosong, tampilkan info bahwa kas masih 0)
        let htmlAktivitas = respon.aktivitas.map(item => `
            <div class="activity-item" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
                <span style="color: #475569; font-size: 0.85rem; font-weight: 500;">${item.keterangan}</span>
                <b style="color: #0f766e; font-size: 0.85rem;">${item.jumlah}</b>
            </div>
        `).join('');

        // 3. Tembakkan ke layar menggunakan struktur CSS Mobile Banking kamu
        mainContent.innerHTML = `
            <div class="header">
                <h2>RT DIGITAL</h2>
                <p>Sistem Informasi Kas & Iuran</p>
            </div>

            <div class="balance">
                <span>Total Saldo Kas Tersedia</span>
                <h1>${formatSaldo}</h1>
            </div>

            <div class="activity">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h3 style="margin: 0; color: #1e293b; font-size: 0.95rem; font-weight: 700;">Riwayat Transaksi</h3>
                    ${(currentRole === 'admin' || currentRole === 'bendahara') ? 
                      `<button style="background: #0f766e; color: white; padding: 6px 12px; border-radius: 8px; font-size: 0.75rem; border: none; font-weight: bold; cursor: pointer;">+ Kas</button>` : ''}
                </div>
                <div class="activity-list" style="display: flex; flex-direction: column;">
                    ${htmlAktivitas}
                </div>
            </div>

            <div class="progress-card">
                <b style="color: #1e293b; font-size: 0.9rem; font-weight: 700;">Progress Pembayaran Bulan Ini</b>
                <div class="progress">
                    <div style="width: ${persenLunas}%; transition: width 0.5s ease;"></div>
                </div>
                <span style="color: #64748b; font-size: 0.8rem; font-weight: 600;">${persenLunas}% (${respon.totalLunas} dari ${respon.totalRumah} Rumah Telah Lunas)</span>
            </div>

            <div class="stats">
                <div class="stat">
                    <span style="font-size: 1.5rem;">🏠</span>
                    <h2 style="margin: 5px 0;">${respon.totalRumah}</h2>
                    <p style="margin: 0; font-size: 0.75rem; color: #64748b; font-weight: 600;">Rumah</p>
                </div>
                <div class="stat">
                    <span style="font-size: 1.5rem;">✅</span>
                    <h2 style="margin: 5px 0; color: #16a34a;">${respon.totalLunas}</h2>
                    <p style="margin: 0; font-size: 0.75rem; color: #64748b; font-weight: 600;">Lunas</p>
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
