/*==================================================
   RT DIGITAL - MODUL PENAGIHAN BULANAN
==================================================*/

function PenagihanPage() {
    setTimeout(loadPenagihanData, 50);
    return `
        <div style="padding: 20px; animation: fadeIn 0.3s ease;">
            <div id="penagihan-header" style="margin-bottom: 20px;"></div>
            <div id="list-penagihan" style="display: flex; flex-direction: column; gap: 12px;"></div>
        </div>
    `;
}

function loadPenagihanData() {
    const header = document.getElementById("penagihan-header");
    const container = document.getElementById("list-penagihan");
    if (!container || !header) return;

    // Simulasi database iuran bulanan warga
    let statusIuranWarga = [
        { blok: "A-01", nama: "Bpk. Budi Santoso", status: "Lunas", detail: "Lunas s/d Juli 2026" },
        { blok: "A-02", nama: "Belum ada penghuni", status: "Kosong", detail: "-" },
        { blok: "A-03", nama: "Ibu Siti Aminah", status: "Belum Bayar", detail: "Nunggak 2 Bulan (Juni, Juli)" }
    ];

    container.innerHTML = "";

    // KONDISI 1: JIKA PERAN ADALAH WARGA
    if (currentRole === 'warga') {
        header.innerHTML = `
            <h2 style="margin: 0; color: #1e293b;">📋 Status Iuran Anda</h2>
            <p style="margin: 5px 0 0 0; color: #64748b; font-size: 0.9rem;">Berikut adalah riwayat pembayaran untuk rumah Anda.</p>
        `;
        // Warga disimulasikan menempati Blok A-01
        let dataSaya = statusIuranWarga.find(i => i.blok === "A-01") || statusIuranWarga[0];
        container.innerHTML = `
            <div class="card" style="border-left: 5px solid #16a34a; padding: 20px;">
                <h3 style="margin: 0 0 5px 0;">Blok ${dataSaya.blok}</h3>
                <p style="margin: 0 0 15px 0; color: #64748b;">Nama Penghuni: ${dataSaya.nama}</p>
                <div style="display: flex; justify-content: space-between; background: #f8fafc; padding: 12px; border-radius: 8px;">
                    <span style="font-weight: bold; color: #16a34a;">Status: ${dataSaya.status}</span>
                    <span style="color: #475569; font-weight: 600;">${dataSaya.detail}</span>
                </div>
            </div>
        `;
    } 
    // KONDISI 2: JIKA PERAN ADALAH PENAGIH
    else if (currentRole === 'penagih') {
        header.innerHTML = `
            <h2 style="margin: 0; color: #1e293b;">📋 Daftar Tunggakan Kas</h2>
            <p style="margin: 5px 0 0 0; color: #64748b; font-size: 0.9rem;">Hanya menampilkan data warga yang belum bayar iuran.</p>
        `;
        // Filter khusus status "Belum Bayar" saja
        let listTunggakan = statusIuranWarga.filter(i => i.status === "Belum Bayar");
        
        if (listTunggakan.length === 0) {
            container.innerHTML = `<p style="text-align:center; color:#94a3b8; margin-top:30px;">Luar biasa, semua warga sudah lunas!</p>`;
            return;
        }

        listTunggakan.forEach(warga => {
            container.innerHTML += `
                <div class="card" style="border-left: 5px solid #dc2626; padding: 15px; margin-bottom: 0;">
                    <h4 style="margin: 0; color: #0f172a;">Blok ${warga.blok} - ${warga.nama}</h4>
                    <p style="margin: 5px 0 0 0; font-size: 0.9rem; color: #dc2626; font-weight: bold;">⚠️ Belum Bayar: ${warga.detail}</p>
                </div>
            `;
        });
    } 
    // KONDISI 3: JIKA PERAN ADALAH ADMIN ATAU BENDAHARA
    else if (currentRole === 'admin' || currentRole === 'bendahara') {
        header.innerHTML = `
            <h2 style="margin: 0; color: #1e293b;">📋 Kelola Penagihan RT</h2>
            <p style="margin: 5px 0 0 0; color: #64748b; font-size: 0.9rem;">Akses penuh melihat semua status warga dan input data iuran.</p>
        `;

        statusIuranWarga.forEach(warga => {
            let isLunas = warga.status === 'Lunas';
            let badgeBg = isLunas ? '#dcfce7' : (warga.status === 'Kosong' ? '#f1f5f9' : '#fef2f2');
            let badgeColor = isLunas ? '#16a34a' : (warga.status === 'Kosong' ? '#64748b' : '#dc2626');
            
            // Tombol klik terima bayar hanya ada untuk yang belum lunas
            let aksiTombol = (!isLunas && warga.status !== 'Kosong')
                ? `<button onclick="terimaIuran('${warga.blok}')" style="background: #0f766e; color: white; border: none; padding: 6px 12px; border-radius: 8px; font-size: 0.8rem; cursor: pointer; font-weight: 600;">💵 Bayar</button>`
                : `<span style="font-size: 0.85rem; color: #64748b;">${warga.detail}</span>`;

            container.innerHTML += `
                <div class="card" style="display: flex; justify-content: space-between; align-items: center; padding: 15px; margin-bottom: 0;">
                    <div>
                        <h4 style="margin: 0; color: #0f172a;">Blok ${warga.blok}</h4>
                        <p style="margin: 2px 0 0 0; font-size: 0.85rem; color: #64748b;">${warga.nama}</p>
                        <span style="background: ${badgeBg}; color: ${badgeColor}; padding: 2px 8px; border-radius: 12px; font-size: 0.7rem; font-weight: bold; display: inline-block; margin-top: 5px;">${warga.status}</span>
                    </div>
                    <div>
                        ${aksiTombol}
                    </div>
                </div>
            `;
        });
    }
}

// Fungsi simulasi pencatatan iuran oleh Bendahara/Admin
window.terimaIuran = function(blok) {
    alert(`Sukses! Pembayaran kas untuk Blok ${blok} berhasil masuk ke sistem.`);
}
