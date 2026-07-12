/*==================================================
   RT DIGITAL - MODUL LAINNYA (ADMIN CENTRAL)
==================================================*/

function LainnyaPage() {
    // 🔒 GERBANG KEAMANAN: Halaman ini murni cuma buat Admin
    if (currentRole !== 'admin') {
        return `
            <div style="padding: 20px; text-align: center; color: #ef4444; margin-top: 60px; animation: fadeIn 0.3s ease;">
                <span style="font-size: 3.5rem;">🚫</span>
                <h3 style="margin-top: 15px; color: #1e293b;">Akses Ditolak</h3>
                <p style="color: #64748b; font-size: 0.9rem; line-height: 1.5; padding: 0 10px;">
                    Halaman ini adalah pusat kendali sistem. Hanya Admin yang memiliki akses.
                </p>
            </div>
        `;
    }

    return `
        <div style="padding: 20px; animation: fadeIn 0.3s ease;">
            
            <div style="margin-bottom: 25px;">
                <h2 style="margin: 0; color: #1e293b;">⚙️ Pusat Kendali</h2>
                <p style="margin: 5px 0 0 0; color: #64748b; font-size: 0.9rem;">Kelola konfigurasi sistem dan fitur lanjutan RT.</p>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                
                <div class="card" onclick="alert('Modul Data User sedang kita bangun, Bos!')" style="text-align: center; padding: 20px 15px; cursor: pointer; transition: 0.2s; margin-bottom: 0;">
                    <div style="font-size: 2rem; margin-bottom: 10px;">👥</div>
                    <h4 style="margin: 0; color: #0f766e; font-size: 1rem;">Data User</h4>
                    <p style="margin: 5px 0 0 0; font-size: 0.75rem; color: #64748b;">Kelola akses akun</p>
                </div>

                <div class="card" onclick="alert('Modul Pengumuman segera hadir!')" style="text-align: center; padding: 20px 15px; cursor: pointer; transition: 0.2s; margin-bottom: 0;">
                    <div style="font-size: 2rem; margin-bottom: 10px;">📢</div>
                    <h4 style="margin: 0; color: #0f766e; font-size: 1rem;">Pengumuman</h4>
                    <p style="margin: 5px 0 0 0; font-size: 0.75rem; color: #64748b;">Mading digital warga</p>
                </div>

                <div class="card" onclick="alert('Modul Laporan sedang diproses!')" style="text-align: center; padding: 20px 15px; cursor: pointer; transition: 0.2s; margin-bottom: 0;">
                    <div style="font-size: 2rem; margin-bottom: 10px;">📊</div>
                    <h4 style="margin: 0; color: #0f766e; font-size: 1rem;">Laporan</h4>
                    <p style="margin: 5px 0 0 0; font-size: 0.75rem; color: #64748b;">Rekap data RT</p>
                </div>

                <div class="card" onclick="alert('Modul Pengaturan akan segera jadi!')" style="text-align: center; padding: 20px 15px; cursor: pointer; transition: 0.2s; margin-bottom: 0;">
                    <div style="font-size: 2rem; margin-bottom: 10px;">🛠️</div>
                    <h4 style="margin: 0; color: #0f766e; font-size: 1rem;">Pengaturan</h4>
                    <p style="margin: 5px 0 0 0; font-size: 0.75rem; color: #64748b;">Tarif & Backup data</p>
                </div>

            </div>
        </div>
    `;
}
