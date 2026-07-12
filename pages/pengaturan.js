/*==================================================
   RT DIGITAL - MODUL UTUH PENGATURAN & MANAGEMENT USER
==================================================*/
async function pengaturanPage() {
    const mainContent = document.getElementById("main-content");
    if (!mainContent) return;
    let roleBersih = (currentRole || "").toLowerCase().trim();

    if (roleBersih !== 'admin') {
        mainContent.innerHTML = `<div style="padding:30px; color:red; text-align:center;">🔒 Akses Ditolak. Menu Pengaturan Sistem & User Manager Khusus Ketua RT (Admin).</div>`;
        return;
    }

    mainContent.innerHTML = `
        <div style="padding: 20px; animation: fadeIn 0.3s ease;">
            <div style="margin-bottom: 20px;">
                <h2 style="margin: 0; color: #0f766e;">⚙️ Pengaturan Sistem & Otoritas</h2>
            </div>

            <div class="card" style="padding:20px; background:white; border:1px solid #e2e8f0; border-radius:14px; margin-bottom:20px;">
                <h3 style="margin:0 0 5px 0;">💵 Konfigurasi Nominal Tarif Iuran</h3>
                <p style="font-size:0.8rem; color:#64748b; margin-bottom:12px;">Ubah besaran dasar tarif iuran bulanan warga RT.</p>
                <div style="display:flex; gap:10px;">
                    <input type="number" id="cfg-nominal-iuran" placeholder="Contoh: 50000" style="flex:1; padding:10px; border:1px solid #cbd5e1; border-radius:8px;">
                    <button onclick="simpanNominalIuran()" style="padding:10px 20px; background:#0f766e; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">Simpan</button>
                </div>
            </div>

            <div class="card" style="padding:20px; background:white; border:1px solid #e2e8f0; border-radius:14px; margin-bottom:20px;">
                <h3 style="margin:0 0 5px 0;">📢 Siarkan Berita / Pengumuman RT</h3>
                <p style="font-size:0.8rem; color:#64748b; margin-bottom:12px;">Tulis pengumuman resmi yang akan tayang real-time di HP warga.</p>
                <input type="text" id="news-judul" placeholder="Judul Pengumuman" style="width:100%; padding:10px; margin-bottom:8px; border:1px solid #cbd5e1; border-radius:8px;">
                <textarea id="news-isi" placeholder="Tulis isi informasi lengkap di sini..." style="width:100%; padding:10px; height:80px; margin-bottom:10px; border:1px solid #cbd5e1; border-radius:8px;"></textarea>
                <button onclick="kirimBeritaPengumuman()" style="width:100%; padding:10px; background:#0f766e; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">📢 Siarkan Pengumuman Sekarang</button>
            </div>

            <div class="card" style="padding:20px; background:white; border:1px solid #e2e8f0; border-radius:14px;">
                <h3 style="margin:0 0 10px 0;">👥 Akun Otoritas Pengurus & Kredensial</h3>
                <button onclick="bukaFormUserBaru()" style="width:100%; padding:10px; background:#475569; color:white; border:none; border-radius:8px; font-weight:bold; margin-bottom:15px; cursor:pointer;">+ Daftarkan Pengurus/User Baru</button>
                <div id="list-user-manager"></div>
            </div>
        </div>
    `;

    loadUserManagerList();
}

window.simpanNominalIuran = async function() {
    let val = document.getElementById("cfg-nominal-iuran").value;
    if(!val) return alert("Nominal tidak boleh kosong!");
    let res = await api("updateNominal", { nominal: val });
    if(res.status === "success") alert("Tarif nominal iuran berhasil diperbarui di database!");
};

window.kirimBeritaPengumuman = async function() {
    let jdl = document.getElementById("news-judul").value;
    let txt = document.getElementById("news-isi").value;
    if(!jdl || !txt) return alert("Judul dan isi pengumuman wajib diisi!");
    let res = await api("tambahPengumuman", { judul: jdl, isi: txt });
    if(res.status === "success") {
        alert("Pengumuman berhasil disiarkan massal!");
        document.getElementById("news-judul").value = "";
        document.getElementById("news-isi").value = "";
    }
};

async function loadUserManagerList() {
    const container = document.getElementById("list-user-manager");
    if(!container) return;
    let res = await api("getUsers");
    if(res.status === "success") {
        container.innerHTML = res.data.map(user => `
            <div style="padding:10px; border-bottom:1px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <strong>${user.name}</strong> (${user.username})<br>
                    <small style="color:#64748b;">Role: ${user.role.toUpperCase()} ${user.blok ? '• Blok: '+user.blok : ''}</small>
                </div>
                <button onclick="hapusUserAkun(${user.id_row})" style="background:transparent; border:none; color:red; cursor:pointer; font-size:1.1rem;">🗑️</button>
            </div>
        `).join('');
    }
}

window.bukaFormUserBaru = async function() {
    let user = prompt("Masukkan Username:");
    if(!user) return;
    let pass = prompt("Masukkan Password:");
    if(!pass) return;
    let role = prompt("Masukkan Jabatan (admin/bendahara/penagih/warga):");
    if(!role) return;
    let nama = prompt("Masukkan Nama Lengkap:");
    if(!nama) return;
    let blk = prompt("Masukkan Nomor Blok (Kosongkan jika bukan warga):");

    let res = await api("tambahUser", { username: user, password: pass, role: role.toLowerCase().trim(), name: nama, blok: blk });
    if(res.status === "success") { alert("User baru terdaftar!"); loadUserManagerList(); }
};

window.hapusUserAkun = async function(idRow) {
    if(confirm("Hapus akun pengurus ini?")) {
        let res = await api("hapusUser", { id_row: idRow });
        if(res.status === "success") { alert("Akun berhasil dihapus!"); loadUserManagerList(); }
    }
};
