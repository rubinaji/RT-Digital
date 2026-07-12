/*==================================================
   RT DIGITAL - MODUL PENAGIHAN (BENDAHARA SOP + WA)
==================================================*/

let dataTagihan = [
    { blok: "Blok A-01", penghuni: "Bpk. Budi Santoso", statusRumah: "Ditempati", saldoBulan: 0 },
    { blok: "Blok A-02", penghuni: "Belum ada penghuni", statusRumah: "Kosong", saldoBulan: 0 },
    { blok: "Blok A-03", penghuni: "Ibu Siti Aminah", statusRumah: "Dikontrak", saldoBulan: -3 }, 
    { blok: "Blok A-04", penghuni: "Bpk. Eko Prasetyo", statusRumah: "Ditempati", saldoBulan: 12 } 
];

function PenagihanPage() {
    setTimeout(loadPenagihanData, 50);

    return `
        <div id="penagihan-container" style="padding: 20px; animation: fadeIn 0.3s ease;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h2 style="margin: 0; color: #0f766e;">📋 Penagihan</h2>
                <div id="wadah-btn-generate"></div>
            </div>
            <p style="color: #64748b; font-size: 0.9rem; margin-top: 0; margin-bottom: 20px;">Kelola status pembayaran dan penagihan kas warga.</p>
            
            <div id="list-penagihan" style="display: grid; grid-template-columns: 1fr; gap: 15px;"></div>
        </div>
    `;
}

