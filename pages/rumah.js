/*==================================================
   RT DIGITAL - HALAMAN DATA RUMAH & WARGA
==================================================*/

let dataRumah = [
    { blok: "A-01", nama: "Bpk. Budi Santoso", status: "Ditempati" },
    { blok: "A-02", nama: "Belum ada penghuni", status: "Kosong" },
    { blok: "A-03", nama: "Ibu Siti Aminah", status: "Dikontrak" }
];

function RumahPage() {
    setTimeout(loadRumahData, 50);
    return `
        <div id="rumah-container" style="animation: fadeIn 0.3s ease; padding: 20px;">
            <div style="text-align: center; margin-top: 50px; color: #64748b;">
                <p>Memuat data warga...</p>
            </div>
        </div>
    `;
}

function loadRumahData() {
    const container = document.getElementById("rumah-container");
    if (!container) return;

    // 🔒 CEK PERAN: Tombol tambah SEKARANG HANYA UNTUK ADMIN (Sesuai aturan baru!)
    const tombolTambah = (currentRole === 'admin') 
        ? `<button id="btn-tambah" style="padding: 8px 15px; font-size: 0.9rem; background: #0f766e; color: white; border: none; border-radius: 8px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">+ Tambah</button>` 
        : ``;

    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #0f766e; font-size: 1.5rem;">Data Rumah</h2>
            ${tombolTambah}
        </div>
        
        <div style="margin-bottom: 20px;">
            <input type="text" id="input-cari" placeholder="Cari nama atau blok rumah..." style="width: 100%; padding: 12px 15px; border-radius: 10px; border: 1px solid #e2e8f0; outline: none; font-size: 1rem;">
        </div>
        
        <div id="list-rumah" style="display: flex; flex-direction: column; gap: 12px;"></div>

        <div id="modal-tambah" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center; backdrop-filter: blur(2px);">
            <div style="background: white; padding: 25px; border-radius: 16px; width: 90%; max-width: 400px;">
                <h3 style="margin-top: 0; margin-bottom: 20px;">Tambah Warga Baru</h3>
                <input type="text" id="input-blok" placeholder="Blok (Contoh: A-04)" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none;">
                <input type="text" id="input-nama" placeholder="Nama Lengkap" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none;">
                <select id="input-status" style="width: 100%; padding: 10px; margin-bottom: 20px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none;">
                    <option value="Ditempati">Ditempati</option>
                    <option value="Dikontrak">Dikontrak</option>
                    <option value="Kosong">Kosong</option>
                </select>
                <div style="display: flex; justify-content: flex-end; gap: 10px;">
                    <button id="btn-batal" style="padding: 10px 15px; border: none; background: #e2e8f0; border-radius: 8px; cursor: pointer;">Batal</button>
                    <button id="btn-simpan" style="padding: 10px 15px; background: #0f766e; color: white; border: none; border-radius: 8px; cursor: pointer;">Simpan</button>
                </div>
            </div>
        </div>
    `;

    renderListRumah(dataRumah);

    // Fitur Pencarian
    document.getElementById("input-cari").addEventListener("input", function(e) {
        const keyword = e.target.value.toLowerCase();
        renderListRumah(dataRumah.filter(r => r.nama.toLowerCase().includes(keyword) || r.blok.toLowerCase().includes(keyword)));
    });

    // Logika Modal
    const btnTambahNode = document.getElementById("btn-tambah");
    if (btnTambahNode) {
        const modal = document.getElementById("modal-tambah");
        btnTambahNode.onclick = () => modal.style.display = "flex";
        document.getElementById("btn-batal").onclick = () => modal.style.display = "none";
        
        document.getElementById("btn-simpan").onclick = () => {
            const blok = document.getElementById("input-blok").value;
            const nama = document.getElementById("input-nama").value;
            const status = document.getElementById("input-status").value;

            if (!blok || !nama) return alert("Blok dan Nama wajib diisi!");
            
            dataRumah.unshift({ blok, nama, status });
            renderListRumah(dataRumah);
            modal.style.display = "none";
        };
    }
}

function renderListRumah(data) {
    const listContainer = document.getElementById("list-rumah");
    listContainer.innerHTML = "";

    if (data.length === 0) return listContainer.innerHTML = `<p style="text-align:center; color:#94a3b8;">Data tidak ditemukan.</p>`;

    data.forEach(rumah => {
        let badgeBg = rumah.status === 'Ditempati' ? '#dcfce7' : (rumah.status === 'Kosong' ? '#fef2f2' : '#fef08a');
        let badgeColor = rumah.status === 'Ditempati' ? '#16a34a' : (rumah.status === 'Kosong' ? '#dc2626' : '#a16207');

        // 🔒 CEK PERAN: Tombol Hapus (Tong Sampah) HANYA UNTUK ADMIN
        const btnHapus = (currentRole === 'admin') 
            ? `<button style="background: transparent; border: none; color: #ef4444; cursor: pointer; margin-left: 10px; font-size: 1.2rem;" onclick="hapusRumah('${rumah.blok}')">🗑️</button>` 
            : ``;

        listContainer.innerHTML += `
            <div class="card" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0; padding: 15px;">
                <div style="flex: 1;">
                    <h4 style="margin: 0; color: #0f172a; font-size: 1.1rem;">Blok ${rumah.blok}</h4>
                    <p style="margin: 3px 0 0 0; font-size: 0.9rem; color: #64748b;">${rumah.nama}</p>
                </div>
                <div style="display: flex; align-items: center;">
                    <span style="background: ${badgeBg}; color: ${badgeColor}; padding: 5px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: bold;">${rumah.status}</span>
                    ${btnHapus}
                </div>
            </div>
        `;
    });
}

// Fungsi Hapus Data
window.hapusRumah = function(blok) {
    if(confirm(`Yakin ingin menghapus warga di Blok ${blok}?`)) {
        dataRumah = dataRumah.filter(r => r.blok !== blok);
        renderListRumah(dataRumah);
    }
}
