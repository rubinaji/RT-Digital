/*==================================================
   RT DIGITAL - MODUL PENAGIHAN (GENERATE TAGIHAN)
==================================================*/

let dataTagihan = [
    { blok: "Blok A-01", penghuni: "Bpk. Budi Santoso", statusBayar: "Lunas", periode: "Lunas s/d Juli 2026" },
    { blok: "Blok A-02", penghuni: "Belum ada penghuni", statusBayar: "Kosong", periode: "-" },
    { blok: "Blok A-03", penghuni: "Ibu Siti Aminah", statusBayar: "Belum Bayar", periode: "Tagihan Juli 2026" }
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

    // Fungsi Super Admin: Bikin tagihan massal untuk bulan baru
    window.generateTagihan = function() {
        if(confirm("Buat tagihan baru untuk bulan ini? Seluruh warga yang rumahnya Ditempati/Dikontrak akan diset menjadi 'Belum Bayar'.")) {
            dataTagihan.forEach(warga => {
                // Rumah kosong gak usah ditagih di sini (sesuai aturan)
                if (warga.statusBayar !== "Kosong") {
                    warga.statusBayar = "Belum Bayar";
                    warga.periode = "Tagihan Baru Bulan Ini";
                }
            });
            render();
            alert("Mantap! Tagihan bulan ini berhasil disebarkan ke seluruh warga.");
        }
    }

    // Fungsi Konfirmasi Pembayaran Kas
    window.bayarTagihan = function(index) {
        if(confirm(`Konfirmasi pelunasan kas untuk ${dataTagihan[index].blok}?`)) {
            dataTagihan[index].statusBayar = "Lunas";
            dataTagihan[index].periode = "Lunas s/d Bulan Ini";
            render();
        }
    }

    function render() {
        listContainer.innerHTML = "";
        
        dataTagihan.forEach((item, index) => {
            let statusColor = item.statusBayar === 'Lunas' ? '#16a34a' : (item.statusBayar === 'Kosong' ? '#64748b' : '#dc2626');
            let statusBg = item.statusBayar === 'Lunas' ? '#dcfce7' : (item.statusBayar === 'Kosong' ? '#f1f5f9' : '#fef2f2');
            
            // 🔒 Tombol Bayar HANYA muncul kalau statusnya Belum Bayar & perannya Admin/Penagih
            let btnBayar = ``;
            if (item.statusBayar === 'Belum Bayar' && (currentRole === 'admin' || currentRole === 'penagih' || currentRole === 'bendahara')) {
                btnBayar = `<button onclick="bayarTagihan(${index})" style="padding: 8px 15px; background: #0f766e; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">💵 Bayar</button>`;
            } else {
                btnBayar = `<span style="font-size: 0.8rem; color: #64748b;">${item.periode}</span>`;
            }

            listContainer.innerHTML += `
                <div class="card" style="padding: 20px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 0;">
                    <div>
                        <h3 style="margin: 0 0 5px 0; color: #1e293b;">${item.blok}</h3>
                        <p style="margin: 0 0 8px 0; color: #64748b; font-size: 0.9rem;">${item.penghuni}</p>
                        <span style="background: ${statusBg}; color: ${statusColor}; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: bold;">${item.statusBayar}</span>
                    </div>
                    <div>
                        ${btnBayar}
                    </div>
                </div>
            `;
        });
    }

    render();
}
