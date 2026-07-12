/*==================================================
   RT DIGITAL - MODUL DATA RUMAH (SESUAI SOP BENDAHARA)
==================================================*/

let dataRumah = [
    { blok: "Blok A-01", penghuni: "Bpk. Budi Santoso", status: "Ditempati" },
    { blok: "Blok A-02", penghuni: "Belum ada penghuni", status: "Kosong" },
    { blok: "Blok A-03", penghuni: "Ibu Siti Aminah", status: "Dikontrak" }
];

let editIndexRumah = -1;

function RumahPage() {
    setTimeout(loadRumahData, 50);

    return `
        <div id="rumah-container" style="padding: 20px; animation: fadeIn 0.3s ease;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0; color: #0f766e;">🏘️ Data Rumah</h2>
                <div id="wadah-btn-rumah"></div>
            </div>
            
            <div id="list-rumah" style="display: grid; grid-template-columns: 1fr; gap: 15px;"></div>

            <div id="modal-rumah" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center; backdrop-filter: blur(2px);">
                <div style="background: white; padding: 25px; border-radius: 16px; width: 90%; max-width: 350px;">
                    <h3 id="modal-title-rumah" style="margin-top: 0; margin-bottom: 20px;">Tambah Rumah</h3>
                    
                    <label style="font-size: 0.8rem; color: #64748b; display: block; margin-bottom: 5px;">Nomor Blok:</label>
                    <input type="text" id="input-blok" placeholder="Misal: Blok A-04" style="width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none;">
                    
                    <label style="font-size: 0.8rem; color: #64748b; display: block; margin-bottom: 5px;">Nama Penghuni:</label>
                    <input type="text" id="input-penghuni" placeholder="Nama Kepala Keluarga" style="width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none;">
                    
                    <label style="font-size: 0.8rem; color: #64748b; display: block; margin-bottom: 5px;">Status Rumah:</label>
                    <select id="input-status-rumah" style="width: 100%; padding: 10px; margin-bottom: 20px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none;">
                        <option value="Ditempati">Ditempati</option>
                        <option value="Kosong">Kosong</option>
                        <option value="Dikontrak">Dikontrak</option>
                    </select>
                    
                    <div style="display: flex; gap: 10px;">
                        <button id="btn-batal-rumah" style="flex: 1; padding: 10px; border: none; background: #e2e8f0; border-radius: 8px; cursor: pointer;">Batal</button>
                        <button id="btn-simpan-rumah" style="flex: 1; padding: 10px; border: none; background: #0f766e; color: white; border-radius: 8px; cursor: pointer;">Simpan</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function loadRumahData() {
    const listContainer = document.getElementById("list-rumah");
    const wadahBtn = document.getElementById("wadah-btn-rumah");
    const modal = document.getElementById("modal-rumah");
    
    if (!listContainer) return;

    // 🔒 1. TOMBOL TAMBAH: Dibuka untuk Admin dan Bendahara
    if (currentRole === 'admin' || currentRole === 'bendahara') {
        wadahBtn.innerHTML = `<button id="btn-tambah-rumah" style="padding: 8px 15px; background: #0f766e; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">+ Tambah</button>`;
        
        document.getElementById("btn-tambah-rumah").onclick = () => {
            editIndexRumah = -1; // Set mode Tambah
            document.getElementById("modal-title-rumah").innerText = "Tambah Rumah Baru";
            document.getElementById("input-blok").value = "";
            document.getElementById("input-penghuni").value = "";
            document.getElementById("input-status-rumah").value = "Ditempati";
            modal.style.display = "flex";
        };
    } else {
        wadahBtn.innerHTML = ``;
    }

    document.getElementById("btn-batal-rumah").onclick = () => modal.style.display = "none";
    
    document.getElementById("btn-simpan-rumah").onclick = () => {
        const blok = document.getElementById("input-blok").value;
        const penghuni = document.getElementById("input-penghuni").value;
        const status = document.getElementById("input-status-rumah").value;

        if (!blok || !penghuni) return alert("Blok dan Nama Penghuni harus diisi!");

        if (editIndexRumah === -1) {
            dataRumah.push({ blok, penghuni, status });
        } else {
            dataRumah[editIndexRumah] = { blok, penghuni, status };
        }

        render();
        modal.style.display = "none";
    };

    function render() {
        listContainer.innerHTML = "";
        
        dataRumah.forEach((item, index) => {
            let badgeColor = item.status === 'Kosong' ? '#dc2626' : (item.status === 'Dikontrak' ? '#eab308' : '#16a34a');
            let badgeBg = item.status === 'Kosong' ? '#fef2f2' : (item.status === 'Dikontrak' ? '#fefce8' : '#dcfce7');

            // 🔒 2. CEK PERAN UNTUK TOMBOL EDIT & HAPUS
            let actionButtons = ``;
            if (currentRole === 'admin' || currentRole === 'bendahara') {
                
                // Bendahara BISA edit, tapi TIDAK BISA hapus. Tombol hapus cuma buat Admin.
                let btnHapus = (currentRole === 'admin') 
                    ? `<button onclick="hapusRumah(${index})" style="background: transparent; border: none; cursor: pointer; font-size: 1.2rem; color: #ef4444;" title="Hapus">🗑️</button>` 
                    : ``;

                actionButtons = `
                    <div style="display: flex; gap: 10px;">
                        <button onclick="editRumah(${index})" style="background: transparent; border: none; cursor: pointer; font-size: 1.2rem;" title="Edit Data">✏️</button>
                        ${btnHapus}
                    </div>
                `;
            }

            listContainer.innerHTML += `
                <div class="card" style="padding: 20px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 0;">
                    <div>
                        <h3 style="margin: 0 0 5px 0; color: #1e293b;">${item.blok}</h3>
                        <p style="margin: 0 0 8px 0; color: #64748b; font-size: 0.9rem;">${item.penghuni}</p>
                        <span style="background: ${badgeBg}; color: ${badgeColor}; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: bold;">${item.status}</span>
                    </div>
                    ${actionButtons}
                </div>
            `;
        });
    }

    window.editRumah = function(index) {
        editIndexRumah = index;
        document.getElementById("modal-title-rumah").innerText = "Edit Data Rumah";
        document.getElementById("input-blok").value = dataRumah[index].blok;
        document.getElementById("input-penghuni").value = dataRumah[index].penghuni;
        document.getElementById("input-status-rumah").value = dataRumah[index].status;
        modal.style.display = "flex";
    }

    // Gembok keamanan ganda: Pastikan fungsi hapus menolak akses jika dipaksa selain admin
    window.hapusRumah = function(index) {
        if (currentRole !== 'admin') return alert("Hanya Admin yang berhak menghapus data!");
        
        if(confirm("Yakin ingin menghapus data rumah ini?")) {
            dataRumah.splice(index, 1);
            render();
        }
    }

    render();
}
