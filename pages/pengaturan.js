/*==================================================
   RT DIGITAL - MODUL PENGATURAN SISTEM
==================================================*/

function PengaturanPage() {
    // 🔒 CEK PERAN: Hanya Admin yang boleh ubah pengaturan
    if (currentRole !== 'admin') {
        return `<div style="padding: 20px; text-align: center; color: #ef4444; margin-top: 50px;">🚫 Akses Ditolak</div>`;
    }

    return `
        <div style="padding: 20px; animation: fadeIn 0.3s ease;">
            <div style="margin-bottom: 25px;">
                <h2 style="margin: 0; color: #1e293b;">🛠️ Pengaturan Sistem</h2>
                <p style="margin: 5px 0 0 0; color: #64748b; font-size: 0.9rem;">Konfigurasi dasar aplikasi RT Digital.</p>
            </div>

            <div class="card" style="padding: 20px; margin-bottom: 15px;">
                <h4 style="margin: 0 0 15px 0; color: #0f172a;">🏢 Identitas Lingkungan</h4>
                <label style="font-size: 0.85rem; color: #64748b;">Nama RT / RW</label>
                <input type="text" value="RT 01 / RW 05" style="width: 100%; padding: 10px; margin-top: 5px; margin-bottom: 15px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none; font-size: 0.95rem;">
                
                <label style="font-size: 0.85rem; color: #64748b;">Nama Perumahan / Desa</label>
                <input type="text" value="Perumahan Indah Asri" style="width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none; font-size: 0.95rem;">
            </div>

            <div class="card" style="padding: 20px; margin-bottom: 15px;">
                <h4 style="margin: 0 0 15px 0; color: #0f172a;">💰 Tarif Master Kas</h4>
                
                <label style="font-size: 0.85rem; color: #64748b;">Iuran Rumah Ditempati (Rp)</label>
                <input type="number" id="tarif-ditempati" value="40000" style="width: 100%; padding: 10px; margin-top: 5px; margin-bottom: 15px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none; font-size: 0.95rem; background: #dcfce7; color: #16a34a; font-weight: bold;">
                
                <label style="font-size: 0.85rem; color: #64748b;">Iuran Rumah Kosong (Rp)</label>
                <input type="number" id="tarif-kosong" value="25000" style="width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none; font-size: 0.95rem; background: #fef2f2; color: #dc2626; font-weight: bold;">
            </div>

            <div class="card" style="padding: 20px; margin-bottom: 20px;">
                <h4 style="margin: 0 0 10px 0; color: #0f172a;">💾 Pencadangan Data</h4>
                <p style="font-size: 0.85rem; color: #64748b; margin-top: 0; margin-bottom: 15px;">Unduh seluruh data warga dan riwayat kas ke format Excel.</p>
                <button onclick="alert('Memulai proses unduh Backup_Data_RT.xlsx...')" style="width: 100%; padding: 10px; background: #eab308; color: #1e293b; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
                    📥 Download Backup
                </button>
            </div>

            <button onclick="simpanPengaturan()" style="width: 100%; padding: 15px; background: #0f766e; color: white; border: none; border-radius: 12px; font-weight: bold; cursor: pointer; font-size: 1rem; box-shadow: 0 4px 6px -1px rgba(15, 118, 110, 0.2);">
                Simpan Perubahan
            </button>
        </div>
    `;
}

// Fungsi ketika tombol simpan diklik
window.simpanPengaturan = function() {
    const tarifIsi = document.getElementById("tarif-ditempati").value;
    const tarifKosong = document.getElementById("tarif-kosong").value;
    
    alert(`Mantap! Tarif Rumah Ditempati (Rp ${tarifIsi}) dan Rumah Kosong (Rp ${tarifKosong}) berhasil disimpan.`);
}
