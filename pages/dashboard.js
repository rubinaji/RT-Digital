/*==================================================
   RT DIGITAL - MODUL DASHBOARD (MULTI-ROLE)
==================================================*/

function DashboardPage() {
    let contentHtml = "";

    // 1. DASHBOARD ADMIN & BENDAHARA
    if (currentRole === 'admin' || currentRole === 'bendahara') {
        contentHtml = `
            <div class="card" style="background: linear-gradient(135deg, #0f766e, #14b8a6); color: white; padding: 25px 20px; border: none; margin-bottom: 20px; border-radius: 16px; box-shadow: 0 4px 10px rgba(15, 118, 110, 0.3);">
                <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">Total Saldo Kas RT</p>
                <h1 style="margin: 5px 0 0 0; font-size: 2.2rem;">Rp 1.550.000</h1>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                <div class="card" style="text-align: center; padding: 15px; margin-bottom: 0;">
                    <h3 style="margin: 0; color: #16a34a;">+ Rp 200.000</h3>
                    <p style="margin: 5px 0 0 0; font-size: 0.8rem; color: #64748b;">Pemasukan</p>
                </div>
                <div class="card" style="text-align: center; padding: 15px; margin-bottom: 0;">
                    <h3 style="margin: 0; color: #ef4444;">- Rp 50.000</h3>
                    <p style="margin: 5px 0 0 0; font-size: 0.8rem; color: #64748b;">Pengeluaran</p>
                </div>
            </div>
        `;
    } 
    // 2. DASHBOARD PENAGIH
    else if (currentRole === 'penagih') {
        contentHtml = `
            <div class="card" style="background: linear-gradient(135deg, #eab308, #f59e0b); color: white; padding: 25px 20px; border: none; margin-bottom: 20px; border-radius: 16px; box-shadow: 0 4px 10px rgba(234, 179, 8, 0.3);">
                <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">Target Rumah Harus Ditagih</p>
                <h1 style="margin: 5px 0 0 0; font-size: 2.2rem;">2 Rumah</h1>
            </div>
            <div class="card" style="padding: 15px; border-left: 4px solid #dc2626; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <p style="margin: 0; font-weight: bold; color: #1e293b;">Ibu Siti Aminah (A-03)</p>
                    <p style="margin: 3px 0 0 0; font-size: 0.8rem; color: #ef4444; font-weight: bold;">Nunggak 3 Bulan</p>
                </div>
                <button onclick="navigate('penagihan')" style="padding: 8px 12px; background: #0f766e; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">Mulai Tagih</button>
            </div>
        `;
    }
    // 3. DASHBOARD WARGA (PERSONALISASI)
    else if (currentRole === 'warga') {
        let statusKas = "Data tidak ditemukan";
        let colorKas = "#64748b";
        let textKas = "Pastikan nomor blok sesuai.";

        // Cek data tagihan khusus milik warga yang sedang login
        if (typeof dataTagihan !== 'undefined') {
            let myData = dataTagihan.find(w => w.blok.toLowerCase() === (window.myBlok || "").toLowerCase());
            if (myData) {
                if (myData.menungguVerifikasi) {
                    statusKas = "⏳ PROSES VERIFIKASI";
                    colorKas = "#d97706";
                    textKas = "Bukti transfer Anda sedang dicek oleh Bendahara.";
                } else if (myData.saldoBulan >= 0) {
                    statusKas = "✅ LUNAS";
                    colorKas = "#16a34a";
                    textKas = "Terima kasih telah membayar iuran tepat waktu!";
                } else {
                    statusKas = "🚨 NUNGGAK " + Math.abs(myData.saldoBulan) + " BULAN";
                    colorKas = "#dc2626";
                    textKas = "Mohon segera lunasi tunggakan kas RT Anda.";
                }
            }
        }

        contentHtml = `
            <div class="card" style="background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 25px 20px; border: none; margin-bottom: 20px; border-radius: 16px; text-align: center; box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);">
                <h2 style="margin: 0;">Selamat Datang!</h2>
                <p style="margin: 5px 0 0 0; font-size: 0.9rem; opacity: 0.9;">Warga ${window.myBlok || "RT 01"}</p>
            </div>
            
            <div class="card" style="text-align: center; padding: 25px 20px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
                <h3 style="margin: 0 0 15px 0; color: #1e293b;">Status Kas Anda</h3>
                <span style="background: ${colorKas}20; color: ${colorKas}; padding: 10px 20px; border-radius: 20px; font-weight: bold; font-size: 1.2rem; border: 2px solid ${colorKas};">${statusKas}</span>
                <p style="margin: 15px 0 0 0; font-size: 0.85rem; color: #64748b;">${textKas}</p>
            </div>
        `;
    }

    return `
        <div style="padding: 20px; animation: fadeIn 0.3s ease;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <div>
                    <p style="margin: 0; font-size: 0.8rem; color: #64748b; text-transform: uppercase; font-weight: bold;">Mode Akses:</p>
                    <h2 style="margin: 0; color: #0f766e; text-transform: capitalize;">${currentRole}</h2>
                </div>
                <span style="font-size: 2rem;">👋</span>
            </div>
            ${contentHtml}
        </div>
    `;
}
