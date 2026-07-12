/*==================================================
   RT DIGITAL - MODUL DATA RUMAH (REAL-TIME GOOGLE SHEETS)
==================================================*/

let globalDataRumah = [];
let editIndexRumah = -1; 

async function rumahPage() {
    const mainContent = document.getElementById("main-content");
    if (!mainContent) return;

    // 1. Tampilkan status loading transparan
    mainContent.innerHTML = `
        <div style="padding: 50px 20px; text-align: center; color: #0f766e; font-weight: bold; font-size: 0.95rem;">
            🔄 Memuat data rumah dari server...
        </div>
    `;

    // 2. Ambil data asli dari Google Sheet via API
    let respon = await api("getRumah");

    if (respon.status === "success") {
        globalDataRumah = respon.data; // Simpan ke variabel lokal untuk dirender
        
        // 3. Render kerangka halaman dan kerangka Modal (Dropdown RT/RW sudah diubah jadi Input Bebas)
        mainContent.innerHTML = `
            <div id="rumah-container" style="padding: 20px; animation: fadeIn 0.3s ease;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; color: #0f766e;">🏘️ Data Rumah</h2>
                    <div id="wadah-btn-rumah"></div>
                </div>
                
                <div id="list-rumah" style="display: grid; grid-template-columns: 1fr; gap: 15px;"></div>

                <div id="modal-rumah" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center; backdrop-filter: blur(2px);">
                    <div style="background: white; padding: 25px; border-radius: 16px; width: 90%; max-width: 350px; max-height: 85vh; overflow-y: auto;">
                        <h3 id="modal-title-rumah" style="margin-top: 0; margin-bottom: 15px;">Tambah Rumah</h3>
                        
                        <label style="font-size: 0.8rem; color: #64748b; display: block; margin-bottom: 5px;">Nomor Blok:</label>
                        <input type="text" id="input-blok" placeholder="Misal: Blok A-04" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none;">
                        
                        <label style="font-size: 0.8rem; color: #64748b; display: block; margin-bottom: 5px;">Nama Penghuni:</label>
                        <input type="text" id="input-penghuni" placeholder="Nama Kepala Keluarga" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none;">
                        
                        <label style="font-size: 0.8rem; color: #64748b; display: block; margin-bottom: 5px;">No. WhatsApp:</label>
                        <input type="number" id="input-wa" placeholder="Awali 62 (Misal: 62812...)" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none;">

                        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                            <div style="flex: 1;">
                                <label style="font-size: 0.8rem; color: #64748b; display: block; margin-bottom: 5px;">RT:</label>
                                <input type="text" id="input-rt" placeholder="Misal: 04" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none; background: white;">
                            </div>
                            <div style="flex: 1;">
                                <label style="font-size: 0.8rem; color: #64748b; display: block; margin-bottom: 5px;">RW:</label>
                                <input type="text" id="input-rw" placeholder="Misal: 05" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none; background: white;">
                            </div>
                        </div>

                        <label style="font-size: 0.8rem; color: #64748b; display: block; margin-bottom: 5px;">Status Rumah:</label>
                        <select id="input-status-rumah" style="width: 100%; padding: 10px; margin-bottom: 20px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none; background: white;">
                            <option value="Ditempati">Ditempati</option>
                            <option value="Kosong">Kosong</option>
                            <option value="Dikontrak">Dikontrak</option>
                        </select>
                        
                        <div style="display: flex; gap: 10px;">
                            <button id="btn-batal-rumah" style="flex: 1; padding: 10px; border: none; background: #e2e8f0; border-radius: 8px; cursor: pointer; font-weight: bold;">Batal</button>
                            <button id="btn-simpan-rumah" style="flex: 1; padding: 10px; border: none; background: #0f766e; color: white; border-radius: 8px; cursor: pointer; font-weight: bold;">Simpan</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 4. Jalankan fungsionalitas UI setelah kerangka dimuat
        setupRumahLogic();
    } else {
        mainContent.innerHTML = `<div style="padding: 30px; text-align: center; color: #dc2626;">❌ Gagal memuat data: ${respon.message}</div>`;
    }
}

function setupRumahLogic() {
    const listContainer = document.getElementById("list-rumah");
    const wadahBtn = document.getElementById("wadah-btn-rumah");
    const modal = document.getElementById("modal-rumah");
    
    if (currentRole === 'admin' || currentRole === 'bendahara') {
        wadahBtn.innerHTML = `<button id="btn-tambah-rumah" style="padding: 8px 15px; background: #0f766e; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">+ Tambah</button>`;
        
        document.getElementById("btn-tambah-rumah").onclick = () => {
            editIndexRumah = -1;
            document.getElementById("modal-title-rumah").innerText = "Tambah Rumah Baru";
            document.getElementById("input-blok").value = "";
            document.getElementById("input-penghuni").value = "";
            document.getElementById("input-wa").value = "";
            document.getElementById("input-rt").value = "01";
            document.getElementById("input-rw").value = "05";
            document.getElementById("input-status-rumah").value = "Ditempati";
            modal.style.display = "flex";
        };
    } else {
        wadahBtn.innerHTML = ``;
    }

    document.getElementById("btn-batal-rumah").onclick = () => modal.style.display = "none";
    
    document.getElementById("btn-simpan-rumah").onclick = async () => {
        const btnSimpan = document.getElementById("btn-simpan-rumah");
        
        const blok = document.getElementById("input-blok").value;
        const penghuni = document.getElementById("input-penghuni").value;
        const noWA = document.getElementById("input-wa").value;
        const rt = document.getElementById("input-rt").value;
        const rw = document.getElementById("input-rw").value;
        const status = document.getElementById("input-status-rumah").value;

        if (!blok || !penghuni) return alert("Blok dan Nama Penghuni harus diisi!");

        btnSimpan.innerText = "Menyimpan...";
        btnSimpan.disabled = true;

        ifif (editIndexRumah === -1) {
            // ... (KODE TAMBAH RUMAH YANG SUDAH ADA, JANGAN DIUBAH) ...
            let res = await api("tambahRumah", {
                blok: blok, rtrw: `RT ${rt}/RW ${rw}`, nama: penghuni, wa: noWA, status: status
            });

            if(res.status === "success") {
                alert("Berhasil menyimpan rumah baru ke database!");
                modal.style.display = "none";
                navigate("rumah"); 
            } else {
                alert("Gagal menyimpan: " + res.message);
            }
        } else {
            // FITUR EDIT SEKARANG SUDAH HIDUP! 🚀
            let res = await api("editRumah", {
                blok: blok,  // Ini yang jadi kunci pencarian di Sheet
                rtrw: `RT ${rt}/RW ${rw}`,
                nama: penghuni,
                wa: noWA,
                status: status
            });

            if(res.status === "success") {
                alert("Berhasil memperbarui data rumah!");
                modal.style.display = "none";
                navigate("rumah"); // Refresh halaman otomatis
            } else {
                alert("Gagal update: " + res.message);
            }
        }

        btnSimpan.innerText = "Simpan";
        btnSimpan.disabled = false;
    };

    function renderKartuRumah() {
        listContainer.innerHTML = "";
        
        if (globalDataRumah.length === 0) {
            listContainer.innerHTML = `<div style="text-align:center; padding:20px; color:#94a3b8;">Belum ada data warga terdaftar.</div>`;
            return;
        }

        globalDataRumah.forEach((item, index) => {
            let propertiStatus = item.status || "Kosong";
            let badgeColor = propertiStatus.toLowerCase() === 'kosong' ? '#dc2626' : (propertiStatus.toLowerCase() === 'dikontrak' ? '#eab308' : '#16a34a');
            let badgeBg = propertiStatus.toLowerCase() === 'kosong' ? '#fef2f2' : (propertiStatus.toLowerCase() === 'dikontrak' ? '#fefce8' : '#dcfce7');

            let actionButtons = ``;
            if (currentRole === 'admin' || currentRole === 'bendahara') {
                let btnHapus = (currentRole === 'admin') 
                    ? `<button onclick="alert('Fitur hapus database sedang dikembangkan.')" style="background: transparent; border: none; cursor: pointer; font-size: 1.2rem; color: #ef4444;" title="Hapus">🗑️</button>` 
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
                        <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 3px;">
                            <h3 style="margin: 0; color: #1e293b;">${item.blok}</h3>
                            <span style="background: #f1f5f9; color: #475569; font-size: 0.65rem; padding: 2px 6px; border-radius: 4px; font-weight: bold; border: 1px solid #cbd5e1;">${item.rtrw || 'RT 01/RW 05'}</span>
                        </div>
                        <p style="margin: 0 0 5px 0; color: #64748b; font-size: 0.9rem;">${item.nama}</p>
                        ${item.wa ? `<p style="margin: 0 0 8px 0; color: #22c55e; font-size: 0.8rem; font-weight: bold;">📞 +${item.wa}</p>` : `<p style="margin: 0 0 8px 0; color: #94a3b8; font-size: 0.8rem; font-style: italic;">No WA tidak ada</p>`}
                        <span style="background: ${badgeBg}; color: ${badgeColor}; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: bold;">${propertiStatus}</span>
                    </div>
                    ${actionButtons}
                </div>
            `;
        });
    }

    window.editRumah = function(index) {
        editIndexRumah = index;
        document.getElementById("modal-title-rumah").innerText = "Edit Data Rumah";
        document.getElementById("input-blok").value = globalDataRumah[index].blok;
        document.getElementById("input-penghuni").value = globalDataRumah[index].nama;
        document.getElementById("input-wa").value = globalDataRumah[index].wa || "";
        
        // Ekstrak angka dari string "RT 01/RW 05" agar otomatis masuk kolom saat edit
        let rtrwRaw = globalDataRumah[index].rtrw || "RT 01/RW 05";
        let matchRt = rtrwRaw.match(/RT\s*(\d+)/i);
        let matchRw = rtrwRaw.match(/RW\s*(\d+)/i);
        document.getElementById("input-rt").value = matchRt ? matchRt[1] : "01";
        document.getElementById("input-rw").value = matchRw ? matchRw[1] : "05";
        
        document.getElementById("input-status-rumah").value = globalDataRumah[index].status || "Ditempati";
        modal.style.display = "flex";
    }

    renderKartuRumah();
}
