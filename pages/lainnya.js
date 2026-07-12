/*==================================================
   RT DIGITAL - MENU LAINNYA (DENGAN FILTER PERAN)
==================================================*/

function LainnyaPage() {
    // 🔒 Filter Hak Akses: Sembunyikan Data User & Pengaturan dari Bendahara
    let menuDataUser = '';
    let menuPengaturan = '';

    if (currentRole === 'admin') {
        menuDataUser = `
            <div class="card" onclick="navigate('user')" style="text-align: center; padding: 20px 15px; cursor: pointer; transition: 0.2s; margin-bottom: 0;">
                <h1 style="margin: 0; font-size: 2.5rem;">👥</h1>
                <h4 style="margin: 10px 0 5px 0; color: #1e293b;">Data User</h4>
                <p style="margin: 0; font-size: 0.8rem; color: #64748b;">Kelola akses warga</p>
            </div>
        `;
        menuPengaturan = `
            <div class="card" onclick="navigate('pengaturan')" style="text-align: center; padding: 20px 15px; cursor: pointer; transition: 0.2s; margin-bottom: 0;">
                <h1 style="margin: 0; font-size: 2.5rem;">🛠️</h1>
                <h4 style="margin: 10px 0 5px 0; color: #1e293b;">Pengaturan</h4>
                <p style="margin: 0; font-size: 0.8rem; color: #64748b;">Konfigurasi sistem</p>
            </div>
        `;
    }

    return `
        <div style="padding: 20px; animation: fadeIn 0.3s ease;">
            <div style="margin-bottom: 25px;">
                <h2 style="margin: 0; color: #1e293b;">Lainnya</h2>
                <p style="margin: 5px 0 0 0; color: #64748b; font-size: 0.9rem;">Menu tambahan dan pengaturan aplikasi.</p>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                
                ${menuDataUser} <div class="card" onclick="navigate('pengumuman')" style="text-align: center; padding: 20px 15px; cursor: pointer; transition: 0.2s; margin-bottom: 0;">
                    <h1 style="margin: 0; font-size: 2.5rem;">📢</h1>
                    <h4 style="margin: 10px 0 5px 0; color: #1e293b;">Pengumuman</h4>
                    <p style="margin: 0; font-size: 0.8rem; color: #64748b;">Info RT & Mading</p>
                </div>

                <div class="card" onclick="navigate('laporan')" style="text-align: center; padding: 20px 15px; cursor: pointer; transition: 0.2s; margin-bottom: 0;">
                    <h1 style="margin: 0; font-size: 2.5rem;">📊</h1>
                    <h4 style="margin: 10px 0 5px 0; color: #1e293b;">Laporan</h4>
                    <p style="margin: 0; font-size: 0.8rem; color: #64748b;">Rekap kas & warga</p>
                </div>

                ${menuPengaturan} </div>
            
            <button onclick="alert('Keluar dari aplikasi...')" style="width: 100%; padding: 15px; background: #f1f5f9; color: #dc2626; border: 1px solid #cbd5e1; border-radius: 12px; font-weight: bold; cursor: pointer; font-size: 1rem; margin-top: 30px;">
                🚪 Keluar (Logout)
            </button>
        </div>
    `;
}
