/*================================================== 
  RT DIGITAL - MODUL MENU LAINNYA & PROFIL USER
==================================================*/ 

function lainnyaPage() {
    const mainContent = document.getElementById("main-content");
    if (!mainContent) return;

    // Menentukan icon profil berdasarkan hak akses login saat ini
    let icon = currentRole === 'admin' ? '👑' : (currentRole === 'bendahara' ? '💰' : (currentRole === 'penagih' ? '📋' : '👤')); 

    mainContent.innerHTML = `
        <div style="padding: 20px; animation: fadeIn 0.3s ease;">
            <div style="margin-bottom: 25px;">
                <h2 style="margin: 0; color: #0f766e;">☰ Menu Lainnya</h2>
                <p style="margin: 5px 0 0 0; color: #64748b; font-size: 0.85rem;">Informasi akun dan sistem RT Digital</p>
            </div>
            
            <div class="card" style="padding: 25px; text-align: center; margin-bottom: 25px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                <div style="font-size: 3.5rem; margin-bottom: 10px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.05));">${icon}</div>
                <h3 style="margin: 0 0 6px 0; color: #1e293b; font-size: 1.1rem; font-weight: 700;">${myName || 'Pengguna RT'}</h3>
                <span style="background: #e2e8f0; color: #475569; padding: 4px 14px; border-radius: 20px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">
                    Role: ${currentRole || 'Warga'}
                </span>
                ${myBlok ? `<p style="margin: 12px 0 0 0; font-size: 0.85rem; color: #64748b; font-weight: 500;">📍 Terdaftar di: <b>${myBlok}</b></p>` : ''}
            </div>

            <div style="display: flex; flex-direction: column; gap: 12px;">
                <button onclick="alert('Fitur Pengaturan Aplikasi sedang disiapkan.')" style="width: 100%; padding: 16px; background: white; border: 1px solid #e2e8f0; border-radius: 14px; text-align: left; color: #1e293b; font-weight: 600; font-size: 0.88rem; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);">
                    <span>⚙️ Pengaturan Aplikasi</span>
                    <span style="color: #94a3b8; font-weight: bold;">&gt;</span>
                </button>
                
                <button onclick="alert('Fitur Hubungi Pengurus RT sedang disiapkan.')" style="width: 100%; padding: 16px; background: white; border: 1px solid #e2e8f0; border-radius: 14px; text-align: left; color: #1e293b; font-weight: 600; font-size: 0.88rem; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);">
                    <span>📞 Hubungi Pengurus RT</span>
                    <span style="color: #94a3b8; font-weight: bold;">&gt;</span>
                </button>

                <button onclick="prosesLogout()" style="width: 100%; padding: 16px; background: #fef2f2; border: 1px solid #fee2e2; border-radius: 14px; text-align: center; color: #dc2626; font-weight: 700; font-size: 0.9rem; margin-top: 25px; transition: 0.2s;">
                    🚪 Keluar dari Aplikasi
                </button>
            </div>
        </div>
    `;
}
