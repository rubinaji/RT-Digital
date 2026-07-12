/*================================================== 
  RT DIGITAL - MODUL MENU LAINNYA (NAVIGATION GATEWAY)
==================================================*/ 

function lainnyaPage() {
    const mainContent = document.getElementById("main-content");
    if (!mainContent) return;

    let icon = currentRole === 'admin' ? '👑' : (currentRole === 'bendahara' ? '💰' : (currentRole === 'penagih' ? '📋' : '👤')); 

    mainContent.innerHTML = `
        <div style="padding: 20px; animation: fadeIn 0.3s ease;">
            <div style="margin-bottom: 25px;">
                <h2 style="margin: 0; color: #0f766e; font-size: 1.4rem; font-weight: 800;">☰ Menu Lainnya</h2>
                <p style="margin: 4px 0 0 0; color: #64748b; font-size: 0.8rem;">Akses fitur dan sub-modul RT Digital</p>
            </div>
            
            <div style="background: white; padding: 15px 20px; border-radius: 16px; margin-bottom: 25px; display: flex; align-items: center; gap: 15px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);">
                <div style="font-size: 2.5rem; background: #f1f5f9; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 1px solid #cbd5e1;">${icon}</div>
                <div style="flex: 1;">
                    <h3 style="margin: 0 0 2px 0; color: #1e293b; font-size: 1rem; font-weight: 700;">${myName || 'Pengguna RT'}</h3>
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <span style="background: #0f766e; color: white; padding: 2px 8px; border-radius: 6px; font-size: 0.65rem; font-weight: 700; text-transform: uppercase;">${currentRole || 'Warga'}</span>
                        ${myBlok ? `<span style="color: #64748b; font-size: 0.75rem; font-weight: 500;">📍 Blok ${myBlok}</span>` : ''}
                    </div>
                </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 10px;">
                
                <div onclick="navigate('profil')" style="background: white; padding: 16px; border-radius: 14px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.01);">
                    <div style="display: flex; align-items: center; gap: 12px; font-weight: 600; font-size: 0.88rem; color: #1e293b;">
                        <span style="font-size: 1.1rem;">👤</span> <span>Profil Akun Saya</span>
                    </div>
                    <span style="color: #94a3b8; font-weight: bold; font-size: 0.8rem;">&gt;</span>
                </div>
                
                <div onclick="navigate('pengumuman')" style="background: white; padding: 16px; border-radius: 14px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.01);">
                    <div style="display: flex; align-items: center; gap: 12px; font-weight: 600; font-size: 0.88rem; color: #1e293b;">
                        <span style="font-size: 1.1rem;">📢</span> <span>Informasi & Berita RT</span>
                    </div>
                    <span style="color: #94a3b8; font-weight: bold; font-size: 0.8rem;">&gt;</span>
                </div>

                <div onclick="navigate('laporan')" style="background: white; padding: 16px; border-radius: 14px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.01);">
                    <div style="display: flex; align-items: center; gap: 12px; font-weight: 600; font-size: 0.88rem; color: #1e293b;">
                        <span style="font-size: 1.1rem;">📊</span> <span>Laporan Bulanan RT</span>
                    </div>
                    <span style="color: #94a3b8; font-weight: bold; font-size: 0.8rem;">&gt;</span>
                </div>
                
                <div onclick="navigate('pengaturan')" style="background: white; padding: 16px; border-radius: 14px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.01);">
                    <div style="display: flex; align-items: center; gap: 12px; font-weight: 600; font-size: 0.88rem; color: #1e293b;">
                        <span style="font-size: 1.1rem;">⚙️</span> <span>Pengaturan Sistem</span>
                    </div>
                    <span style="color: #94a3b8; font-weight: bold; font-size: 0.8rem;">&gt;</span>
                </div>

                <div onclick="prosesLogout()" style="background: #fef2f2; padding: 16px; border-radius: 14px; border: 1px solid #fee2e2; display: flex; justify-content: center; align-items: center; cursor: pointer; margin-top: 15px; font-weight: 700; font-size: 0.88rem; color: #dc2626; gap: 8px;">
                    <span>🚪</span> <span>Keluar dari Aplikasi</span>
                </div>
            </div>
        </div>
    `;
}
