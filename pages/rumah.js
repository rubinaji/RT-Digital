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
                <div class="spinner" style="margin: 0 auto 10px auto;"></div>
                <p>Memuat data warga...</p>
            </div>
        </div>
    `;
}

function loadRumahData() {
    const container = document.getElementById("rumah-container");
    if (!container) return;

    // Kerangka UI Utama + Modal Form Tambah Data (disembunyikan secara default)
    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #0f766e; font-size: 1.5rem;">Data Rumah</h2>
            <button id="btn-tambah" style="padding: 8px 15px; font-size: 0.9rem; background: #0f766e; color: white; border: none; border-radius: 8px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">+ Tambah</button>
        </div>
        
        <div style="margin-bottom: 20px;">
            <input type="text" id="input-cari" placeholder="Cari nama atau blok rumah..." style="width: 100%; padding: 12px 15px; border-radius: 10px; border: 1px solid #e2e8f0; outline: none; font-size: 1rem; box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);">
        </div>
        
        <div id="list-rumah" style="display: flex; flex-direction: column; gap: 12px;"></div>

        <div id="modal-tambah" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center; backdrop-filter: blur(2px);">
            <div style="background: white; padding: 25px; border-radius: 16px; width: 90%; max-width: 400px; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
                <h3 style="margin-top: 0; color: #0f172a; margin-bottom: 20px;">Tambah Warga Baru</h3>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-size: 0.9rem; color: #475569; font-weight: bold;">Blok Rumah</label>
                    <input type="text" id="input-blok" placeholder="Contoh: A-04" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none;">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-size: 0.9rem; color: #475569; font-weight: bold;">Nama Penghuni</label>
                    <input type="text" id="input-nama" placeholder="Nama Lengkap" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none;">
                </div>
                
                <div style="margin-bottom: 25px;">
                    <label style="display: block; margin-bottom: 5px; font-size: 0.9rem; color: #475569; font-weight: bold;">Status</label>
                    <select id="input-status" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none; background: white;">
                        <option value="Ditempati">Ditempati</option>
                        <option value="Dikontrak">Dikontrak</option>
                        <option value="Kosong">Kosong</option>
                    </select>
                </div>
                
                <div style="display: flex; justify-content: flex-end; gap: 10px;">
                    <button id="btn-batal" style="padding: 10px 15px; border: none; background: #e2e8f0; color: #475569; border-radius: 8px; cursor: pointer; font-weight: bold;">Batal</button>
                    <button id="btn-simpan" style="padding: 10px 15px; background: #0f766e; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">Simpan Data</button>
                </div>
            </div>
        </div>
    `;

    renderListRumah(dataRumah);

    // Fitur Pencarian
    document.getElementById("input-cari").addEventListener("input", function(e) {
        const keyword = e.target.value.toLowerCase();
        const dataDisaring = dataRumah.filter(rumah => 
            rumah.nama.toLowerCase().includes(keyword) || 
            rumah.blok.toLowerCase().includes(keyword)
        );
        renderListRumah(dataDisaring);
    });

    // === LOGIKA MODAL TAMBAH DATA ===
    const modal = document.getElementById("modal-tambah");
    const inputBlok = document.getElementById("input-blok");
    const inputNama = document.getElementById("input-nama");
    const inputStatus = document.getElementById("input-status");

    // 1. Tampilkan modal saat tombol "+ Tambah" diklik
    document.getElementById("btn-tambah").addEventListener("click", () => {
        modal.style.display = "flex";
    });

    // 2. Sembunyikan modal saat tombol "Batal" diklik
    document.getElementById("btn-batal").addEventListener("click", () => {
        modal.style.display = "none";
        // Bersihkan inputan
        inputBlok.value = "";
        inputNama.value = "";
        inputStatus.value = "Ditempati";
    });

    // 3. Simpan data saat tombol "Simpan Data" diklik
    document.getElementById("btn-simpan").addEventListener("click", () => {
        const blok = inputBlok.value.trim();
        const nama = inputNama.value.trim();
        const status = inputStatus.value;

        // Validasi: pastikan blok dan nama tidak kosong
        if (!blok || !nama) {
            alert("Blok dan Nama penghuni harus diisi ya!");
            return;
        }

        // Masukkan data baru ke paling atas array dataRumah
        dataRumah.unshift({ blok: blok, nama: nama, status: status });

        // Update tampilan layar
        renderListRumah(dataRumah);
        
        // Sembunyikan modal & bersihkan input
        modal.style.display = "none";
        inputBlok.value = "";
        inputNama.value = "";
        inputStatus.value = "Ditempati";
        
        // Notifikasi sederhana
        alert(`Berhasil menambahkan ${nama} di Blok ${blok}!`);
    });
}

function renderListRumah(data) {
    const listContainer = document.getElementById("list-rumah");
    listContainer.innerHTML = "";

    if (data.length === 0) {
        listContainer.innerHTML = `<p style="text-align:center; color:#94a3b8; margin-top:20px;">Data tidak ditemukan.</p>`;
        return;
    }

    data.forEach(rumah => {
        let badgeBg = rumah.status === 'Ditempati' ? '#dcfce7' : (rumah.status === 'Kosong' ? '#fef2f2' : '#fef08a');
        let badgeColor = rumah.status === 'Ditempati' ? '#16a34a' : (rumah.status === 'Kosong' ? '#dc2626' : '#a16207');

        listContainer.innerHTML += `
            <div style="background: white; padding: 15px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h4 style="margin: 0; color: #0f172a; font-size: 1.1rem;">Blok ${rumah.blok}</h4>
                    <p style="margin: 3px 0 0 0; font-size: 0.9rem; color: #64748b;">${rumah.nama}</p>
                </div>
                <span style="background: ${badgeBg}; color: ${badgeColor}; padding: 5px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: bold;">${rumah.status}</span>
            </div>
        `;
    });
}
