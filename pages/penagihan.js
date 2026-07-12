/*==================================================
   RT DIGITAL - MODUL PENAGIHAN (SOP PENAGIH 100%)
==================================================*/

// Data ditambahkan properti 'rt' dan 'rw' untuk kebutuhan filter
let dataTagihan = [
    { blok: "Blok A-01", penghuni: "Bpk. Budi Santoso", statusRumah: "Ditempati", saldoBulan: 0, catatan: "", statusLapangan: "", rt: "01", rw: "05" },
    { blok: "Blok A-02", penghuni: "Belum ada penghuni", statusRumah: "Kosong", saldoBulan: 0, catatan: "", statusLapangan: "Rumah Kosong", rt: "01", rw: "05" },
    { blok: "Blok A-03", penghuni: "Ibu Siti Aminah", statusRumah: "Dikontrak", saldoBulan: -3, catatan: "Sering ke luar kota.", statusLapangan: "Sulit Ditemui", rt: "02", rw: "05" }, 
    { blok: "Blok A-04", penghuni: "Bpk. Eko Prasetyo", statusRumah: "Ditempati", saldoBulan: 12, catatan: "", statusLapangan: "", rt: "02", rw: "05" } 
];

let queryCari = ""; 
let queryRT = "Semua";
let queryRW = "Semua";

function PenagihanPage() {
    setTimeout(loadPenagihanData, 50);

    return `
        <div id="penagihan-container" style="padding: 20px; animation: fadeIn 0.3s ease;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h2 style="margin: 0; color: #0f766e;">📋 Penagihan</h2>
                <div id="wadah-btn-generate"></div>
            </div>
            <p style="color: #64748b; font-size: 0.9rem; margin-top: 0; margin-bottom: 20px;">Kelola status bayar dan pantauan lapangan.</p>
            
            <div style="margin-bottom: 20px; display: flex; flex-direction: column; gap: 10px;">
                <div style="position: relative;">
                    <span style="position: absolute; left: 15px; top: 12px; font-size: 1.2rem; color: #94a3b8;">🔍</span>
                    <input type="text" id="input-cari" onkeyup="cariTagihan(this.value)" placeholder="Cari nama, blok, atau lorong..." style="width: 100%; padding: 12px 12px 12px 45px; border: 1px solid #cbd5e1; border-radius: 12px; outline: none; font-size: 0.95rem; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                </div>
                
                <div style="display: flex; gap: 10px;">
                    <select id="filter-rw" onchange="filterRW(this.value)" style="flex: 1; padding: 10px; border: 1px solid #cbd5e1; border-radius: 12px; outline: none; font-size: 0.9rem; color: #475569; background: white;">
                        <option value="Semua">Semua RW</option>
                        <option value="05">RW 05</option>
                        <option value="06">RW 06</option>
                    </select>
                    <select id="filter-rt" onchange="filterRT(this.value)" style="flex: 1; padding: 10px; border: 1px solid #cbd5e1; border-radius: 12px; outline: none; font-size: 0.9rem; color: #475569; background: white;">
                        <option value="Semua">Semua RT</option>
                        <option value="01">RT 01</option>
                        <option value="02">RT 02</option>
                        <option value="03">RT 03</option>
                    </select>
                </div>
            </div>

            <div id="list-penagihan" style="display: grid; grid-template-columns: 1fr; gap: 15px;"></div>
        </div>
    `;
}

// Fungsi Trigger Pencarian & Filter
window.cariTagihan = function(val) { queryCari = val.toLowerCase(); if(window.renderListPenagihan) window.renderListPenagihan(); }
window.filterRT = function(val) { queryRT = val; if(window.renderListPenagihan) window.renderListPenagihan(); }
window.filterRW = function(val) { queryRW = val; if(window.renderListPenagihan) window.renderListPenagihan(); }

