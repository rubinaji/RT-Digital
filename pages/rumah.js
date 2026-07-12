/*==================================================
   RT DIGITAL - MODUL DATA RUMAH (REAL-TIME GOOGLE SHEETS)
   (SESUAI MATRIKS HAK AKSES RESMI)
==================================================*/

let globalDataRumah = [];
let editIndexRumah = -1; 

async function rumahPage() {
    const mainContent = document.getElementById("main-content");
    if (!mainContent) return;

    // 1. Tampilkan status loading transparan
    mainContent.innerHTML = `
        <div style="padding: 50px 20px; text-align: center; color: #0f766e; font-weight: bold; font-size: 0.95rem;">
            🔄 Memuat data warga dari server...
        </div>
    `;

    // 2. Ambil data asli dari Google Sheet via API
    let respon = await api("getRumah");

    if (respon.status === "success") {
        globalDataRumah = respon.data; // Simpan ke variabel lokal untuk dirender
        
        // 3. Render kerangka halaman dan kerangka Modal
        mainContent.innerHTML = `
            <div id="rumah-container" style="padding: 20px; animation: fadeIn 0.3s ease;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; color: #0f766e;">🏘️ Data Rumah Warga</h2>
                    <div id="wadah-btn-rumah"></div>
                </div>
                
                ${currentRole === 'warga' ? `<div style="background:#f0fdf4; color:#16a34a; padding:10px 15px; border-radius:10px; font-size:0.75rem; font-weight:bold; margin-bottom:15px; border:1px solid #bbf7d0;">👁️ Mode Warga: Menampilkan data rumah Anda sendiri secara privat.</div>` : ''}
                ${currentRole === 'penagih' ? `<div style="background:#f8fafc; color:#475569; padding:10px 15px; border-radius:10px; font-size:0.75rem; font-weight:bold; margin-bottom:15px; border:1px solid #cbd5e1;">👁️ Mode Lihat: Hak akses Penagih (Read-Only).</div>` : ''}

                <div id="list-rumah" style="display: grid; grid-template-columns: 1fr; gap: 15px;"></div>

                <div id="modal-rumah" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center; backdrop-filter: blur(2px);">
                    <div style="background: white; padding: 25px; border-radius: 16px; width: 90%; max-width: 350px; max-height: 85vh; overflow-y: auto;">
                        <h3 id="modal-title-rumah" style="margin-top: 0; margin-bottom: 15px;">Tambah Rumah</h3>
                        
                        <label style="font-size: 0.8rem; color: #64748b; display: block; margin-bottom: 5px;">Nomor Blok:</label>
                        <input type="text" id="input-blok" placeholder="Misal: A-04" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none;">
                        
                        <label style="font-size: 0.8rem; color: #64748b; display: block; margin-bottom: 5px;">Nama Penghuni:</label>
                        <input type="text" id="input-penghuni" placeholder="Nama Kepala Keluarga" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none;">
                        
                        <label style="font-size: 0.8rem; color: #64748b; display: block; margin-bottom: 5px;">No. WhatsApp:</label>
                        <input type="number" id="input-wa" placeholder="Awali 62 (Misal: 62812...)" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none;">

                        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                            <div style="flex: 1;">
                                <label style="font-size: 0.8rem; color: #64748b; display: block; margin-bottom: 5px;">RT:</label>
                                <input type="text" id="input-rt" placeholder="Misal: 04" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none;">
                            </div>
                            <div style="flex: 1;">
                                <label style="font-size: 0.8rem; color: #64748b; display: block; margin-bottom: 5px;">RW:</label>
                                <input type="text" id="input-rw" placeholder="Misal: 05" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none;">
                            </div>
                        </div>

                        <label style="font-size: 0.8rem; color: #64748b; display: block; margin-bottom: 5px;">Status Rumah:</label>
                        <select id="input-status-rumah" style="width: 100%; padding: 10px; margin-bottom: 20px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none; background: white;">
                            <option value="Ditempati">Ditempati</option>
                            <option value="Kosong">Kosong</option>
                            <option value="Dikontrak">Dikontrak</option>
                            <option value="Lunas">Lunas</option>
                        </select>
                        
                        <div style="display: flex; gap: 10px;">
                            <button id="btn-batal-rumah" style="flex: 1; padding: 10px; border: none; background: #e2e8f0; border-radius: 8px; cursor: pointer; font-weight: bold;">Batal</button>
                            <button id="btn-simpan-rumah" style="flex: 1; padding: 10px; border: none; background: #0f766e; color: white; border-radius: 8px; cursor: pointer; font-weight: bold;">Simpan</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        setupRumahLogic();
    } else {
        mainContent.innerHTML = `<div style="padding: 30px; text-align: center; color: #dc2626;">❌ Gagal memuat data: ${respon.message}</div>`;
    }
}

function setupRumahLogic() {
    const listContainer = document.getElementById("list-rumah");
    const wadahBtn = document.getElementById("wadah-btn-rumah");
    const modal = document.getElementById("modal-rumah");
    
    // 🔒 MATRIKS AKSES: Hanya Admin & Bendahara yang bisa memunculkan tombol Tambah (✅)
    if (currentRole === 'admin' || currentRole === 'bendahara') {
        wadahBtn.innerHTML = `<button id="btn-tambah-rumah" style="padding: 8px 15px; background: #0f766e; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">+ Tambah Warga</button>`;
        
        document.getElementById("btn-tambah-rumah").onclick = () => {
            editIndexRumah = -1;
            document.getElementById("modal-title-rumah").innerText = "Tambah Rumah Baru";
            document.getElementById("input-blok").value = "";
            document.getElementById("input-blok").disabled = false;
            document.getElementById("input-blok").style.background = "white";
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

        if (editIndexRumah === -1) {
            // PROSES TAMBAH DATA (ADMIN/BENDAHARA)
            let res = await api("tambahRumah", {
                blok: blok, nama: penghuni, wa: noWA, rt: rt, rw: rw, status: status
            });

            if(res.status === "success") {
                alert("Berhasil menyimpan data warga baru!");
                modal.style.display = "none";
                rumahPage(); 
            } else {
                alert("Gagal menyimpan: " + res.message);
            }
        } else {
            // PROSES EDIT DATA (ADMIN/BENDAHARA)
            let res = await api("editRumah", {
                blok: blok, rtrw: `RT ${rt}/RW ${rw}`, nama: penghuni, wa: noWA, status: status
            });

            if(res.status === "success") {
                alert("Berhasil memperbarui data rumah warga!");
                modal.style.display = "none";
                rumahPage(); 
            } else {
                alert("Gagal update: " + res.message);
            }
        }

        btnSimpan.innerText = "Simpan";
        btnSimpan.disabled = false;
    };

    function renderKartuRumah() {
        listContainer.innerHTML = "";
        
        // FILTER MATRIKS: Warga hanya bisa melihat miliknya sendiri (👁️ milik sendiri)
        let dataTersaring = globalDataRumah;
        if (currentRole === 'warga') {
            let filterBlok = myBlok ? myBlok.toString().toLowerCase().trim() : "";
            dataTersaring = globalDataRumah.filter(item => item.blok.toString().toLowerCase().trim() === filterBlok);
        }
        
        if (dataTersaring.length === 0) {
            listContainer.innerHTML = `<div style="text-align:center; padding:20px; color:#94a3b8; font-size:0.85rem;">Belum ada catatan data warga terdaftar.</div>`;
            return;
        }

        dataTersaring.forEach((item) => {
            let propertiStatus = item.status || "Kosong";
            let badgeColor = propertiStatus.toLowerCase() === 'kosong' ? '#dc2626' : (propertiStatus.toLowerCase() === 'dikontrak' ? '#eab308' : '#16a34a');
            let badgeBg = propertiStatus.toLowerCase() === 'kosong' ? '#fef2f2' : (propertiStatus.toLowerCase() === 'dikontrak' ? '#fefce8' : '#dcfce7');

            // 🔒 MATRIKS AKSES: Hanya Admin & Bendahara yang memunculkan tombol Edit. Hapus dilarang total (❌)
            let actionButtons = ``;
            if (currentRole === 'admin' || currentRole === 'bendahara') {
                actionButtons = `
                    <div style="display: flex; gap: 10px;">
                        <button onclick="bukaModalEditRumah('${item.blok}')" style="background: transparent; border: none; cursor: pointer; font-size: 1.2rem;" title="Edit Data Warga">✏️</button>
                    </div>
                `;
            }

            listContainer.innerHTML += `
                <div class="card" style="padding: 20px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 0; background: white; border: 1px solid #e2e8f0; border-radius:14px;">
                    <div>
                        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 3px;">
                            <h3 style="margin: 0; color: #1e293b; font-size:1.05rem;">Blok ${item.blok}</h3>
                            <span style="background: #f1f5f9; color: #475569; font-size: 0.65rem; padding: 2px 6px; border-radius: 4px; font-weight: bold; border: 1px solid #cbd5e1;">${item.rtrw || 'RT 01/RW 05'}</span>
                        </div>
                        <p style="margin: 0 0 5px 0; color: #64748b; font-size: 0.88rem; font-weight:500;">${item.nama}</p>
                        ${item.wa ? `<p style="margin: 0 0 8px 0; color: #22c55e; font-size: 0.8rem; font-weight: bold;">📞 +${item.wa}</p>` : `<p style="margin: 0 0 8px 0; color: #94a3b8; font-size: 0.8rem; font-style: italic;">No WA Tidak Terdaftar</p>`}
                        <span style="background: ${badgeBg}; color: ${badgeColor}; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: bold; border: 1px solid ${badgeBg};">${propertiStatus}</span>
                    </div>
                    ${actionButtons}
                </div>
            `;
        });
    }

    window.bukaModalEditRumah = function(nomorBlok) {
        let index = globalDataRumah.findIndex(item => item.blok.toString().toLowerCase().trim() === nomorBlok.toString().toLowerCase().trim());
        if (index === -1) return;

        editIndexRumah = index;
        document.getElementById("modal-title-rumah").innerText = "Edit Data Rumah";
        
        // Kunci kolom Blok saat edit agar tidak memicu error pencarian database
        document.getElementById("input-blok").value = globalDataRumah[index].blok;
        document.getElementById("input-blok").disabled = true;
        document.getElementById("input-blok").style.background = "#f1f5f9";
        
        document.getElementById("input-penghuni").value = globalDataRumah[index].nama;
        document.getElementById("input-wa").value = globalDataRumah[index].wa || "";
        
        let rtrwRaw = globalDataRumah[index].rtrw || "RT 01/RW 05";
        let matchRt = rtrwRaw.match(/RT\s*(\d+)/i);
        let matchRw = rtrwRaw.match(/RW\s*(\d+)/i);
        document.getElementById("input-rt").value = matchRt ? matchRt[1] : "01";
        document.getElementById("input-rw").value = matchRw ? matchRw[1] : "05";
        
        document.getElementById("input-status-rumah").value = globalDataRumah[index].status || "Ditempati";
        modal.style.display = "flex";
    };

    renderKartuRumah();
}
