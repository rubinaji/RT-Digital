/*==================================================
   RT DIGITAL - DASHBOARD V8 (SMART UI)
==================================================*/
async function dashboardPage() {
    const mainContent = document.getElementById("main-content");
    if (!mainContent) return;

    let roleBersih = (currentRole || "").toLowerCase().trim();

    mainContent.innerHTML = `
        <div style="padding: 20px; animation: fadeIn 0.3s ease;">
            <div style="margin-bottom: 20px;">
                <h1 style="margin: 0; color: #0f766e; font-size: 1.5rem;">Halo, ${myName}! 👋</h1>
                <p style="margin: 5px 0 0 0; color: #64748b; font-size: 0.85rem;">Selamat datang di Dashboard RT Digital.</p>
            </div>

            <div id="section-khusus-warga"></div>
            <div id="section-admin-view" style="display:none;"></div>
            
            <div style="margin-top: 25px;">
                <h3 style="color: #1e293b; font-size: 1rem; margin-bottom: 12px;">📢 Pengumuman Terbaru</h3>
                <div id="news-dashboard"></div>
            </div>
        </div>
    `;

    // LOGIKA TAMPILAN WARGA
    if (roleBersih === 'warga') {
        const wadahWarga = document.getElementById("section-khusus-warga");
        wadahWarga.innerHTML = `<div style="text-align:center; padding:20px;">Menghitung tagihan Anda...</div>`;
        
        let res = await api("getRumah");
        if (res.status === "success") {
            let dataSaya = res.data.find(item => item.blok.toString().toLowerCase().trim() === myBlok.toString().toLowerCase().trim());
            if (dataSaya) {
                let statusBayar = (dataSaya.status || "").toLowerCase().trim();
                let isLunas = statusBayar === "lunas";
                let tarifBase = (dataSaya.kondisi.toLowerCase().trim() === "kosong") ? 25000 : 40000;

                wadahWarga.innerHTML = `
                    <div style="background: ${isLunas ? '#f0fdf4' : '#fef2f2'}; border: 2px solid ${isLunas ? '#16a34a' : '#ef4444'}; border-radius: 20px; padding: 25px; text-align: center; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">
                        <h2 style="margin: 0; color: #1e293b; font-size: 1.1rem;">Status Iuran Blok ${myBlok}</h2>
                        <div style="font-size: 2.5rem; margin: 15px 0;">${isLunas ? '✅' : '⚠️'}</div>
                        <h1 style="margin: 0; color: ${isLunas ? '#16a34a' : '#dc2626'}; font-size: 1.8rem; font-weight: 900;">${isLunas ? 'SUDAH LUNAS' : 'BELUM BAYAR'}</h1>
                        <p style="margin: 10px 0 0 0; color: #64748b; font-size: 0.85rem;">Tagihan Bulanan: <b>Rp ${tarifBase.toLocaleString('id-ID')}</b></p>
                        
                        ${!isLunas ? `
                            <button onclick="window.open('https://wa.me/628123456789?text=Halo%20Bendahara,%20saya%20ingin%20konfirmasi%20pembayaran%20iuran%20Blok%20${myBlok}')" style="margin-top: 20px; width: 100%; padding: 12px; background: #0f766e; color: white; border: none; border-radius: 12px; font-weight: bold; cursor: pointer;">📩 Konfirmasi Pembayaran</button>
                        ` : `
                            <p style="margin-top: 15px; color: #16a34a; font-weight: bold; font-size: 0.8rem;">Terima kasih atas partisipasi Anda!</p>
                        `}
                    </div>
                `;
            }
        }
    } else {
        // TAMPILAN ADMIN/PENGURUS
        document.getElementById("section-admin-view").style.display = "block";
        loadAdminDashboard();
    }
}

async function loadAdminDashboard() {
    let res = await api("dashboard");
    const container = document.getElementById("section-admin-view");
    if (res.status === "success") {
        container.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div style="background: white; padding: 15px; border-radius: 16px; border: 1px solid #e2e8f0; text-align: center;">
                    <small style="color: #64748b;">Saldo Kas</small>
                    <h3 style="margin: 5px 0 0 0; color: #0f766e;">Rp ${res.totalSaldo.toLocaleString('id-ID')}</h3>
                </div>
                <div style="background: white; padding: 15px; border-radius: 16px; border: 1px solid #e2e8f0; text-align: center;">
                    <small style="color: #64748b;">Belum Bayar</small>
                    <h3 style="margin: 5px 0 0 0; color: #dc2626;">${res.totalBelum} Rumah</h3>
                </div>
            </div>
        `;
    }
}
