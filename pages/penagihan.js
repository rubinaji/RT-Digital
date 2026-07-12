/*==================================================
   RT DIGITAL - MODUL PENAGIHAN (SOP PENAGIH & BENDAHARA)
==================================================*/

// Data kita tambahin kolom "catatan" dan "statusLapangan"
let dataTagihan = [
    { blok: "Blok A-01", penghuni: "Bpk. Budi Santoso", statusRumah: "Ditempati", saldoBulan: 0, catatan: "", statusLapangan: "" },
    { blok: "Blok A-02", penghuni: "Belum ada penghuni", statusRumah: "Kosong", saldoBulan: 0, catatan: "", statusLapangan: "Rumah Kosong" },
    { blok: "Blok A-03", penghuni: "Ibu Siti Aminah", statusRumah: "Dikontrak", saldoBulan: -3, catatan: "Sering ke luar kota.", statusLapangan: "Sulit Ditemui" }, 
    { blok: "Blok A-04", penghuni: "Bpk. Eko Prasetyo", statusRumah: "Ditempati", saldoBulan: 12, catatan: "", statusLapangan: "" } 
];

let queryCari = ""; // Menyimpan teks pencarian

function PenagihanPage() {
    setTimeout(loadPenagihanData, 50);

    return `
        <div id="penagihan-container" style="padding: 20px; animation: fadeIn 0.3s ease;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h2 style="margin: 0; color: #0f766e;">📋 Penagihan</h2>
                <div id="wadah-btn-generate"></div>
            </div>
            <p style="color: #64748b; font-size: 0.9rem; margin-top: 0; margin-bottom: 20px;">Kelola status bayar dan pantauan lapangan.</p>
            
            <div style="margin-bottom: 20px; position: relative;">
                <span style="position: absolute; left: 15px; top: 12px; font-size: 1.2rem; color: #94a3b8;">🔍</span>
                <input type="text" id="input-cari" onkeyup="cariTagihan(this.value)" placeholder="Cari nama, blok, atau lorong..." style="width: 100%; padding: 12px 12px 12px 45px; border: 1px solid #cbd5e1; border-radius: 12px; outline: none; font-size: 0.95rem; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
            </div>

            <div id="list-penagihan" style="display: grid; grid-template-columns: 1fr; gap: 15px;"></div>
        </div>
    `;
}

// Fungsi Pencarian (Live Search)
window.cariTagihan = function(val) {
    queryCari = val.toLowerCase();
    // Panggil render ulang list-penagihan saja (dibuat global)
    if(window.renderListPenagihan) window.renderListPenagihan();
}

function loadPenagihanData() {
    const listContainer = document.getElementById("list-penagihan");
    const wadahBtnGen = document.getElementById("wadah-btn-generate");
    
    if (!listContainer) return;

    // 🔒 TOMBOL GENERATE HANYA ADMIN & BENDAHARA
    if (currentRole === 'admin' || currentRole === 'bendahara') {
        wadahBtnGen.innerHTML = `<button onclick="generateTagihan()" style="padding: 8px 15px; background: #eab308; color: #1e293b; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">⚡ Buat Tagihan</button>`;
    } else {
        wadahBtnGen.innerHTML = ``;
    }

    window.generateTagihan = function() {
        if(confirm("Buat tagihan baru untuk bulan ini? (Saldo bulan setiap warga akan dikurangi 1 otomatis)")) {
            dataTagihan.forEach(warga => {
                if (warga.statusRumah !== "Kosong") warga.saldoBulan -= 1; 
            });
            window.renderListPenagihan();
            alert("Mantap! Tagihan bulan ini sudah disebarkan.");
        }
    }

    // FUNGSI BENDAHARA: Bayar / Cetak Struk
    window.bayarTagihan = function(index) {
        let warga = dataTagihan[index];
        let bayarBerapa = prompt(`Bapak/Ibu ${warga.penghuni} (${warga.blok}).\n\nMau bayar/deposit untuk berapa bulan? (Ketik angka saja)`, "1");
        
        if (bayarBerapa !== null && bayarBerapa !== "") {
            let jmlBayar = parseInt(bayarBerapa);
            if (isNaN(jmlBayar) || jmlBayar <= 0) {
                alert("Masukkan angka yang valid ya!");
            } else {
                warga.saldoBulan += jmlBayar;
                // Otomatis reset status lapangan kalau udah bayar
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

    // FUNGSI PENAGIH: Tambah Catatan Lapangan
    window.editCatatan = function(index) {
        let catatanBaru = prompt(`Tulis catatan penagihan untuk ${dataTagihan[index].blok}:`, dataTagihan[index].catatan);
        if (catatanBaru !== null) {
            dataTagihan[index].catatan = catatanBaru;
            window.renderListPenagihan();
        }
    }

    // FUNGSI PENAGIH: Tandai Status Lapangan
    window.tandaiStatus = function(index) {
        let statusPilihan = prompt(`Pilih Status Lapangan (Ketik angkanya):\n1. Sudah Ditagih\n2. Janji Bayar\n3. Sulit Ditemui\n4. Rumah Kosong\n5. Hapus Status`, "");
        
        if (statusPilihan === "1") dataTagihan[index].statusLapangan = "Sudah Ditagih";
        else if (statusPilihan === "2
