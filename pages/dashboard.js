/*==================================================
   RT DIGITAL - MODUL DASHBOARD (HOME)
==================================================*/

function DashboardPage() {
    
    // --- 1. LOGIKA MENGHITUNG KEUANGAN ---
    let totalSaldo = 0;
    let totalPemasukan = 0;
    let totalPengeluaran = 0;

    if (typeof dataKeuangan !== 'undefined') {
        dataKeuangan.forEach(item => {
            if (item.tipe === 'masuk') {
                totalPemasukan += item.jumlah;
                totalSaldo += item.jumlah;
            } else if (item.tipe === 'keluar') {
                totalPengeluaran += item.jumlah;
                totalSaldo -= item.jumlah;
            }
        });
    }

    let totalRumah = typeof dataRumah !== 'undefined' ? dataRumah.length : 0;
    let belumBayar = 1; // Dummy statistik tunggakan

    // --- 2. LOGIKA KUSTOMISASI PERAN (ROLE UI) ---
    let greetingTitle = "Halo, Pengurus RT! 👋";
    let greetingSub = "Berikut adalah ringkasan data lingkungan kita hari ini.";
    
    if (currentRole === 'warga') {
        greetingTitle = "Halo, Warga RT! 👋";
        greetingSub = "Berikut adalah laporan transparansi kas lingkungan kita.";
    } else if (currentRole === 'bendahara') {
        greetingTitle = "Halo, Bendahara RT! 💰";
        greetingSub = "Kelola pemasukan dan pengeluaran kas dengan bijak.";
    } else if (currentRole === 'penagih') {
        greetingTitle = "Halo, Petugas Penagih! 📋";
        greetingSub = "Berikut ringkasan tunggakan iuran warga bulan ini.";
    }

    // Mengatur Menu Akses Cepat sesuai Peran
    let quickMenuHTML = '';
    if (currentRole === 'admin' || currentRole === 'bendahara') {
        quickMenuHTML = `
            <h3 style="margin: 25px 0 15px 0; font-size: 1.1rem; color: #334155;">Akses Cepat</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <button onclick="navigate('rumah')" style="padding: 15px; font-size: 0.95rem; background: white; color: #0f766e; border: 1px solid #e2e8f0; border-radius: 12px; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 8px;">
                    <span style="font-size: 1.5rem;">🏠</span> Data Rumah
                </button>
                <button onclick="navigate('keuangan')" style="padding: 15px; font-size: 0.95rem; background: white; color: #0f766e; border: 1px solid #e2e8f0; border-radius: 12px; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 8px;">
                    <span style="font-size: 1.5rem;">💰</span> Catat Kas
                </button>
            </div>
        `;
    } else if (currentRole === 'penagih') {
        quickMenuHTML = `
            <h3 style="margin: 25px 0 15px 0; font-size: 1.1rem; color: #334155;">Akses Cepat</h3>
            <div style="display: grid; grid-template-columns: 1fr; gap: 15px;">
                <button onclick="navigate('penagihan')" style="padding: 15px; font-size: 0.95rem; background: white; color: #0f766e; border: 1px solid #e2e8f0; border-radius: 12px; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 8px; grid-column: span 2;">
                    <span style="font-size: 1.5rem;">📋</span> Cek Tunggakan Warga
                </button>
            </div>
        `;
    } // Jika Warga, quickMenuHTML tetap kosong

    const formatRp = (angka) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
    };

    return `
        <div style="padding: 20px; animation: fadeIn 0.3s ease;">
            
            <div style="margin-bottom: 25px;">
                <h2 style="margin: 0; color: #1e293b;">${greetingTitle}</h2>
                <p style="margin: 5px 0 0 0; color: #64748b; font-size: 0.9rem;">${greetingSub}</p>
            </div>

            <div class="card" style="background: linear-gradient(135deg, #0f766e, #14b8a6); color: white; border: none; box-shadow: 0 10px 15px -3px rgba(15, 118, 110, 0.3);">
                <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">Total Saldo Kas RT</p>
                <h1 style="margin: 10px 0; font-size: 2.2rem;">${formatRp(totalSaldo)}</h1>
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; opacity: 0.9; margin-top: 15px; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 10px;">
                    <span><b>↑</b> Masuk: ${formatRp(totalPemasukan)}</span>
                    <span><b>↓</b> Keluar: ${formatRp(totalPengeluaran)}</span>
                </div>
            </div>

            <h3 style="margin: 25px 0 15px 0; font-size: 1.1rem; color: #334155;">Statistik Lingkungan</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px;">
                <div class="card" style="margin-bottom: 0; text-align: center; padding: 15px;">
                    <h2 style="margin: 0; color: #0f766e; font-size: 1.8rem;">${totalRumah}</h2>
                    <p style="margin: 5px 0 0 0; font-size: 0.85rem; color: #64748b; font-weight: 600;">Total Rumah</p>
                </div>
                <div class="card" style="margin-bottom: 0; text-align: center; padding: 15px;">
                    <h2 style="margin: 0; color: #eab308; font-size: 1.8rem;">${belumBayar}</h2>
                    <p style="margin: 5px 0 0 0; font-size: 0.85rem; color: #64748b; font-weight: 600;">Belum Bayar</p>
                </div>
            </div>

            ${quickMenuHTML}
        </div>
    `;
}