function loadPenagihanData() {
    const listContainer = document.getElementById("list-penagihan");
    const wadahBtnGen = document.getElementById("wadah-btn-generate");
    
    if (!listContainer) return;

    if (currentRole === 'admin' || currentRole === 'bendahara') {
        wadahBtnGen.innerHTML = `<button onclick="generateTagihan()" style="padding: 8px 15px; background: #eab308; color: #1e293b; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">⚡ Buat Tagihan</button>`;
    } else {
        wadahBtnGen.innerHTML = ``;
    }

    window.generateTagihan = function() {
        if(confirm("Buat tagihan baru untuk bulan ini?")) {
            dataTagihan.forEach(warga => { if (warga.statusRumah !== "Kosong") warga.saldoBulan -= 1; });
            window.renderListPenagihan();
            alert("Mantap! Tagihan bulan ini sudah disebarkan.");
        }
    }

    window.bayarTagihan = function(index) {
        let warga = dataTagihan[index];
        let bayarBerapa = prompt(`Bapak/Ibu ${warga.penghuni} (${warga.blok}).\n\nMau bayar/deposit untuk berapa bulan? (Ketik angka saja)`, "1");
        
        if (bayarBerapa !== null && bayarBerapa !== "") {
            let jmlBayar = parseInt(bayarBerapa);
            if (isNaN(jmlBayar) || jmlBayar <= 0) {
                alert("Masukkan angka yang valid ya!");
            } else {
                warga.saldoBulan += jmlBayar;
                if (warga.saldoBulan >= 0) warga.statusLapangan = "Sudah Bayar";
                if(confirm(`Berhasil! Pembayaran ${jmlBayar} bulan untuk ${warga.blok} berhasil dicatat.\n\nCetak bukti (Struk PDF)?`)) {
                    alert(`🖨️ MENCETAK STRUK...\n\nBlok: ${warga.blok}\nNama: ${warga.penghuni}\nBayar: ${jmlBayar} Bulan\nStatus: BERHASIL`);
                }
                window.renderListPenagihan();
            }
        }
    }

    window.kirimWA = function(index) {
        let warga = dataTagihan[index];
        let jumlahNunggak = Math.abs(warga.saldoBulan);
        let pesan = `Halo Bapak/Ibu ${warga.penghuni} (${warga.blok}).\n\nIzin mengingatkan ada tagihan kas RT yang belum terselesaikan sebanyak *${jumlahNunggak} Bulan*.\nMohon bantuannya ya Bapak/Ibu. 🙏`;
        window.open(`https://wa.me/?text=${encodeURIComponent(pesan)}`, '_blank');
    }

    window.editCatatan = function(index) {
        let catatanBaru = prompt(`Tulis catatan penagihan untuk ${dataTagihan[index].blok}:`, dataTagihan[index].catatan);
        if (catatanBaru !== null) { dataTagihan[index].catatan = catatanBaru; window.renderListPenagihan(); }
    }

    window.tandaiStatus = function(index) {
        let statusPilihan = prompt(`Pilih Status Lapangan (Ketik angkanya):\n1. Sudah Ditagih\n2. Janji Bayar\n3. Sulit Ditemui\n4. Rumah Kosong\n5. Hapus Status`, "");
        if (statusPilihan === "1") dataTagihan[index].statusLapangan = "Sudah Ditagih";
        else if (statusPilihan === "2") dataTagihan[index].statusLapangan = "Janji Bayar";
        else if (statusPilihan === "3") dataTagihan[index].statusLapangan = "Sulit Ditemui";
        else if (statusPilihan === "4") dataTagihan[index].statusLapangan = "Rumah Kosong";
        else if (statusPilihan === "5") dataTagihan[index].statusLapangan = "";
        window.renderListPenagihan();
    }

    window.renderListPenagihan = function() {
        listContainer.innerHTML = "";
        
        // 🔥 LOGIKA FILTER PINTAR: Cek Teks Pencarian + Cek Pilihan RT + Cek Pilihan RW
        let filteredData = dataTagihan.filter(item => {
            let cocokTeks = item.blok.toLowerCase().includes(queryCari) || item.penghuni.toLowerCase().includes(queryCari) || item.catatan.toLowerCase().includes(queryCari);
            let cocokRT = (queryRT === "Semua") ? true : (item.rt === queryRT);
            let cocokRW = (queryRW === "Semua") ? true : (item.rw === queryRW);
            
            return cocokTeks && cocokRT && cocokRW;
        });

        if (filteredData.length === 0) {
            listContainer.innerHTML = `<p style="text-align:center; color:#94a3b8; margin-top: 30px;">Data tidak ditemukan.</p>`;
            return;
        }

        filteredData.forEach((item) => {
            let indexOriginal = dataTagihan.indexOf(item); 
            
            let statusBadge = ``;
            let borderStyle = ``;
            let uiAksi = ``;
            
            let badgeLapangan = ``;
            let infoCatatan = ``;
            
            if (currentRole !== 'warga') {
                badgeLapangan = item.statusLapangan ? `<span style="background: #f1f5f9; color: #475569; padding: 3px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: bold; border: 1px dashed #cbd5e1; margin-top: 5px; display: inline-block;">📌 ${item.statusLapangan}</span>` : ``;
                infoCatatan = item.catatan ? `<p style="margin: 8px 0 0 0; font-size: 0.8rem; color: #d97706; font-style: italic; background: #fffbeb; padding: 5px 8px; border-left: 2px solid #f59e0b;">📝 "${item.catatan}"</p>` : ``;
            }

            let btnCatatan = (currentRole === 'admin' || currentRole === 'penagih') ? `<button onclick="editCatatan(${indexOriginal})" style="padding: 6px; background: transparent; border: 1px solid #cbd5e1; border-radius: 8px; cursor: pointer; color: #64748b;" title="Catatan Lapangan">📝</button>` : ``;
            let btnTandai = (currentRole === 'admin' || currentRole === 'penagih') ? `<button onclick="tandaiStatus(${indexOriginal})" style="padding: 6px; background: transparent; border: 1px solid #cbd5e1; border-radius: 8px; cursor: pointer; color: #64748b;" title="Tandai Status">📌</button>` : ``;
            
            if (item.statusRumah === 'Kosong') {
                statusBadge = `<span style="color: #64748b; font-size: 0.75rem; font-weight: bold;">Rumah Kosong</span>`;
            } else if (item.saldoBulan >= 0) {
                statusBadge = `<span style="color: #16a34a; font-size: 0.75rem; font-weight: bold;">Lunas ${item.saldoBulan > 0 ? '+Deposit' : ''}</span>`;
                borderStyle = `border-left: 4px solid #16a34a;`;
                
                if (currentRole === 'admin' || currentRole === 'bendahara') {
                    uiAksi = `<button onclick="bayarTagihan(${indexOriginal})" style="padding: 8px 12px; background: #0f766e; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">💵 Bayar</button>`;
                }
            } else {
                statusBadge = `<span style="color: #dc2626; font-size: 0.75rem; font-weight: bold;">Nunggak ${Math.abs(item.saldoBulan)} Bln</span>`;
                borderStyle = `border-left: 4px solid #dc2626;`;
                
                if (currentRole === 'admin' || currentRole === 'bendahara') {
                    uiAksi = `
                        <div style="display: flex; gap: 5px;">
                            <button onclick="kirimWA(${indexOriginal})" style="padding: 8px 10px; background: #22c55e; color: white; border: none; border-radius: 8px; cursor: pointer;" title="Kirim WA">💬</button>
                            <button onclick="bayarTagihan(${indexOriginal})" style="padding: 8px 12px; background: #ef4444; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">💵 Bayar</button>
                        </div>
                    `;
                }
            }

            let actionContainer = `
                <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
                    <div style="display: flex; gap: 5px;">${btnCatatan} ${btnTandai}</div>
                    ${uiAksi}
                </div>
            `;

            listContainer.innerHTML += `
                <div class="card" style="padding: 15px; display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0; ${borderStyle}">
                    <div style="flex: 1; padding-right: 10px;">
                        <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 3px;">
                            <h3 style="margin: 0; color: #1e293b; font-size: 1rem;">${item.blok}</h3>
                            <span style="background: #e2e8f0; color: #475569; font-size: 0.65rem; padding: 2px 6px; border-radius: 4px; font-weight: bold;">RT ${item.rt}/RW ${item.rw}</span>
                        </div>
                        <p style="margin: 0 0 5px 0; color: #64748b; font-size: 0.85rem;">${item.penghuni}</p>
                        ${statusBadge}
                        <br>
                        ${badgeLapangan}
                        ${infoCatatan}
                    </div>
                    ${actionContainer}
                </div>
            `;
        });
    }

    window.renderListPenagihan();
}
