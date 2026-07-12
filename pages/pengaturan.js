/*==================================================
   RT DIGITAL - MODUL CONTROL PENGATURAN & USER MANAGE
   (SESUAI MATRIKS HAK AKSES RESMI - KHUSUS ADMIN)
==================================================*/

function pengaturanPage() {
    const mainContent = document.getElementById("main-content");
    if (!mainContent) return;

    // 🔒 BLOKIR MATRIKS: Kecuali Admin, semua role dilarang masuk (❌)
    if (currentRole !== 'admin') {
        mainContent.innerHTML = `
            <div style="padding: 40px 20px; text-align: center; color: #dc2626; font-weight: bold; font-size: 0.95rem; animation: fadeIn 0.3s ease;">
                🔒 Akses Ditolak: Modul Pengaturan & Manajemen User hanya didelegasikan khusus untuk Ketua RT (Admin).
            </div>
        `;
        return;
    }

    // Jika yang masuk terverifikasi Admin (Ketua RT)
    mainContent.innerHTML = `
        <div style="padding: 20px; animation: fadeIn 0.3s ease;">
            <div style="margin-bottom: 25px;">
                <h2 style="margin: 0; color: #0f766e; font-size: 1.4rem; font-weight: 800;">⚙️ Pengaturan Sistem</h2>
                <p style="margin: 4px 0 0 0; color: #64748b; font-size: 0.8rem;">Kontrol panel parameter aplikasi dan otorisasi pengurus RT</p>
            </div>

            <div class="card" style="padding: 20px; background: white; border: 1px solid #e2e8f0; border-radius: 14px; margin-bottom: 15px;">
                <h3 style="margin: 0 0 5px 0; color: #1e293b; font-size: 0.95rem; font-weight: 800;">👑 Manajemen User & Akun Pengurus</h3>
                <p style="margin: 0 0 15px 0; color: #64748b; font-size: 0.78rem; line-height: 1.4;">Kelola kredensial username, password, dan pembagian jabatan (Bendahara/Penagih/Warga) langsung terhubung ke Sheet database.</p>
                <button onclick="alert('Panel otorisasi akun pengurus RT sukses dibuka!')" style="width: 100%; padding: 10px; background: #0f766e; color: white; border: none; border-radius: 8px; font-weight: bold; font-size: 0.8rem; cursor: pointer;">👥 Buka Manajemen User</button>
            </div>

            <div class="card" style="padding: 20px; background: white; border: 1px solid #e2e8f0; border-radius: 14px;">
                <h3 style="margin: 0 0 5px 0; color: #1e293b; font-size: 0.95rem; font-weight: 800;">🔧 Konfigurasi Nominal Iuran</h3>
                <p style="margin: 0 0 15px 0; color: #64748b; font-size: 0.78rem; line-height: 1.4;">Ubah besaran nominal tagihan iuran bulanan wajib warga (Tarif Default saat ini: Rp 50.000 / bulan).</p>
                <button onclick="alert('Parameter nominal tarif iuran bulanan siap dikonfigurasi!')" style="width: 100%; padding: 10px; background: #475569; color: white; border: none; border-radius: 8px; font-weight: bold; font-size: 0.8rem; cursor: pointer;">💵 Atur Besaran Iuran</button>
            </div>
        </div>
    `;
}
