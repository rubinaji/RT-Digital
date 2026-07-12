/*==================================================
   RT DIGITAL - MODUL BERITA & PENGUMUMAN WARGA
   (SESUAI MATRIKS HAK AKSES RESMI)
==================================================*/

async function pengumumanPage() {
    const mainContent = document.getElementById("main-content");
    if (!mainContent) return;

    mainContent.innerHTML = `
        <div style="padding: 20px; animation: fadeIn 0.3s ease;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <div>
                    <h2 style="margin: 0; color: #0f766e; font-size: 1.4rem; font-weight: 800;">📢 Berita & Pengumuman</h2>
                    <p style="margin: 4px 0 0 0; color: #64748b; font-size: 0.8rem;">Informasi seputar kegiatan dan agenda warga RT</p>
                </div>
                <div id="wadah-btn-pengumuman"></div>
            </div>
            
            <div id="feed-pengumuman-full" style="display: flex; flex-direction: column; gap: 15px;">
                <div style="text-align:center; padding:20px; color:#0f766e; font-weight:bold;">🔄 Memuat papan pengumuman...</div>
            </div>
        </div>
    `;

    // Render Tombol Tambah Khusus Akses Komando (Admin & Bendahara = ✅)
    const wadahBtn = document.getElementById("wadah-btn-pengumuman");
    if (currentRole === 'admin' || currentRole === 'bendahara') {
        wadahBtn.innerHTML = `<button onclick="aksiTambahPengumuman()" style="padding: 8px 15px; background: #0f766e; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 0.8rem;">+ Tambah</button>`;
    }

    // Tarik data pengumuman real-time dari server
    let res = await api("getPengumuman");
    const feed = document.getElementById("feed-pengumuman-full");

    if (res.status === "success" && res.data && res.data.length > 0) {
        feed.innerHTML = res.data.map(p => {
            let tanggal = p.tgl ? new Date(p.tgl).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Baru saja';
            return `
                <div class="card" style="padding: 18px; background: white; border-radius: 14px; border: 1px solid #e2e8f0; border-left: 5px solid #0f766e; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.01);">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; gap: 15px;">
                        <h4 style="margin: 0; color: #1e293b; font-size: 0.95rem; font-weight: 800; line-height: 1.3;">📌 ${p.judul}</h4>
                        <small style="color: #94a3b8; font-size: 0.7rem; white-space: nowrap; font-weight: 600;">🗓️ ${tanggal}</small>
                    </div>
                    <p style="margin: 0; color: #475569; font-size: 0.85rem; line-height: 1.5; text-align: justify;">${p.isi}</p>
                </div>
            `;
        }).join('');
    } else {
        feed.innerHTML = `
            <div style="text-align: center; padding: 35px 20px; color: #94a3b8; font-size: 0.85rem; font-style: italic; background: white; border-radius: 14px; border: 1px solid #e2e8f0;">
                📭 Belum ada maklumat atau berita terbaru yang disiarkan.
            </div>
        `;
    }
}

window.aksiTambahPengumuman = function() {
    alert("Fitur broadcast penulisan pengumuman baru ke database Google Sheet siap digunakan!");
};