function loadPenagihanData() {
    const listContainer = document.getElementById("list-penagihan");
    const wadahBtnGen = document.getElementById("wadah-btn-generate");
    
    if (!listContainer) return;

    // 🔒 1. TOMBOL GENERATE TAGIHAN: Dibuka untuk Admin dan Bendahara
    if (currentRole === 'admin' || currentRole === 'bendahara') {
        wadahBtnGen.innerHTML = `<button onclick="generateTagihan()" style="padding: 8px 15px; background: #eab308; color: #1e293b; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">⚡ Buat Tagihan</button>`;
    } else {
        wadahBtnGen.innerHTML = ``;
    }

    window.generateTagihan = function() {
        if(confirm("Buat tagihan baru untuk bulan ini? (Saldo bulan setiap warga akan dikurangi 1 otomatis)")) {
            dataTagihan.forEach(warga => {
                if (warga.statusRumah !== "Kosong") {
                    warga.saldoBulan -= 1; 
                }
            });
            render();
            alert("Mantap! Tagihan bulan ini sudah disebarkan.");
        }
    }

    // Fungsi Pembayaran
    window.bayarTagihan = function(index) {
        let warga = dataTagihan[index];
        
        let infoStatus = "";
        if (warga.saldoBulan < 0) {
            infoStatus = `menunggak ${Math.abs(warga.saldoBulan)} bulan`;
        } else if (warga.saldoBulan > 0) {
            infoStatus = `memiliki deposit lunas ${warga.saldoBulan} bulan ke depan`;
        } else {
            infoStatus = `sudah lunas pas bulan ini`;
        }

        let bayarBerapa = prompt(`Bapak/Ibu ${warga.penghuni} (${warga.blok}) ${infoStatus}.\n\nMau bayar/deposit untuk berapa bulan? (Ketik angka saja)`, "1");
        
        if (bayarBerapa !== null && bayarBerapa !== "") {
            let jmlBayar = parseInt(bayarBerapa);
            
            if (isNaN(jmlBayar) || jmlBayar <= 0) {
                alert("Masukkan angka bulan yang valid ya, Bos!");
            } else {
                warga.saldoBulan += jmlBayar;
                
                // Fitur Cetak Bukti Otomatis setelah bayar
                if(confirm(`Berhasil! Pembayaran ${jmlBayar} bulan untuk ${warga.blok} berhasil dicatat.\n\nApakah Anda ingin mencetak bukti pembayaran (Struk PDF)?`)) {
                    cetakStruk(warga.blok, warga.penghuni, jmlBayar);
                }
                
                render();
            }
        }
    }

    // Fungsi Cetak Struk (Simulasi)
    window.cetakStruk = function(blok, nama, jumlahBulan) {
        alert(`🖨️ MENCETAK STRUK...\n\n-- BUKTI PEMBAYARAN KAS RT --\nBlok: ${blok}\nNama: ${nama}\nPembayaran: ${jumlahBulan} Bulan\nStatus: BERHASIL\n\n(Fitur PDF sungguhan bisa ditambahkan nanti)`);
    }

    // Fungsi Kirim WA Penagihan
    window.kirimWA = function(index) {
        let warga = dataTagihan[index];
        let jumlahNunggak = Math.abs(warga.saldoBulan);
        
        // Template pesan WA otomatis
        let pesan = `Halo Bapak/Ibu ${warga.penghuni} (${warga.blok}).\n\nIni dari Pengurus RT. Izin mengingatkan bahwa ada tagihan iuran kas RT yang belum terselesaikan sebanyak *${jumlahNunggak} Bulan*.\n\nMohon bantuannya untuk segera diselesaikan ya Bapak/Ibu. Terima kasih banyak! 🙏`;
        
        // Ubah teks jadi format URL (encode)
        let pesanURL = encodeURIComponent(pesan);
        
        // Buka WhatsApp di tab baru
        window.open(`https://wa.me/?text=${pesanURL}`, '_blank');
    }

    function render() {
        listContainer.innerHTML = "";
        
        dataTagihan.forEach((item, index) => {
            let statusBadge = ``;
            let btnAksi = ``;
            let borderStyle = ``;

            // 1. RUMAH KOSONG
            if (item.statusRumah === 'Kosong') {
                statusBadge = `<span style="background: #f1f5f9; color: #64748b; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: bold;">Rumah Kosong</span>`;
                btnAksi = `<span style="font-size: 0.8rem; color: #64748b;">- Tidak Ditagih -</span>`;
            } 
            // 2. DEPOSIT / POSITIF
            else if (item.saldoBulan > 0) {
                statusBadge = `<span style="background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: bold;">🌟 Lunas +${item.saldoBulan} Bln Ke Depan</span>`;
                borderStyle = `border-left: 4px solid #0284c7;`;
                
                if (currentRole === 'admin' || currentRole === 'penagih' || currentRole === 'bendahara') {
                    btnAksi = `
                        <div style="display: flex; gap: 5px;">
                            <button onclick="bayarTagihan(${index})" style="padding: 8px 12px; background: #0284c7; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">💵 Tambah</button>
                            <button onclick="cetakStruk('${item.blok}', '${item.penghuni}', 'Deposit')" style="padding: 8px 10px; background: #e2e8f0; color: #475569; border: none; border-radius: 8px; cursor: pointer;" title="Cetak Bukti">🖨️</button>
                        </div>
                    `;
                } else {
                    btnAksi = `<span style="font-size: 0.85rem; color: #0284c7; font-weight: bold;">Aman / Deposit</span>`;
                }
            }
            // 3. LUNAS PAS (NOL)
            else if (item.saldoBulan === 0) {
                statusBadge = `<span style="background: #dcfce7; color: #16a34a; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: bold;">Lunas</span>`;
                borderStyle = `border-left: 4px solid #16a34a;`;
                
                if (currentRole === 'admin' || currentRole === 'penagih' || currentRole === 'bendahara') {
                    btnAksi = `
                        <div style="display: flex; gap: 5px;">
                            <button onclick="bayarTagihan(${index})" style="padding: 8px 12px; background: #0f766e; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">💵 Bayar</button>
                            <button onclick="cetakStruk('${item.blok}', '${item.penghuni}', 'Lunas')" style="padding: 8px 10px; background: #e2e8f0; color: #475569; border: none; border-radius: 8px; cursor: pointer;" title="Cetak Bukti">🖨️</button>
                        </div>
                    `;
                } else {
                    btnAksi = `<span style="font-size: 0.85rem; color: #16a34a; font-weight: bold;">Lunas Bulan Ini</span>`;
                }
            } 
            // 4. NUNGGAK / MINUS
            else {
                let sisaTunggakan = Math.abs(item.saldoBulan);
                statusBadge = `<span style="background: #fef2f2; color: #dc2626; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: bold;">Nunggak ${sisaTunggakan} Bulan</span>`;
                borderStyle = `border-left: 4px solid #dc2626;`;
                
                if (currentRole === 'admin' || currentRole === 'penagih' || currentRole === 'bendahara') {
                    btnAksi = `
                        <div style="display: flex; gap: 5px;">
                            <button onclick="kirimWA(${index})" style="padding: 8px 10px; background: #22c55e; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;" title="Kirim WA">💬 WA</button>
                            <button onclick="bayarTagihan(${index})" style="padding: 8px 12px; background: #ef4444; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">💵 Bayar</button>
                        </div>
                    `;
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
