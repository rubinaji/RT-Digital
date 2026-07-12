async function keuanganPage() {
    const mainContent = document.getElementById("main-content");
    mainContent.innerHTML = `<div style="padding:20px;text-align:center;">🔄 Memuat Arus Kas...</div>`;

    let res = await api("getKeuangan");
    let htmlTransaksi = res.data.map(t => `
        <div style="background:white;padding:15px;border-radius:12px;margin-bottom:10px;display:flex;justify-content:space-between;border:1px solid #eee;">
            <div>
                <b style="display:block;font-size:0.9rem;">${t.ket}</b>
                <small style="color:#64748b;">${new Date(t.tgl).toLocaleDateString('id-ID')}</small>
            </div>
            <b style="color:${t.jenis === 'Masuk' ? '#16a34a' : '#dc2626'};">
                ${t.jenis === 'Masuk' ? '+' : '-'} Rp ${t.nominal.toLocaleString('id-ID')}
            </b>
        </div>
    `).join('');

    mainContent.innerHTML = `
        <div style="padding:20px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                <h2 style="margin:0;color:#0f766e;">💰 Kas Keuangan</h2>
                ${currentRole === 'admin' || currentRole === 'bendahara' ? 
                `<button onclick="tambahKas()" style="padding:8px 15px;background:#0f766e;color:white;border:none;border-radius:8px;font-weight:bold;">+ Transaksi</button>` : ''}
            </div>
            <div id="list-transaksi">${htmlTransaksi || '<p style="text-align:center;color:#94a3b8;">Belum ada transaksi.</p>'}</div>
        </div>
    `;
}

window.tambahKas = async function() {
    let ket = prompt("Keterangan Transaksi:");
    let nom = prompt("Nominal (Angka saja):");
    let tipe = confirm("Klik OK untuk PEMASUKAN, Cancel untuk PENGELUARAN") ? "Masuk" : "Keluar";

    if(ket && nom) {
        let res = await api("tambahTransaksi", { keterangan: ket, nominal: parseInt(nom), jenis: tipe, petugas: myName });
        if(res.status === "success") { alert("Berhasil dicatat!"); navigate("keuangan"); }
    }
}
