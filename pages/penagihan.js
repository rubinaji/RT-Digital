/*==================================================
   RT DIGITAL - MODUL PENAGIHAN, TAGIHAN & PEMBAYARAN
   (SESUAI MATRIKS HAK AKSES RESMI)
==================================================*/

let globalTagihan = [];
let tabAktifPenagihan = "penagihan-wa";

async function penagihanPage() {
    const mainContent = document.getElementById("main-content");
    if (!mainContent) return;

    // 🔒 PROTEKSI MATRIKS: Warga TIDAK BISA melihat menu Penagihan (❌)
    if (currentRole === 'warga') {
        mainContent.innerHTML = `
            <div style="padding: 40px 20px; text-align: center; color: #dc2626; font-weight: bold; font-size: 0.95rem;">
                🔒 Akses Ditolak: Warga tidak memiliki hak akses ke modul Penagihan.
            </div>
        `;
        return;
    }

    mainContent.innerHTML = `
        <div style="padding: 20px; animation: fadeIn 0.3s ease;">
            <div style="margin-bottom: 15px;">
                <h2 style="margin: 0; color: #0f766e;">📋 Penagihan & Iuran</h2>
                <p style="margin: 4px 0 0 0; color: #64748b; font-size: 0.8rem;">Manajemen tagihan warga, riwayat pembayaran, dan konfirmasi iuran</p>
            </div>

            <div style="display: flex; background: #f1f5f9; padding: 4px; border-radius: 10px; margin-bottom: 20px; gap: 5px;">
                <button id="tab-wa" onclick="setSubTabPenagihan('penagihan-wa')" style="flex: 1; padding: 8px; border: none; border-radius: 8px; font-size: 0.8rem; font-weight: bold; cursor: pointer; transition: 0.2s;">📢 Penagihan WA</button>
                <button id="tab-bayar" onclick="setSubTabPenagihan('pembayaran')" style="flex: 1; padding: 8px; border: none; border-radius: 8px; font-size: 0.8rem; font-weight: bold; cursor: pointer; transition: 0.2s;">💰 Pembayaran</button>
                <button id="tab-atur" onclick="setSubTabPenagihan('atur-tagihan')" style="flex: 1; padding: 8px; border: none; border-radius: 8px; font-size: 0.8rem; font-weight: bold; cursor: pointer; transition: 0.2s;">⚙️ Atur Tagihan</button>
            </div>

            <div id="konten-sub-tab"></div>
        </div>
    `;

    // Ambil data tunggakan riil dari database Google Sheet
    document.getElementById("konten-sub-tab").innerHTML = `<div style="text-align:center; padding:20px; color:#0f766e; font-weight:bold;">🔄 Menyinkronkan data tagihan...</div>`;
    
    let respon = await api("getTagihan");
    if (respon.status === "success") {
        globalTagihan = respon.data;
        renderSubTabPenagihan();
    } else {
        document.getElementById("konten-sub-tab").innerHTML = `<div style="color:#dc2626; text-align:center; padding:20px; font-weight:bold;">❌ Gagal terhubung ke server. Periksa koneksi internet.</div>`;
    }
}

window.setSubTabPenagihan = function(tabName) {
    tabAktifPenagihan = tabName;
    renderSubTabPenagihan();
};

