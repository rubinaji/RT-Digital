/*==================================================
   RT DIGITAL - MODUL KEUANGAN AKTIF CRUD UTUH
==================================================*/
let globalKasData = [];
let tabAktifKeuangan = "pemasukan";

async function keuanganPage() {
    const mainContent = document.getElementById("main-content");
    if (!mainContent) return;

    mainContent.innerHTML = `
        <div style="padding: 20px; animation: fadeIn 0.3s ease;">
            <div style="margin-bottom: 15px;">
                <h2 style="margin: 0; color: #0f766e;">💰 Keuangan Kas RT</h2>
                <p style="margin: 4px 0 0 0; color: #64748b; font-size: 0.8rem;">Manajemen Transparansi Arus Kas Masuk dan Keluar</p>
            </div>

            <div style="display: flex; background: #f1f5f9; padding: 4px; border-radius: 10px; margin-bottom: 20px; gap: 5px;">
                <button id="tab-masuk" onclick="setSubTabKeuangan('pemasukan')" style="flex: 1; padding: 8px; border: none; border-radius: 8px; font-size: 0.8rem; font-weight: bold; cursor: pointer;">📥 Pemasukan</button>
                <button id="tab-keluar" onclick="setSubTabKeuangan('pengeluaran')" style="flex: 1; padding: 8px; border: none; border-radius: 8px; font-size: 0.8rem; font-weight: bold; cursor: pointer;">📤 Pengeluaran</button>
                <button id="tab-laporan" onclick="setSubTabKeuangan('laporan')" style="flex: 1; padding: 8px; border: none; border-radius: 8px; font-size: 0.8rem; font-weight: bold; cursor: pointer;">📊 Laporan</button>
            </div>
            <div id="konten-sub-keuangan"></div>
        </div>
    `;

    let respon = await api("getKeuangan");
    if (respon.status === "success") {
        globalKasData = respon.data;
        renderSubTabKeuangan();
    }
}

window.setSubTabKeuangan = function(tabName) {
    tabAktifKeuangan = tabName;
    renderSubTabKeuangan();
};

function renderSubTabKeuangan() {
    const wadah = document.getElementById("konten-sub-keuangan");
    if (!wadah) return;
    let roleBersih = (currentRole || "").toLowerCase().trim();

    let totalMasuk = 0, totalKeluar = 0;
    globalKasData.forEach(item => {
        let nom = parseFloat(item.nominal) || 0;
        if (item.jenis.toLowerCase() === "pemasukan" || item.jenis.toLowerCase() === "masuk") totalMasuk += nom;
        else totalKeluar += nom;
    });

    if (tabAktifKeuangan === "pemasukan" || tabAktifKeuangan === "pengeluaran") {
        let targetJenis = tabAktifKeuangan === "pemasukan" ? "pemasukan" : "pengeluaran";
        let listData = globalKasData.filter(item => item.jenis.toLowerCase() === targetJenis || (targetJenis === "pemasukan" && item.jenis.toLowerCase() === "masuk") || (targetJenis === "pengeluaran" && item.jenis.toLowerCase() === "keluar"));

        let btnInput = (roleBersih === 'admin' || roleBersih === 'bendahara' || (targetJenis === 'pemasukan' && roleBersih === 'penagih'))
            ? `<button onclick="bukaFormKas('${targetJenis}')" style="width:100%; padding:12px; background:#0f766e; color:white; border:none; border-radius:10px; font-weight:bold; margin-bottom:15px; cursor:pointer;">+ Catat Buku Baru</button>`
            : '';

        wadah.innerHTML = btnInput + listData.map(item => `
            <div class="card" style="padding:15px; display:flex; justify-content:space-between; align-items:center; background:white; border:1px solid #e2e8f0; border-radius:12px; margin-bottom:8px;">
                <div>
                    <small style="color:#94a3b8;">${new Date(item.tgl).toLocaleDateString('id-ID')}</small>
                    <h4 style="margin:2px 0; color:#1e293b;">${item.ket}</h4>
                    <span style="font-size:0.7rem; color:#64748b;">Petugas: ${item.petugas}</span>
                </div>
                <div style="display:flex; align-items:center; gap:10px;">
                    <b style="color:${targetJenis === 'pemasukan' ? '#16a34a' : '#dc2626'}">Rp ${parseFloat(item.nominal).toLocaleString('id-ID')}</b>
                    ${(roleBersih === 'admin' || roleBersih === 'bendahara') ? `
                        <button onclick="aksiEditKas(${item.id_row}, '${item.ket}', ${item.nominal}, '${targetJenis}')" style="background:transparent; border:none; cursor:pointer;">✏️</button>
                        <button onclick="aksiHapusKas(${item.id_row})" style="background:transparent; border:none; cursor:pointer;">🗑️</button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    if (tabAktifKeuangan === "laporan") {
        wadah.innerHTML = `
            <div style="background:white; padding:20px; border-radius:14px; border:1px solid #e2e8f0;">
                <h3 style="margin:0 0 15px 0; color:#1e293b;">📊 Buku Neraca RT</h3>
                <p>Total Pemasukan: <b style="color:#16a34a;">Rp ${totalMasuk.toLocaleString('id-ID')}</b></p>
                <p>Total Pengeluaran: <b style="color:#dc2626;">Rp ${totalKeluar.toLocaleString('id-ID')}</b></p>
                <hr>
                <h3>Saldo Aktif: <span style="color:#0f766e;">Rp ${(totalMasuk - totalKeluar).toLocaleString('id-ID')}</span></h3>
            </div>
        `;
    }
}

window.bukaFormKas = async function(jenis) {
    let ket = prompt("Masukkan Uraian/Keterangan:");
    if (!ket) return;
    let nom = prompt("Masukkan Nominal Angka:");
    if (!nom || isNaN(nom)) return alert("Nominal harus angka murni!");
    let res = await api("tambahTransaksi", { keterangan: ket, jenis: jenis, nominal: nom, petugas: myName || "Pengurus" });
    if(res.status === "success") { alert("Berhasil disimpan!"); keuanganPage(); }
};

window.aksiEditKas = async function(idRow, oldKet, oldNom, jenis) {
    let ket = prompt("Ubah Uraian/Keterangan:", oldKet);
    if (!ket) return;
    let nom = prompt("Ubah Nominal Angka:", oldNom);
    if (!nom || isNaN(nom)) return;
    let res = await api("editTransaksi", { id_row: idRow, keterangan: ket, jenis: jenis, nominal: nom });
    if(res.status === "success") { alert("Berhasil diperbarui!"); keuanganPage(); }
};

window.aksiHapusKas = async function(idRow) {
    if(confirm("Hapus permanen transaksi kas ini?")) {
        let res = await api("hapusTransaksi", { id_row: idRow });
        if(res.status === "success") { alert("Berhasil dihapus!"); keuanganPage(); }
    }
};
