/*==================================================
   RT DIGITAL - MODUL PENAGIHAN KONEKSI DATABASES REAL
   (PERBAIKAN TOTAL V8: INTEGRASI TARIF & MULTI-MONTHS)
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
    } else {
        document.getElementById("konten-sub-tab").innerHTML = `<div style="text-align:center; padding:20px; color:red;">❌ Gagal memuat data dari database.</div>`;
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

    // TAB 1: LIST TUNGGAKAN & BROADCAST TELEPON WA
    if (tabAktifPenagihan === "penagihan-wa") {
        if (globalTagihan.length === 0) {
            wadah.innerHTML = `<div style="text-align:center; padding:20px; color:#94a3b8;">🎉 Semua rumah warga sudah lunas murni bulan ini!</div>`;
            return;
        }
        wadah.innerHTML = globalTagihan.map(warga => {
            let kondisiClean = (warga.kondisi || "").toLowerCase().trim();
            let isDitempati = (kondisiClean === "ditempati" || kondisiClean === "dikontrak");
            let tarifBase = isDitempati ? 40000 : 25000;
            let tipeLabel = isDitempati ? "🏡 Berpenghuni" : "🚪 Kosong/Tidak Ditempati";

            return `
                <div class="card" style="padding:15px; background:white; border:1px solid #e2e8f0; border-radius:12px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <h4 style="margin:0; color:#1e293b;">Blok ${warga.blok} - ${warga.nama}</h4>
                        <div style="margin:4px 0; display:flex; gap:6px; flex-wrap:wrap;">
                            <span style="background:#fef2f2; color:#dc2626; font-size:0.68rem; padding:2px 6px; border-radius:4px; font-weight:bold;">Tarif: Rp ${tarifBase.toLocaleString('id-ID')}</span>
                            <span style="background:#f1f5f9; color:#475569; font-size:0.68rem; padding:2px 6px; border-radius:4px; font-weight:500;">${tipeLabel}</span>
                        </div>
                        <p style="margin:4px 0 0 0; font-size:0.75rem; color:#64748b;">Memo: ${warga.catatan || 'Tidak ada catatan'}</p>
                    </div>
                    <div style="display:flex; gap:5px;">
                        <button onclick="simpanMemoDatabase(${warga.id_row}, '${warga.catatan}')" style="padding:6px; background:#e2e8f0; border:none; border-radius:6px; cursor:pointer;">📝 Memo</button>
                        <a href="https://wa.me/${warga.wa}?text=Halo%20${encodeURIComponent(warga.nama)},%20mohon%20konfirmasi%20iuran%20bulanan%20Blok%20${warga.blok}%20sebesar%20Rp%20${tarifBase.toLocaleString('id-ID')}." target="_blank" style="padding:6px 10px; background:#22c55e; color:white; border-radius:6px; text-decoration:none; font-size:0.8rem; font-weight:bold;">📢 Tagih</a>
                    </div>
                </div>
            `;
        }).join('');
    }

    // TAB 2: PROSES BAYAR IURAN DINAMIS & PILIHAN KALKULATOR 12 BULAN
    if (tabAktifPenagihan === "pembayaran") {
        if (globalTagihan.length === 0) {
            wadah.innerHTML = `<div style="text-align:center; padding:20px; color:#94a3b8;">🎉 Semua warga sudah lunas!</div>`;
            return;
        }

        wadah.innerHTML = `
            <div style="margin-bottom:12px;">
                <h4 style="margin:0 0 4px 0; color:#1e293b;">💰 Input Setoran & Konfirmasi Pembayaran</h4>
                <p style="margin:0; color:#64748b; font-size:0.75rem;">Sistem otomatis memisahkan tarif berpenghuni (40k) dan rumah kosong (25k).</p>
            </div>
            ${globalTagihan.map((warga, idx) => {
                let kondisiClean = (warga.kondisi || "").toLowerCase().trim();
                let isDitempati = (kondisiClean === "ditempati" || kondisiClean === "dikontrak");
                let tarifBase = isDitempati ? 40000 : 25000;
                let tipeLabel = isDitempati ? "Berpenghuni (40k/bln)" : "Kosong (25k/bln)";

                return `
                    <div class="card" style="padding:15px; background:white; border:1px solid #e2e8f0; border-radius:12px; margin-bottom:10px; display:flex; flex-direction:column; gap:10px;">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <div>
                                <h4 style="margin:0; color:#1e293b; font-size:0.9rem;">Blok ${warga.blok} - ${warga.nama}</h4>
                                <small style="color:#64748b; font-size:0.75rem;">Kondisi: <b style="color:#0f766e;">${tipeLabel}</b></small>
                            </div>
                        </div>
                        
                        <div style="display:flex; align-items:center; gap:12px; background:#f8fafc; padding:10px; border-radius:8px; border:1px solid #e2e8f0;">
                            <div style="flex:1;">
                                <label style="font-size:0.68rem; color:#64748b; display:block; margin-bottom:3px; font-weight:bold;">DURASI BULAN:</label>
                                <select id="pilih-bulan-${idx}" onchange="updateEstimasiTotal(${idx})" style="width:100%; padding:6px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.8rem; background:white; color:#1e293b; font-weight:600;">
                                    <option value="1">1 Bulan</option>
                                    <option value="2">2 Bulan</option>
                                    <option value="3">3 Bulan</option>
                                    <option value="6">6 Bulan (1/2 Tahun)</option>
                                    <option value="12">12 Bulan (1 Tahun Lunas)</option>
                                </select>
                            </div>
                            <div style="text-align:right;">
                                <span style="font-size:0.68rem; color:#64748b; display:block; font-weight:bold;">TOTAL SETORAN:</span>
                                <b id="total-bayar-${idx}" style="color:#16a34a; font-size:1rem; font-weight:800;">Rp ${tarifBase.toLocaleString('id-ID')}</b>
                            </div>
                        </div>

                        <button onclick="prosesSetorIuranServerBanyakBulan('${warga.blok}', ${idx})" style="width:100%; padding:10px; background:#0f766e; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer; font-size:0.8rem;">
                            💰 Konfirmasi & Simpan Setoran Murni
                        </button>
                    </div>
                `;
            }).join('')}
        `;
    }

    // TAB 3: ADMINISTRASI RESET PERIODE BULANAN
    if (tabAktifPenagihan === "atur-tagihan") {
        if(roleBersih !== 'admin' && roleBersih !== 'bendahara') {
            wadah.innerHTML = "🔒 Menu Khusus Admin / Bendahara.";
            return;
        }
        wadah.innerHTML = `
            <div style="padding:20px; text-align:center; background:#f8fafc; border:2px dashed #cbd5e1; border-radius:12px;">
                <h3>🔄 Perbarui Periode Baru</h3>
                <p>Klik tombol di bawah untuk me-reset status seluruh warga yang 'Lunas' kembali menjadi 'Belum Bayar' di awal bulan.</p>
                <button onclick="triggerGenerateTagihanMassal()" style="padding:10px 20px; background:#dc2626; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">🔄 Generate Tagihan Masal</button>
            </div>
        `;
    }
}

window.updateEstimasiTotal = function(idx) {
    let selectEl = document.getElementById(`pilih-bulan-${idx}`);
    let totalEl = document.getElementById(`total-bayar-${idx}`);
    if(!selectEl || !totalEl) return;
    
    let kondisiClean = (globalTagihan[idx].kondisi || "").toLowerCase().trim();
    let tarifBase = (kondisiClean === "ditempati" || kondisiClean === "dikontrak") ? 40000 : 25000;
    
    let bulan = parseInt(selectEl.value);
    let total = tarifBase * bulan;
    totalEl.innerText = "Rp " + total.toLocaleString('id-ID');
};

window.prosesSetorIuranServerBanyakBulan = async function(blok, idx) {
    let selectEl = document.getElementById(`pilih-bulan-${idx}`);
    if(!selectEl) return;
    let bulan = parseInt(selectEl.value);
    
    let kondisiClean = (globalTagihan[idx].kondisi || "").toLowerCase().trim();
    let tarifBase = (kondisiClean === "ditempati" || kondisiClean === "dikontrak") ? 40000 : 25000;
    let totalNominal = tarifBase * bulan;

    if(confirm(`Konfirmasi pelunasan Blok ${blok} (${globalTagihan[idx].kondisi}) sebanyak ${bulan} Bulan dengan total Rp ${totalNominal.toLocaleString('id-ID')}?`)) {
        let res = await api("konfirmasiPembayaran", { 
            blok: blok, 
            nominal: totalNominal, 
            bulan: bulan,
            petugas: myName || "Bendahara" 
        });
        if(res.status === "success") { 
            alert(`✅ Sukses! Pembayaran sebanyak ${bulan} Bulan berhasil masuk pembukuan.`); 
            penagihanPage(); 
        } else {
            alert("❌ Gagal: " + res.message);
        }
    }
};

window.simpanMemoDatabase = async function(idRow, oldCatatan) {
    let txt = prompt("Tulis Catatan Memo Warga Baru:", oldCatatan);
    if (txt === null) return;
    let res = await api("updateCatatan", { id_row: idRow, catatan: txt });
    if(res.status === "success") { alert("Memo tersimpan permanen di spreadsheet!"); penagihanPage(); }
};

window.triggerGenerateTagihanMassal = async function() {
    let konfirmasi = confirm("⚠️ PERINGATAN PENTING!\n\nAnda akan memulai PERIODE BULAN BARU.\n\nSemua warga yang sudah 'LUNAS' akan dikembalikan statusnya menjadi 'BELUM BAYAR'.\n\nApakah Anda yakin ingin melanjutkan?");
    
    if(konfirmasi) {
        document.getElementById("konten-sub-tab").innerHTML = `<div style="text-align:center; padding:30px; font-weight:bold; color:#0f766e;">🔄 Memproses periode baru... Mohon tunggu.</div>`;
        
        let res = await api("generateTagihan");
        if(res.status === "success") {
            alert("✅ " + res.message);
            penagihanPage(); 
        } else {
            alert("❌ Gagal: " + res.message);
            penagihanPage();
        }
    }
};