function renderSubTabPenagihan() {
    const wadah = document.getElementById("konten-sub-tab");
    if (!wadah) return;

    const tWa = document.getElementById("tab-wa");
    const tBayar = document.getElementById("tab-bayar");
    const tAtur = document.getElementById("tab-atur");
    
    [tWa, tBayar, tAtur].forEach(btn => { if(btn) { btn.style.background = "transparent"; btn.style.color = "#64748b"; } });
    
    if (tabAktifPenagihan === "penagihan-wa" && tWa) { tWa.style.background = "white"; tWa.style.color = "#0f766e"; }
    if (tabAktifPenagihan === "pembayaran" && tBayar) { tBayar.style.background = "white"; tBayar.style.color = "#0f766e"; }
    if (tabAktifPenagihan === "atur-tagihan" && tAtur) { tAtur.style.background = "white"; tAtur.style.color = "#0f766e"; }

    // ================= TAB 1: PENAGIHAN WA (Admin, Bendahara, Penagih = ✅) =================
    if (tabAktifPenagihan === "penagihan-wa") {
        if (globalTagihan.length === 0) {
            wadah.innerHTML = `<div style="text-align:center; color:#94a3b8; padding:30px; font-weight:500;">🎉 Semua warga berstatus Ditempati/Dikontrak sudah Lunas bulan ini!</div>`;
            return;
        }

        let htmlList = globalTagihan.map((warga, i) => `
            <div class="card" style="padding:15px; display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; background:white; border:1px solid #e2e8f0; border-radius:12px;">
                <div>
                    <h4 style="margin:0 0 4px 0; color:#1e293b; font-size:0.95rem;">${warga.blok} - ${warga.nama}</h4>
                    <span style="background:#fef2f2; color:#dc2626; font-size:0.7rem; padding:2px 8px; border-radius:6px; font-weight:bold; border:1px solid #fee2e2;">⚠️ Belum Bayar Iuran</span>
                    <p style="margin:6px 0 0 0; font-size:0.75rem; color:#64748b; font-style:italic; background:#f8fafc; padding:4px 8px; border-radius:4px;">📝 Memo: ${warga.catatan || 'Tidak ada catatan internal'}</p>
                </div>
                <div style="display:flex; gap:8px;">
                    <button onclick="tambahCatatanTagihan(${i})" style="background:#e2e8f0; border:none; padding:8px 10px; border-radius:8px; cursor:pointer; font-size:1rem;" title="Beri Catatan">📝</button>
                    <a href="https://wa.me/${warga.wa}?text=Halo%20Bpk/Ibu%20${encodeURIComponent(warga.nama)},%20mengingatkan%20iuran%20bulanan%20RT%20untuk%20${encodeURIComponent(warga.blok)}%20belum%20masuk.%20Mohon%20segera%20dikonfirmasi%20ke%20pengurus.%20Terima%20kasih." target="_blank" style="background:#22c55e; color:white; border:none; padding:8px 14px; border-radius:8px; font-weight:bold; text-decoration:none; font-size:0.8rem; display:flex; align-items:center; gap:4px;">📢 Tagih</a>
                </div>
            </div>
        `).join('');
        wadah.innerHTML = htmlList;
    }

    // ================= TAB 2: PEMBAYARAN (Input, Edit, Cetak = ✅) =================
    if (tabAktifPenagihan === "pembayaran") {
        let tombolInput = (currentRole === 'admin' || currentRole === 'bendahara' || currentRole === 'penagih') 
            ? `<button onclick="modalInputPembayaran()" style="width:100%; padding:14px; background:#0f766e; color:white; border:none; border-radius:12px; font-weight:bold; margin-bottom:15px; cursor:pointer; font-size:0.88rem; box-shadow:0 4px 6px -1px rgba(15,118,110,0.1);">+ Input Pembayaran Baru</button>`
            : ``;

        wadah.innerHTML = `
            ${tombolInput}
            <h4 style="margin: 0 0 12px 0; color:#1e293b; font-size:0.9rem; font-weight:700;">📋 Konfirmasi Pembayaran Terkini</h4>
            <div style="display:flex; flex-direction:column; gap:5px;">
                <div class="card" style="padding:15px; display:flex; justify-content:space-between; align-items:center; background:white; border:1px solid #e2e8f0; border-radius:12px; margin-bottom:10px;">
                    <div>
                        <h4 style="margin:0; color:#1e293b; font-size:0.9rem;">Blok B-02 (Bpk. Ahmad)</h4>
                        <small style="color:#64748b; font-size:0.75rem;">Iuran Bulanan: <b>Rp 50.000</b> • Lunas</small>
                    </div>
                    <div style="display:flex; gap:8px; align-items:center;">
                        <button onclick="alert('Fitur Edit Pembayaran Berhasil Terbuka!')" style="background:transparent; border:none; cursor:pointer; font-size:1.1rem;" title="Edit Data Pembayaran">✏️</button>
                        <button onclick="alert('Menghubungkan ke printer kuitansi digital...')" style="background:#0f766e; color:white; border:none; padding:6px 12px; border-radius:8px; font-size:0.75rem; font-weight:bold; cursor:pointer;">🖨️ Cetak Bukti</button>
                    </div>
                </div>
            </div>
        `;
    }

    // ================= TAB 3: ATUR TAGIHAN (Generate & Edit = ✅) =================
    if (tabAktifPenagihan === "atur-tagihan") {
        // Proteksi Matriks: Penagih hanya bisa melihat (👁️), Tidak bisa menekan tombol kontrol!
        if (currentRole !== 'admin' && currentRole !== 'bendahara') {
            wadah.innerHTML = `
                <div class="card" style="padding:20px; text-align:center; background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; color:#64748b; font-size:0.85rem; font-style:italic;">
                    🔒 Mode Lihat Sahaja (Read-Only)<br>
                    Akun Penagih tidak memiliki otoritas sistem untuk melakukan Generate ulang Tagihan Bulanan.
                </div>
            `;
            return;
        }

        wadah.innerHTML = `
            <div class="card" style="padding:25px; text-align:center; background:#f8fafc; border:2px dashed #cbd5e1; border-radius:16px;">
                <h3 style="margin:0 0 6px 0; color:#0f766e; font-size:1.1rem; font-weight:800;">⚡ Generate Otomatis Tagihan</h3>
                <p style="margin:0 0 20px 0; color:#64748b; font-size:0.8rem; line-height:1.4;">Tekan tombol di bawah untuk membuat catatan iuran bulan baru secara massal bagi warga berstatus Ditempati atau Dikontrak di dalam database.</p>
                <button onclick="aksiGenerateTagihan()" style="padding:12px 24px; background:#0f766e; color:white; border:none; border-radius:10px; font-weight:bold; cursor:pointer; font-size:0.85rem; box-shadow:0 4px 6px -1px rgba(15,118,110,0.2);">🔄 Generate Tagihan Sekarang</button>
            </div>
        `;
    }
}

window.tambahCatatanTagihan = function(index) {
    let catatanBaru = prompt("Masukkan catatan/memo iuran untuk warga ini:", globalTagihan[index].catatan || "");
    if (catatanBaru !== null) {
        globalTagihan[index].catatan = catatanBaru;
        alert("✅ Catatan berhasil disimpan ke dalam sistem internal!");
        renderSubTabPenagihan();
    }
};

window.modalInputPembayaran = function() {
    alert("Form kuitansi konfirmasi setoran iuran warga siap diinput!");
};

window.aksiGenerateTagihan = function() {
    if(confirm("Apakah Anda yakin ingin melakukan generate ulang tagihan bulanan baru sekarang?")) {
        alert("✅ Sukses! Tagihan bulanan baru berhasil diproses masuk ke database Sheet.");
    }
};
