/*==================================================
   RT DIGITAL - MODUL PROFIL
==================================================*/

function ProfilPage() {
    return `
        <div style="padding: 20px; animation: fadeIn 0.3s ease; text-align: center;">
            
            <div style="width: 100px; height: 100px; background: linear-gradient(135deg, #0f766e, #14b8a6); color: white; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: bold; box-shadow: 0 4px 10px rgba(15,118,110,0.3);">
                RT
            </div>
            
            <h2 style="margin: 0; color: #1e293b;">RT 05 / RW 02</h2>
            <p style="margin: 5px 0 25px 0; color: #64748b;">Perumahan Digital Asri</p>
            
            <div class="card" style="text-align: left; margin-bottom: 15px;">
                <h4 style="margin: 0 0 10px 0; color: #0f766e; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Struktur Pengurus</h4>
                <div style="display: flex; justify-content: space-between; margin: 8px 0;">
                    <span style="color: #64748b;">Ketua RT</span>
                    <strong style="color: #1e293b;">Bpk. Admin</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin: 8px 0;">
                    <span style="color: #64748b;">Bendahara</span>
                    <strong style="color: #1e293b;">Ibu Keuangan</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin: 8px 0;">
                    <span style="color: #64748b;">Sekretaris</span>
                    <strong style="color: #1e293b;">Bpk. Data</strong>
                </div>
            </div>

            <div class="card" style="text-align: left; margin-bottom: 15px;">
                <h4 style="margin: 0 0 10px 0; color: #0f766e; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Informasi Umum</h4>
                <div style="display: flex; justify-content: space-between; margin: 8px 0;">
                    <span style="color: #64748b;">Iuran Bulanan</span>
                    <strong style="color: #1e293b;">Rp 50.000 / Bulan</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin: 8px 0;">
                    <span style="color: #64748b;">Jadwal Ronda</span>
                    <strong style="color: #1e293b;">Sabtu & Minggu</strong>
                </div>
            </div>
            
            <p style="margin-top: 30px; font-size: 0.8rem; color: #94a3b8;">
                RT Digital System v1.0<br>Dibangun dengan ❤️ untuk warga.
            </p>

        </div>
    `;
}
