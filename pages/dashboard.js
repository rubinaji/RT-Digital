/*==================================================
   RT DIGITAL - MODUL DASHBOARD (HOME)
==================================================*/

function DashboardPage() {
    return `
        <div style="padding: 20px; animation: fadeIn 0.3s ease;">
            
            <div style="margin-bottom: 25px;">
                <h2 style="margin: 0; color: #1e293b;">Halo, Pengurus RT! 👋</h2>
                <p style="margin: 5px 0 0 0; color: #64748b; font-size: 0.9rem;">Berikut adalah ringkasan data lingkungan kita hari ini.</p>
            </div>

            <div class="card" style="background: linear-gradient(135deg, #0f766e, #14b8a6); color: white; border: none; box-shadow: 0 10px 15px -3px rgba(15, 118, 110, 0.3);">
                <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">Total Kas RT Saat Ini</p>
                <h1 style="margin: 10px 0; font-size: 2.2rem;">Rp 2.500.000</h1>
                
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; opacity: 0.9; margin-top: 15px; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 10px;">
                    <span><span style="font-weight:bold;">↑</span> Pemasukan: Rp 3.000.000</span>
                    <span><span style="font-weight:bold;">↓</span> Pengeluaran: Rp 500.000</span>
                </div>
            </div>

            <h3 style="margin: 25px 0 15px 0; font-size: 1.1rem; color: #334155;">Statistik Lingkungan</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px;">
                
                <div class="card" style="margin-bottom: 0; text-align: center; padding: 15px;">
                    <h2 style="margin: 0; color: #0f766e; font-size: 1.8rem;">45</h2>
                    <p style="margin: 5px 0 0 0; font-size: 0.85rem; color: #64748b; font-weight: 600;">Total Rumah</p>
                </div>
                
                <div class="card" style="margin-bottom: 0; text-align: center; padding: 15px;">
                    <h2 style="margin: 0; color: #eab308; font-size: 1.8rem;">12</h2>
                    <p style="margin: 5px 0 0 0; font-size: 0.85rem; color: #64748b; font-weight: 600;">Belum Bayar Kas</p>
                </div>

            </div>

            <h3 style="margin: 25px 0 15px 0; font-size: 1.1rem; color: #334155;">Akses Cepat</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <button onclick="navigate('rumah')" style="padding: 15px; font-size: 0.95rem; background: white; color: #0f766e; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); display: flex; flex-direction: column; align-items: center; gap: 8px;">
                    <span style="font-size: 1.5rem;">🏠</span> Data Rumah
                </button>
                <button onclick="navigate('keuangan')" style="padding: 15px; font-size: 0.95rem; background: white; color: #0f766e; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); display: flex; flex-direction: column; align-items: center; gap: 8px;">
                    <span style="font-size: 1.5rem;">💰</span> Catat Kas
                </button>
            </div>

        </div>
    `;
}
