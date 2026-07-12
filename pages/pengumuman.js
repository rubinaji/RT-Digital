/*==================================================
   RT DIGITAL - MODUL PENGUMUMAN
==================================================*/

// Dummy data pengumuman
let dataPengumuman = [
    { tanggal: "12 Jul 2026", judul: "Kerja Bakti Rutin", isi: "Diharapkan kehadiran seluruh warga untuk kerja bakti membersihkan selokan Blok A dan B pada hari Minggu pagi." },
    { tanggal: "05 Jul 2026", judul: "Iuran Keamanan", isi: "Sesuai hasil rapat warga, iuran keamanan naik menjadi Rp 25.000 mulai bulan depan." }
];

function PengumumanPage() {
    setTimeout(loadPengumumanData, 50);

    return `
        <div id="pengumuman-container" style="padding: 20px; animation: fadeIn 0.3s ease;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0; color: #0f766e;">📢 Pengumuman</h2>
                <div id="wadah-btn-tambah"></div>
            </div>
            <p style="color: #64748b; font-size: 0.9rem; margin-top: -10px; margin-bottom: 20px;">Papan informasi dan berita lingkungan RT kita.</p>
            
            <div id="list-pengumuman" style="display: flex; flex-direction: column; gap: 15px;"></div>

            <div id="modal-pengumuman" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center; backdrop-filter: blur(2px);">
                <div style="background: white; padding: 25px; border-radius: 16px; width: 90%; max-width: 400px;">
                    <h3 style="margin-top: 0; margin-bottom: 20px;">Tulis Pengumuman</h3>
                    <input type="text" id="input-judul-pengumuman" placeholder="Judul (Contoh: Rapat Warga)" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none;">
                    <textarea id="input-isi-pengumuman" placeholder="Isi pengumuman..." rows="4" style="width: 100%; padding: 10px; margin-bottom: 20px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none; font-family: inherit;"></textarea>
                    <div style="display: flex; justify-content: flex-end; gap: 10px;">
                        <button id="btn-batal-pengumuman" style="padding: 10px 15px; border: none; background: #e2e8f0; border-radius: 8px; cursor: pointer;">Batal</button>
                        <button id="btn-simpan-pengumuman" style="padding: 10px 15px; background: #0f766e; color: white; border: none; border-radius: 8px; cursor: pointer;">Sebarkan</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function loadPengumumanData() {
    const listContainer = document.getElementById("list-pengumuman");
    const wadahBtn = document.getElementById("wadah-btn-tambah");
    const modal = document.getElementById("modal-pengumuman");

    if (!listContainer) return;

    // 🔒 CEK PERAN: Tombol tambah HANYA UNTUK ADMIN
    if (currentRole === 'admin') {
        wadahBtn.innerHTML = `<button id="btn-tambah-pengumuman" style="padding: 8px 15px; background: #0f766e; color: white; border: none; border-radius: 8px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">+ Tulis Berita</button>`;
        
        // Logika buka-tutup modal
        document.getElementById("btn-tambah-pengumuman").onclick = () => modal.style.display = "flex";
        document.getElementById("btn-batal-pengumuman").onclick = () => modal.style.display = "none";
        
        // Logika simpan data
        document.getElementById("btn-simpan-pengumuman").onclick = () => {
            const judul = document.getElementById("input-judul-pengumuman").value;
            const isi = document.getElementById("input-isi-pengumuman").value;

            if (!judul || !isi) return alert("Judul dan isi pengumuman wajib diisi!");
            
            // Format tanggal otomatis hari ini (misal: 14 Jul 2026)
            const today = new Date();
            const options = { day: '2-digit', month: 'short', year: 'numeric' };
            const tanggal = today.toLocaleDateString('id-ID', options);

            // Tambahkan ke array dan render ulang
            dataPengumuman.unshift({ tanggal, judul, isi });
            render();
            modal.style.display = "none";
            
            // Kosongkan form setelah disimpan
            document.getElementById("input-judul-pengumuman").value = "";
            document.getElementById("input-isi-pengumuman").value = "";
        };
    } else {
        wadahBtn.innerHTML = ``;
    }

    function render() {
        listContainer.innerHTML = "";

        if (dataPengumuman.length === 0) {
            listContainer.innerHTML = `<p style="text-align:center; color:#94a3b8;">Belum ada pengumuman.</p>`;
            return;
        }

        dataPengumuman.forEach((item, index) => {
            // 🔒 CEK PERAN: Tombol Hapus HANYA UNTUK ADMIN
            const btnHapus = (currentRole === 'admin')
                ? `<button onclick="hapusPengumuman(${index})" style="background: transparent; border: none; font-size: 1.1rem; cursor: pointer; color: #ef4444;" title="Hapus">🗑️</button>`
                : ``;

            listContainer.innerHTML += `
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

    // Fungsi Hapus Pengumuman
    window.hapusPengumuman = function(index) {
        if(confirm("Yakin ingin menghapus pengumuman ini?")) {
            dataPengumuman.splice(index, 1);
            render();
        }
    }

    render();
}
