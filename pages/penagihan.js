/*==================================================
   RT DIGITAL - MODUL PENAGIHAN (SISTEM TUNGGAKAN)
==================================================*/

// Data diubah menggunakan angka "tunggakan" agar bisa dihitung
let dataTagihan = [
    { blok: "Blok A-01", penghuni: "Bpk. Budi Santoso", statusRumah: "Ditempati", tunggakan: 0 },
    { blok: "Blok A-02", penghuni: "Belum ada penghuni", statusRumah: "Kosong", tunggakan: 0 },
    { blok: "Blok A-03", penghuni: "Ibu Siti Aminah", statusRumah: "Dikontrak", tunggakan: 3 } // Contoh nunggak 3 bulan
];

function PenagihanPage() {
    setTimeout(loadPenagihanData, 50);

    return `
        <div id="penagihan-container" style="padding: 20px; animation: fadeIn 0.3s ease;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h2 style="margin: 0; color: #0f766e;">📋 Penagihan</h2>
                <div id="wadah-btn-generate"></div>
            </div>
            <p style="color: #64748b; font-size: 0.9rem; margin-top: 0; margin-bottom: 20px;">Kelola status pembayaran kas warga.</p>
            
            <div id="list-penagihan" style="display: grid; grid-template-columns: 1fr; gap: 15px;"></div>
        </div>
    `;
}

function loadPenagihanData() {
    const listContainer = document.getElementById("list-penagihan");
    const wadahBtnGen = document.getElementById("wadah-btn-generate");
    
    if (!listContainer) return;

    // 🔒 Tombol Generate Tagihan HANYA untuk Admin
    if (currentRole === 'admin') {
        wadahBtnGen.innerHTML = `<button onclick="generateTagihan()" style="padding: 8px 15px; background: #eab308; color: #1e293b; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">⚡ Buat Tagihan</button>`;
    } else {
        wadahBtnGen.innerHTML = ``;
    }

    // Fungsi Super Admin: Tambah tunggakan 1 bulan ke semua warga (Kecuali rumah kosong)
    window.generateTagihan = function() {
        if(confirm("Buat tagihan baru untuk bulan ini? (Tunggakan warga akan bertambah 1 bulan otomatis)")) {
            dataTagihan.forEach(warga => {
                if (warga.statusRumah !== "Kosong") {
                    warga.tunggakan += 1;
                }
            });
            render();
            alert("Mantap! Tagihan bulan ini sudah masuk ke catatan warga.");
        }
    }

    // Fungsi Pembayaran Dinamis (Bisa bayar cicil)
    window.bayarTagihan = function(index) {
        let warga = dataTagihan[index];
        
        // Munculkan Pop-up untuk input jumlah bulan yang mau dibayar
        let bayarBerapa = prompt(`Bapak/Ibu ${warga.penghuni} (${warga.blok}) menunggak ${warga.tunggakan} bulan.\n\nMau dibayar berapa bulan sekarang? (Ketik angka)`, "1");
        
        // Validasi input
        if (bayarBerapa !== null && bayarBerapa !== "") {
            let jmlBayar = parseInt(bayarBerapa);
            
            if (isNaN(jmlBayar) || jmlBayar <= 0) {
                alert("Masukkan angka yang benar ya, Bos!");
            } else if (jmlBayar > warga.tunggakan) {
                alert(`Lho, dia cuma nunggak ${warga.tunggakan} bulan. Masa bayar ${jmlBayar} bulan? 😂`);
            } else {
                // Kurangi tunggakan sesuai yang dibayar
                warga.tunggakan -= jmlBayar;
                alert(`Berhasil! Pembayaran ${jmlBayar} bulan untuk ${warga.blok} sudah dicatat.\nSisa tunggakan sekarang: ${warga.tunggakan} bulan.`);
                render();
            }
        }
    }

    function render() {
        listContainer.innerHTML = "";
        
        dataTagihan.forEach((item, index) => {
            let statusBadge = ``;
            let btnAksi = ``;
            let borderStyle = ``;

            // LOGIKA WARNA DAN STATUS TUNGGAKAN
            if (item.statusRumah === 'Kosong') {
                statusBadge = `<span style="background: #f1f5f9; color: #64748b; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: bold;">Rumah Kosong</span>`;
                btnAksi = `<span style="font-size: 0.8rem; color: #64748b;">- Tidak Ditagih -</span>`;
            } 
            else if (item.tunggakan === 0) {
                statusBadge = `<span style="background: #dcfce7; color: #16a34a; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: bold;">Lunas</span>`;
                btnAksi = `<span style="font-size: 0.85rem; color: #16a34a; font-weight: bold;">Lunas Bulan Ini</span>`;
                borderStyle = `border-left: 4px solid #16a34a;`;
            } 
            else {
                statusBadge = `<span style="background: #fef2f2; color: #dc2626; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: bold;">Nunggak ${item.tunggakan} Bulan</span>`;
                borderStyle = `border-left: 4px solid #dc2626;`;
                
                // Cek Role: Cuma Admin, Penagih, dan Bendahara yang bisa klik Bayar
                if (currentRole === 'admin' || currentRole === 'penagih' || currentRole === 'bendahara') {
                    btnAksi = `<button onclick="bayarTagihan(${index})" style="padding: 8px 15px; background: #0f766e; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">💵 Bayar</button>`;
                } else {
                    btnAksi = `<span style="font-size: 0.85rem; color: #dc2626; font-weight: bold;">Segera Lunasi!</span>`;
                }
            }

            listContainer.innerHTML += `
                <div class="card" style="padding: 20px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 0; ${borderStyle}">
                    <div>
                        <h3 style="margin: 0 0 5px 0; color: #1e293b;">${item.blok}</h3>
                        <p style="margin: 0 0 8px 0; color: #64748b; font-size: 0.9rem;">${item.penghuni}</p>
                        ${statusBadge}
                    </div>
                    <div>
                        ${btnAksi}
                    </div>
                </div>
            `;
        });
    }

    render();
}
