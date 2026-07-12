/*==================================================
   RT DIGITAL - MODUL PENAGIHAN KONEKSI DATABASES REAL
==================================================*/
let globalTagihan = [];
let tabAktifPenagihan = "penagihan-wa";

async function penagihanPage() {
    const mainContent = document.getElementById("main-content");
    if (!mainContent) return;
    let roleBersih = (currentRole || "").toLowerCase().trim();

    if (roleBersih === 'warga') {
        mainContent.innerHTML = `<div style="padding:30px; color:red; text-align:center;">🔒 Akses Ditolak untuk Warga.</div>`;
        return;
    }

    mainContent.innerHTML = `
        <div style="padding: 20px; animation: fadeIn 0.3s ease;">
            <div style="margin-bottom: 15px;">
                <h2 style="margin: 0; color: #0f766e;">📋 Penagihan & Iuran Bulanan</h2>
            </div>
            <div style="display: flex; background: #f1f5f9; padding: 4px; border-radius: 10px; margin-bottom: 20px; gap: 5px;">
                <button id="tab-wa" onclick="setSubTabPenagihan('penagihan-wa')" style="flex: 1; padding: 8px; border: none; border-radius: 8px; font-size: 0.8rem; font-weight: bold; cursor: pointer;">📢 Daftar Tunggakan</button>
                <button id="tab-bayar" onclick="setSubTabPenagihan('pembayaran')" style="flex: 1; padding: 8px; border: none; border-radius: 8px; font-size: 0.8rem; font-weight: bold; cursor: pointer;">💰 Bayar Iuran</button>
                <button id="tab-atur" onclick="setSubTabPenagihan('atur-tagihan')" style="flex: 1; padding: 8px; border: none; border-radius: 8px; font-size: 0.8rem; font-weight: bold; cursor: pointer;">⚙️ Atur</button>
            </div>
            <div id="konten-sub-tab"></div>
        </div>
    `;

    let respon = await api("getTagihan");
    if (respon.status === "success") {
        globalTagihan = respon.data;
        renderSubTabPenagihan();
    }
}

window.setSubTabPenagihan = function(tabName) {
    tabAktifPenagihan = tabName;
    renderSubTabPenagihan();
};

function renderSubTabPenagihan() {
    const wadah = document.getElementById("konten-sub-tab");
    if (!wadah) return;
    let roleBersih = (currentRole || "").toLowerCase().trim();

    const tWa = document.getElementById("tab-wa");
    const tBayar = document.getElementById("tab-bayar");
    const tAtur = document.getElementById("tab-atur");
    [tWa, tBayar, tAtur].forEach(b => { if(b) { b.style.background="transparent"; b.style.color="#64748b"; }});
    if(tabAktifPenagihan === "penagihan-wa" && tWa) { tWa.style.background="white"; tWa.style.color="#0f766e"; }
    if(tabAktifPenagihan === "pembayaran" && tBayar) { tBayar.style.background="white"; tBayar.style.color="#0f766e"; }
    if(tabAktifPenagihan === "atur-tagihan" && tAtur) { tAtur.style.background="white"; tAtur.style.color="#0f766e"; }

    if (tabAktifPenagihan === "penagihan-wa") {
        wadah.innerHTML = globalTagihan.map(warga => `
            <div class="card" style="padding:15px; background:white; border:1px solid #e2e8f0; border-radius:12px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <h4 style="margin:0;">Blok ${warga.blok} - ${warga.nama}</h4>
                    <p style="margin:4px 0; font-size:0.75rem; color:#64748b;">📝 Memo: ${warga.catatan || 'Tidak ada catatan'}</p>
                </div>
                <div style="display:flex; gap:5px;">
                    <button onclick="simpanMemoDatabase(${warga.id_row}, '${warga.catatan}')" style="padding:6px; background:#e2e8f0; border:none; border-radius:6px; cursor:pointer;">📝 Memo</button>
                    <a href="https://wa.me/${warga.wa}?text=Halo%20${encodeURIComponent(warga.nama)},%20mohon%20konfirmasi%20iuran%20bulanan%20Blok%20${warga.blok}." target="_blank" style="padding:6px 10px; background:#22c55e; color:white; border-radius:6px; text-decoration:none; font-size:0.8rem; font-weight:bold;">📢 Tagih</a>
                </div>
            </div>
        `).join('');
    }

    if (tabAktifPenagihan === "pembayaran") {
        wadah.innerHTML = `
            <h4 style="margin:0 0 10px 0;">💰 Input Konfirmasi Setoran Warga</h4>
            ${globalTagihan.map(warga => `
                <div class="card" style="padding:12px; background:white; border:1px solid #e2e8f0; border-radius:10px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
                    <span>Blok ${warga.blok} (${warga.nama})</span>
                    <button onclick="prosesSetorIuranServer('${warga.blok}')" style="padding:5px 12px; background:#0f766e; color:white; border:none; border-radius:6px; font-weight:bold; cursor:pointer; font-size:0.75rem;">💰 Lunasi</button>
                </div>
            `).join('')}
        `;
    }

    if (tabAktifPenagihan === "atur-tagihan") {
        if(roleBersih !== 'admin' && roleBersih !== 'bendahara') {
            wadah.innerHTML = "🔒 Menu Khusus Admin / Bendahara.";
            return;
        }
        wadah.innerHTML = `
            <div style="padding:20px; text-align:center; background:#f8fafc; border:2px dashed #cbd5e1; border-radius:12px;">
                <h3>🔄 Perbarui Periode Iuran</h3>
                <p>Klik tombol di bawah untuk me-reset status seluruh warga yang 'Lunas' kembali menjadi 'Belum Bayar' di awal bulan.</p>
                <button onclick="triggerGenerateTagihanMassal()" style="padding:10px 20px; background:#0f766e; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">🔄 Generate Tagihan Masal</button>
            </div>
        `;
    }
}

window.simpanMemoDatabase = async function(idRow, oldCatatan) {
    let txt = prompt("Tulis Catatan Memo Warga Baru:", oldCatatan);
    if (txt === null) return;
    let res = await api("updateCatatan", { id_row: idRow, catatan: txt });
    if(res.status === "success") { alert("Memo tersimpan permanen di spreadsheet!"); penagihanPage(); }
};

window.prosesSetorIuranServer = async function(blok) {
    let res = await api("konfirmasiPembayaran", { blok: blok, nominal: 50000, petugas: myName || "Bendahara" });
    if(res.status === "success") { alert("Pembayaran Berhasil! Otomatis tercatat di Kas Masuk."); penagihanPage(); }
};

window.triggerGenerateTagihanMassal = async function() {
    if(confirm("Generate tagihan bulan baru untuk seluruh warga?")) {
        let res = await api("generateTagihan");
        if(res.status === "success") { alert("Tagihan massal berhasil digenerate!"); penagihanPage(); }
    }
};
