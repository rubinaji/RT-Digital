/*==================================================
   RT DIGITAL - MODUL KEUANGAN, KAS & LAPORAN BULANAN
   (SESUAI MATRIKS HAK AKSES RESMI)
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
                <p style="margin: 4px 0 0 0; color: #64748b; font-size: 0.8rem;">Catatan Pemasukan, Pengeluaran, dan Transparansi Laporan Kas</p>
            </div>

            <div style="display: flex; background: #f1f5f9; padding: 4px; border-radius: 10px; margin-bottom: 20px; gap: 5px;">
                <button id="tab-masuk" onclick="setSubTabKeuangan('pemasukan')" style="flex: 1; padding: 8px; border: none; border-radius: 8px; font-size: 0.8rem; font-weight: bold; cursor: pointer; transition: 0.2s;">📥 Pemasukan</button>
                <button id="tab-keluar" onclick="setSubTabKeuangan('pengeluaran')" style="flex: 1; padding: 8px; border: none; border-radius: 8px; font-size: 0.8rem; font-weight: bold; cursor: pointer; transition: 0.2s;">📤 Pengeluaran</button>
                <button id="tab-laporan" onclick="setSubTabKeuangan('laporan')" style="flex: 1; padding: 8px; border: none; border-radius: 8px; font-size: 0.8rem; font-weight: bold; cursor: pointer; transition: 0.2s;">📊 Laporan RT</button>
            </div>

            <div id="konten-sub-keuangan"></div>
        </div>
    `;

    // Ambil data kas riil dari database Google Sheet
    document.getElementById("konten-sub-keuangan").innerHTML = `<div style="text-align:center; padding:20px; color:#0f766e; font-weight:bold;">🔄 Sinkronisasi arus kas server...</div>`;
    
    let respon = await api("getKeuangan");
    if (respon.status === "success") {
        globalKasData = respon.data;
        renderSubTabKeuangan();
    } else {
        document.getElementById("konten-sub-keuangan").innerHTML = `<div style="color:#dc2626; text-align:center; padding:20px; font-weight:bold;">❌ Gagal terhubung ke server database keuangan.</div>`;
    }
}

window.setSubTabKeuangan = function(tabName) {
    tabAktifKeuangan = tabName;
    renderSubTabKeuangan();
};

function renderSubTabKeuangan() {
    const wadah = document.getElementById("konten-sub-keuangan");
    if (!wadah) return;

    const btnMasuk = document.getElementById("tab-masuk");
    const btnKeluar = document.getElementById("tab-keluar");
    const btnLaporan = document.getElementById("tab-laporan");
    
    [btnMasuk, btnKeluar, btnLaporan].forEach(btn => { if(btn) { btn.style.background = "transparent"; btn.style.color = "#64748b"; } });
    
    if (tabAktifKeuangan === "pemasukan" && btnMasuk) { btnMasuk.style.background = "white"; btnMasuk.style.color = "#0f766e"; }
    if (tabAktifKeuangan === "pengeluaran" && btnKeluar) { btnKeluar.style.background = "white"; btnKeluar.style.color = "#0f766e"; }
    if (tabAktifKeuangan === "laporan" && btnLaporan) { btnLaporan.style.background = "white"; btnLaporan.style.color = "#0f766e"; }

    // Hitung Ringkasan Kas
    let totalMasuk = 0;
    let totalKeluar = 0;
    globalKasData.forEach(item => {
        let nom = parseFloat(item.nominal) || 0;
        if (item.jenis.toLowerCase() === "pemasukan" || item.jenis.toLowerCase() === "masuk") {
            totalMasuk += nom;
        } else {
            totalKeluar += nom;
        }
    });
    let saldoAkhir = totalMasuk - totalKeluar;

    // ================= SUB TAB 1: PEMASUKAN & PEMBAYARAN IURAN =================
    if (tabAktifKeuangan === "pemasukan") {
        // Hak Input: Admin, Bendahara, Penagih = ✅ | Warga = 👁️ (Sembunyikan tombol)
        let tombolAksi = (currentRole === 'admin' || currentRole === 'bendahara' || currentRole === 'penagih')
            ? `<button onclick="bukaModalTransaksi('Pemasukan')" style="width:100%; padding:14px; background:#0f766e; color:white; border:none; border-radius:12px; font-weight:bold; margin-bottom:15px; cursor:pointer; font-size:0.88rem;">+ Catat Pembayaran/Pemasukan</button>`
            : `<div style="background:#f0fdf4; color:#16a34a; padding:10px 15px; border-radius:10px; font-size:0.75rem; font-weight:bold; margin-bottom:15px; border:1px solid #bbf7d0;">👁️ Mode Lihat: Anda melihat transparansi catatan iuran masuk RT.</div>`;

        let listMasuk = globalKasData.filter(item => item.jenis.toLowerCase() === "pemasukan" || item.jenis.toLowerCase() === "masuk");

        let htmlList = listMasuk.length === 0 
            ? `<div style="text-align:center; color:#94a3b8; padding:20px; font-size:0.85rem;">Belum ada data pemasukan kas masuk.</div>`
            : listMasuk.map(item => {
                let tgl = item.tgl ? new Date(item.tgl).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-';
                return `
                    <div class="card" style="padding:14px; display:flex; justify-content:space-between; align-items:center; background:white; border:1px solid #e2e8f0; border-radius:12px; margin-bottom:8px;">
                        <div>
                            <span style="font-size:0.7rem; color:#94a3b8; font-weight:bold;">📅 ${tgl}</span>
                            <h4 style="margin:2px 0 0 0; color:#1e293b; font-size:0.9rem;">${item.ket}</h4>
                        </div>
                        <b style="color:#16a34a; font-size:0.95rem;">+Rp ${parseFloat(item.nominal).toLocaleString('id-ID')}</b>
                    </div>
                `;
            }).join('');

        wadah.innerHTML = `${tombolAksi} ${htmlList}`;
    }

    // ================= SUB TAB 2: PENGUELUARAN KAS RT =================
    if (tabAktifKeuangan === "pengeluaran") {
        // Proteksi Matriks: Penagih TIDAK BISA melihat/akses menu Pengeluaran sama sekali (❌)
        if (currentRole === 'penagih') {
            wadah.innerHTML = `<div style="text-align:center; color:#dc2626; font-weight:bold; padding:30px; font-size:0.85rem;">🔒 Akses Ditolak: Penagih tidak memiliki izin melihat kas keluar.</div>`;
            return;
        }

        // Hak Input: Admin, Bendahara = ✅ | Warga = 👁️ (Hanya bisa memantau pengeluaran)
        let tombolAksi = (currentRole === 'admin' || currentRole === 'bendahara')
            ? `<button onclick="bukaModalTransaksi('Pengeluaran')" style="width:100%; padding:14px; background:#dc2626; color:white; border:none; border-radius:12px; font-weight:bold; margin-bottom:15px; cursor:pointer; font-size:0.88rem;">+ Catat Pengeluaran RT</button>`
            : `<div style="background:#fef2f2; color:#dc2626; padding:10px 15px; border-radius:10px; font-size:0.75rem; font-weight:bold; margin-bottom:15px; border:1px solid #fee2e2;">👁️ Transparansi Publik: Daftar dana keluar yang dikeluarkan pengurus RT.</div>`;

        let listKeluar = globalKasData.filter(item => item.jenis.toLowerCase() === "pengeluaran" || item.jenis.toLowerCase() === "keluar");

        let htmlList = listKeluar.length === 0 
            ? `<div style="text-align:center; color:#94a3b8; padding:20px; font-size:0.85rem;">Belum ada catatan pengeluaran kas keluar.</div>`
            : listKeluar.map(item => {
                let tgl = item.tgl ? new Date(item.tgl).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-';
                return `
                    <div class="card" style="padding:14px; display:flex; justify-content:space-between; align-items:center; background:white; border:1px solid #e2e8f0; border-radius:12px; margin-bottom:8px;">
                        <div>
                            <span style="font-size:0.7rem; color:#94a3b8; font-weight:bold;">📅 ${tgl}</span>
                            <h4 style="margin:2px 0 0 0; color:#1e293b; font-size:0.9rem;">${item.ket}</h4>
                        </div>
                        <b style="color:#dc2626; font-size:0.95rem;">-Rp ${parseFloat(item.nominal).toLocaleString('id-ID')}</b>
                    </div>
                `;
            }).join('');

        wadah.innerHTML = `${tombolAksi} ${htmlList}`;
    }

    // ================= SUB TAB 3: LAPORAN RT (Penuh vs Ringkasan) =================
    if (tabAktifKeuangan === "laporan") {
        // Format Tampilan Neraca Laporan
        let ringkasanHTML = `
            <div style="background:white; border:1px solid #e2e8f0; border-radius:16px; padding:20px; box-shadow:0 4px 6px -1px rgba(0,0,0,0.01);">
                <h4 style="margin:0 0 15px 0; color:#1e293b; font-size:0.95rem; font-weight:800; text-transform:uppercase;">📊 Ringkasan Neraca Kas</h4>
                
                <div style="display:flex; justify-content:between; align-items:center; margin-bottom:10px; font-size:0.85rem;">
                    <span style="color:#64748b; flex:1;">Total Pemasukan Murni</span>
                    <b style="color:#16a34a;">Rp ${totalMasuk.toLocaleString('id-ID')}</b>
                </div>
                <div style="display:flex; justify-content:between; align-items:center; margin-bottom:15px; font-size:0.85rem;">
                    <span style="color:#64748b; flex:1;">Total Pengeluaran Buku</span>
                    <b style="color:#dc2626;">Rp ${totalKeluar.toLocaleString('id-ID')}</b>
                </div>
                <hr style="border:none; border-top:1px dashed #cbd5e1; margin-bottom:15px;">
                <div style="display:flex; justify-content:between; align-items:center;">
                    <span style="color:#1e293b; font-weight:bold; font-size:0.9rem; flex:1;">Kas Bersih (Saldo Akhir)</span>
                    <b style="color:#0f766e; font-size:1.1rem; font-weight:800;">Rp ${saldoAkhir.toLocaleString('id-ID')}</b>
                </div>
            </div>
        `;

        // Filter isi khusus sesuai matriks: Warga & Penagih = 👁️ Ringkasan | Admin & Bendahara = ✅ Detail Buku Besar
        if (currentRole === 'admin' || currentRole === 'bendahara') {
            wadah.innerHTML = `
                ${ringkasanHTML}
                <h4 style="margin:20px 0 10px 0; color:#1e293b; font-size:0.9rem; font-weight:700;">📜 Audit Buku Besar (Admin & Bendahara View)</h4>
                <div style="overflow-x:auto; background:white; border:1px solid #e2e8f0; border-radius:12px;">
                    <table style="width:100%; border-collapse:collapse; text-align:left; font-size:0.8rem;">
                        <tr style="background:#f8fafc; border-bottom:1px solid #e2e8f0; font-weight:bold; color:#475569;">
                            <th style="padding:10px;">Memo Transaksi</th>
                            <th style="padding:10px; text-align:right;">Nominal</th>
                        </tr>
                        ${globalKasData.map(item => `
                            <tr style="border-bottom:1px solid #f1f5f9; color:#1e293b;">
                                <td style="padding:10px;"><b>${item.ket}</b><br><small style="color:#94a3b8;">${item.jenis.toUpperCase()}</small></td>
                                <td style="padding:10px; text-align:right; font-weight:bold; color:${item.jenis.toLowerCase() === 'pemasukan' || item.jenis.toLowerCase() === 'masuk' ? '#16a34a' : '#dc2626'}">
                                    ${item.jenis.toLowerCase() === 'pemasukan' || item.jenis.toLowerCase() === 'masuk' ? '+' : '-'}Rp ${parseFloat(item.nominal).toLocaleString('id-ID')}
                                </td>
                            </tr>
                        `).join('')}
                    </table>
                </div>
            `;
        } else {
            // Tampilan untuk Warga / Penagih (Hanya ringkasan infografis kas murni)
            wadah.innerHTML = `
                ${ringkasanHTML}
                <div style="margin-top:15px; padding:15px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; text-align:center; color:#64748b; font-size:0.78rem; font-style:italic;">
                    📢 Informasi transparansi iuran kas ini dikelola secara akuntabel oleh Pengurus RT Digital.
                </div>
            `;
        }
    }
}

// Jendela Input Cepat Kas Langsung Tembus Database Google Sheet
window.bukaModalTransaksi = async function(jenis) {
    let ket = prompt(`Masukkan Keterangan/Uraian ${jenis}:`);
    if (!ket) return;
    let nom = prompt(`Masukkan Nominal Uang (Hanya Angka):`);
    if (!nom || isNaN(nom)) return alert("Nominal wajib berupa angka murni!");

    let konfirmasi = confirm(`Simpan transaksi ${jenis}: \n"${ket}" senilai Rp ${parseInt(nom).toLocaleString('id-ID')} ke database?`);
    if (!konfirmasi) return;

    // Kirim data langsung ke Apps Script
    let res = await api("tambahTransaksi", {
        keterangan: ket,
        jenis: jenis.toLowerCase(),
        nominal: parseInt(nom),
        petugas: myName || currentRole
    });

    if (res.status === "success") {
        alert(`Berhasil mencatatkan data ${jenis} baru ke spreadsheet kas!`);
        keuanganPage(); // Refresh halaman otomatis
    } else {
        alert("Gagal menyimpan transaksi kas: " + res.message);
    }
};
