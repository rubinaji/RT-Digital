/*==================================================
   RT DIGITAL - MODUL PENAGIHAN KONEKSI DATABASES REAL
   (REVISI V10: PROTEKSI KETAT AKSES KOLEKTOR PANEL)
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

    // 🛡️ FILTER TAB BERDASARKAN ROLE: Penagih hanya diizinkan melihat Daftar Tunggakan
    let tabButtonsHTML = '';
    if (roleBersih === 'admin' || roleBersih === 'bendahara') {
        tabButtonsHTML = `
            <div style="display: flex; background: #f1f5f9; padding: 4px; border-radius: 10px; margin-bottom: 20px; gap: 5px;">
                <button id="tab-wa" onclick="setSubTabPenagihan('penagihan-wa')" style="flex: 1; padding: 8px; border: none; border-radius: 8px; font-size: 0.8rem; font-weight: bold; cursor: pointer;">📢 Daftar Tunggakan</button>
                <button id="tab-bayar" onclick="setSubTabPenagihan('pembayaran')" style="flex: 1; padding: 8px; border: none; border-radius: 8px; font-size: 0.8rem; font-weight: bold; cursor: pointer;">💰 Bayar Iuran</button>
                <button id="tab-atur" onclick="setSubTabPenagihan('atur-tagihan')" style="flex: 1; padding: 8px; border: none; border-radius: 8px; font-size: 0.8rem; font-weight: bold; cursor: pointer;">⚙️ Atur</button>
            </div>
        `;
    } else if (roleBersih === 'penagih') {
        tabButtonsHTML = `
            <div style="display: flex; background: #f1f5f9; padding: 4px; border-radius: 10px; margin-bottom: 20px; gap: 5px;">
                <button id="tab-wa" onclick="setSubTabPenagihan('penagihan-wa')" style="flex: 1; padding: 8px; border: none; border-radius: 8px; font-size: 0.8rem; font-weight: bold; cursor: pointer; background: white; color: #0f766e;">📢 Daftar Tunggakan Tagihan Warga</button>
            </div>
        `;
    }

    mainContent.innerHTML = `
        <div style="padding: 20px; animation: fadeIn 0.3s ease;">
            <div style="margin-bottom: 15px;">
                <h2 style="margin: 0; color: #0f766e;">📋 Penagihan & Iuran Bulanan</h2>
            </div>
            ${tabButtonsHTML}
            <div id="konten-sub-tab"></div>
        </div>
    `;

    let respon = await api("getRumah"); 
    if (respon.status === "success") {
        globalTagihan = respon.data;
        renderSubTabPenagihan();
    } else {
        document.getElementById("konten-sub-tab").innerHTML = `<div style="text-align:center; padding:20px; color:red;">❌ Gagal memuat data dari database.</div>`;
    }
}

window.setSubTabPenagihan = function(tabName) {
    let roleBersih = (currentRole || "").toLowerCase().trim();
    // Paksa Penagih agar tidak bisa berpindah tab secara ilegal
    if (roleBersih === 'penagih') {
        tabAktifPenagihan = "penagihan-wa";
    } else {
        tabAktifPenagihan = tabName;
    }
    renderSubTabPenagihan();
};

function renderSubTabPenagihan() {
    const wadah = document.getElementById("konten-sub-tab");
    if (!wadah) return;
    let roleBersih = (currentRole || "").toLowerCase().trim();

    if (roleBersih === 'penagih') {
        tabAktifPenagihan = "penagihan-wa";
    }

    const tWa = document.getElementById("tab-wa");
    const tBayar = document.getElementById("tab-bayar");
    const tAtur = document.getElementById("tab-atur");
    
    [tWa, tBayar, tAtur].forEach(b => { if(b) { b.style.background="transparent"; b.style.color="#64748b"; }});
    if(tabAktifPenagihan === "penagihan-wa" && tWa) { tWa.style.background="white"; tWa.style.color="#0f766e"; }
    if(tabAktifPenagihan === "pembayaran" && tBayar) { tBayar.style.background="white"; tBayar.style.color="#0f766e"; }
    if(tabAktifPenagihan === "atur-tagihan" && tAtur) { tAtur.style.background="white"; tAtur.style.color="#0f766e"; }

    // TAB 1: DAFTAR WARGA YANG PUNYA TUNGGAKAN (> 0 BULAN)
    if (tabAktifPenagihan === "penagihan-wa") {
        let wargaNunggak = globalTagihan.filter(w => parseInt(w.tunggakan) > 0);
        if (wargaNunggak.length === 0) {
            wadah.innerHTML = `<div style="text-align:center; padding:20px; color:#94a3b8;">🎉 Semua rumah warga bersih, tidak ada tunggakan!</div>`;
            return;
        }
        wadah.innerHTML = wargaNunggak.map(warga => {
            let kondisiClean = (warga.kondisi || "").toLowerCase().trim();
            let tarifBase = (kondisiClean === "ditempati" || kondisiClean === "dikontrak") ? 40000 : 25000;
            let totalUtang = tarifBase * parseInt(warga.tunggakan);

            return `
                <div class="card" style="padding:15px; background:white; border:1px solid #e2e8f0; border-radius:12px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <h4 style="margin:0; color:#1e293b;">Blok ${warga.blok} - ${warga.nama}</h4>
                        <div style="margin:4px 0; display:flex; gap:6px;">
                            <span style="background:#fef2f2; color:#dc2626; font-size:0.68rem; padding:2px 6px; border-radius:4px; font-weight:bold;">⚠️ Tunggakan: ${warga.tunggakan} Bulan</span>
                            <span style="background:#fff7ed; color:#c2410c; font-size:0.68rem; padding:2px 6px; border-radius:4px; font-weight:bold;">Total: Rp ${totalUtang.toLocaleString('id-ID')}</span>
                        </div>
                        <p style="margin:2px 0 0 0; font-size:0.75rem; color:#64748b;">Memo: ${warga.catatan || 'Tidak ada catatan'}</p>
                    </div>
                    <div style="display:flex; gap:5px;">
                        <button onclick="simpanMemoDatabase(${warga.id_row}, '${warga.catatan}')" style="padding:6px; background:#e2e8f0; border:none; border-radius:6px; cursor:pointer;">📝 Memo</button>
                        <a href="https://wa.me/${warga.wa}?text=Halo%20${encodeURIComponent(warga.nama)},%20mengingatkan%20iuran%20Blok%20${warga.blok}%20ada%20tunggakan%20${warga.tunggakan}%20Bulan,%20total%20Rp%20${totalUtang.toLocaleString('id-ID')}.%20Mohon%20konfirmasinya.%20Terima%20kasih." target="_blank" style="padding:6px 10px; background:#22c55e; color:white; border-radius:6px; text-decoration:none; font-size:0.8rem; font-weight:bold;">📢 Tagih</a>
                    </div>
                </div>
            `;
        }).join('');
    }

    // TAB 2: INPUT KAS BAYAR (HANYA UNTUK ADMIN & BENDAHARA)
    if (tabAktifPenagihan === "pembayaran") {
        wadah.innerHTML = `
            <div style="margin-bottom:12px;">
                <h4 style="margin:0 0 4px 0; color:#1e293b;">💰 Pencatatan & Pembayaran Fleksibel</h4>
                <p style="margin:0; color:#64748b; font-size:0.75rem;">Ketik jumlah bulan pembayaran secara bebas sesuai jumlah setoran tunai warga.</p>
            </div>
            ${globalTagihan.map((warga, idx) => {
                let kondisiClean = (warga.kondisi || "").toLowerCase().trim();
                let tarifBase = (kondisiClean === "ditempati" || kondisiClean === "dikontrak") ? 40000 : 25000;
                let infoStatus = warga.tunggakan > 0 ? `⚠️ Nunggak ${warga.tunggakan} Bulan` : `✅ Lunas / Aman`;

                return `
                    <div class="card" style="padding:15px; background:white; border:1px solid #e2e8f0; border-radius:12px; margin-bottom:10px; display:flex; flex-direction:column; gap:10px;">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <div>
                                <h4 style="margin:0; color:#1e293b; font-size:0.9rem;">Blok ${warga.blok} - ${warga.nama}</h4>
                                <small style="color:#64748b; font-size:0.75rem;">Tarif Dasar: Rp ${tarifBase.toLocaleString('id-ID')}/bln • <b>${infoStatus}</b></small>
                            </div>
                        </div>
                        
                        <div style="display:flex; align-items:center; gap:12px; background:#f8fafc; padding:10px; border-radius:8px; border:1px solid #e2e8f0;">
                            <div style="flex:1;">
                                <label style="font-size:0.68rem; color:#64748b; display:block; margin-bottom:3px; font-weight:bold;">JUMLAH BULAN YANG DIBAYAR:</label>
                                <input type="number" id="pilih-bulan-${idx}" value="${warga.tunggakan > 0 ? warga.tunggakan : 1}" min="1" max="24" oninput="updateEstimasiTotal(${idx})" style="width:100%; padding:6px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.85rem; font-weight:bold; color:#1e293b; outline:none;">
                            </div>
                            <div style="text-align:right;">
                                <span style="font-size:0.68rem; color:#64748b; display:block; font-weight:bold;">TOTAL KAS MASUK:</span>
                                <b id="total-bayar-${idx}" style="color:#16a34a; font-size:1.05rem; font-weight:800;">Rp ${(tarifBase * (warga.tunggakan > 0 ? warga.tunggakan : 1)).toLocaleString('id-ID')}</b>
                            </div>
                        </div>

                        <button onclick="prosesSetorIuranServerBanyakBulan('${warga.blok}', ${idx})" style="width:100%; padding:10px; background:#0f766e; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer; font-size:0.8rem;">
                            💰 Konfirmasi Terima Pembayaran
                        </button>
                    </div>
                `;
            }).join('')}
        `;
    }

    // TAB 3: ADMINISTRASI RESET PERIODE (HANYA UNTUK ADMIN & BENDAHARA)
    if (tabAktifPenagihan === "atur-tagihan") {
        wadah.innerHTML = `
            <div style="padding:20px; text-align:center; background:#f8fafc; border:2px dashed #cbd5e1; border-radius:12px;">
                <h3>🔄 Jalankan Tagihan Bulan Baru</h3>
                <p style="font-size:0.8rem; color:#64748b; margin-bottom:15px;">Klik tombol di bawah hanya jika sudah resmi berganti bulan. Sistem otomatis menambahkan akumulasi nunggak +1 bulan ke seluruh warga.</p>
                <button onclick="triggerGenerateTagihanMassal()" style="padding:10px 20px; background:#dc2626; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">🔄 Generate Tagihan Bulan Baru</button>
            </div>
        `;
    }
}

window.updateEstimasiTotal = function(idx) {
    let inputEl = document.getElementById(`pilih-bulan-${idx}`);
    let totalEl = document.getElementById(`total-bayar-${idx}`);
    if(!inputEl || !totalEl) return;
    
    let kondisiClean = (globalTagihan[idx].kondisi || "").toLowerCase().trim();
    let tarifBase = (kondisiClean === "ditempati" || kondisiClean === "dikontrak") ? 40000 : 25000;
    
    let bulan = parseInt(inputEl.value) || 1;
    if (bulan < 1) bulan = 1;
    let total = tarifBase * bulan;
    totalEl.innerText = "Rp " + total.toLocaleString('id-ID');
};

window.prosesSetorIuranServerBanyakBulan = async function(blok, idx) {
    let inputEl = document.getElementById(`pilih-bulan-${idx}`);
    if(!inputEl) return;
    let bulan = parseInt(inputEl.value) || 1;
    
    let kondisiClean = (globalTagihan[idx].kondisi || "").toLowerCase().trim();
    let tarifBase = (kondisiClean === "ditempati" || kondisiClean === "dikontrak") ? 40000 : 25000;
    let totalNominal = tarifBase * bulan;

    if(confirm(`Konfirmasi pembayaran Blok ${blok} sebanyak ${bulan} Bulan dengan total setoran tunai Rp ${totalNominal.toLocaleString('id-ID')}?`)) {
        let res = await api("konfirmasiPembayaran", { 
            blok: blok, 
            nominal: totalNominal, 
            bulan: bulan,
            petugas: myName || "Bendahara" 
        });
        if(res.status === "success") { 
            alert(`✅ Sukses! Data kas masuk dan pemotongan tunggakan berhasil disimpan.`); 
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
    if(res.status === "success") { alert("Memo tersimpan!"); penagihanPage(); }
};

window.triggerGenerateTagihanMassal = async function() {
    if(confirm("Apakah Anda yakin ingin memulai periode bulan baru? Semua warga akan bertambah 1 bulan tunggakan.")) {
        let res = await api("generateTagihan");
        if(res.status === "success") { alert("✅ " + res.message); penagihanPage(); }
    }
};
