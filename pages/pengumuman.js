/*==================================================
   RT DIGITAL - MODUL PENGUMUMAN
==================================================*/

// Dummy data pengumuman
let dataPengumuman = [
    { tanggal: "12 Jul 2026", judul: "Kerja Bakti Rutin", isi: "Diharapkan kehadiran seluruh warga untuk kerja bakti membersihkan selokan Blok A dan B pada hari Minggu pagi." },
    { tanggal: "05 Jul 2026", judul: "Iuran Keamanan", isi: "Sesuai hasil rapat warga, iuran keamanan naik menjadi Rp 25.000 mulai bulan depan." }
];

function PengumumanPage() {
    setTimeout(renderPengumumanList, 50);

    // 🔒 CEK PERAN: Tombol tambah pengumuman HANYA UNTUK ADMIN
    const btnTambah = (currentRole === 'admin') 
        ? `<button onclick="alert('Fitur tulis pengumuman segera hadir!')" style="padding: 8px 15px; background: #0f766e; color: white; border: none; border-radius: 8px; cursor: pointer;">+ Tulis Berita</button>`
        : ``;

    return `
        <div style="padding: 20px; animation: fadeIn 0.3s ease;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0; color: #0f766e;">📢 Pengumuman</h2>
                ${btnTambah}
            </div>
            <p style="color: #64748b; font-size: 0.9rem; margin-top: -10px; margin-bottom: 20px;">Papan informasi dan berita lingkungan RT kita.</p>
            
            <div id="list-pengumuman" style="display: flex; flex-direction: column; gap: 15px;"></div>
        </div>
    `;
}

function renderPengumumanList() {
    const container = document.getElementById("list-pengumuman");
    if (!container) return;
    container.innerHTML = "";

    if (dataPengumuman.length === 0) {
        container.innerHTML = `<p style="text-align:center; color:#94a3b8;">Belum ada pengumuman.</p>`;
        return;
    }

    dataPengumuman.forEach((item, index) => {
        // 🔒 CEK PERAN: Tombol Hapus HANYA UNTUK ADMIN
        const btnHapus = (currentRole === 'admin')
            ? `<button onclick="hapusPengumuman(${index})" style="background: transparent; border: none; font-size: 1.1rem; cursor: pointer; color: #ef4444;" title="Hapus">🗑️</button>`
            : ``;

        container.innerHTML += `
            <div class="card" style="padding: 20px; margin-bottom: 0; border-left: 4px solid #0f766e;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                    <span style="font-size: 0.75rem; color: #64748b; font-weight: bold; background: #f1f5f9; padding: 4px 10px; border-radius: 12px;">🗓️ ${item.tanggal}</span>
                    ${btnHapus}
                </div>
                <h4 style="margin: 0 0 8px 0; color: #1e293b; font-size: 1.1rem;">${item.judul}</h4>
                <p style="margin: 0; color: #475569; font-size: 0.9rem; line-height: 1.5;">${item.isi}</p>
            </div>
        `;
    });
}

window.hapusPengumuman = function(index) {
    if(confirm("Yakin ingin menghapus pengumuman ini?")) {
        dataPengumuman.splice(index, 1);
        renderPengumumanList();
    }
}
