/*==================================================
   RT DIGITAL - MODUL DATA USER
==================================================*/

let dataUser = [
    { nama: "Budi (Admin)", role: "admin", status: "Aktif" },
    { nama: "Siti (Bendahara)", role: "bendahara", status: "Aktif" },
    { nama: "Agus (Penagih)", role: "penagih", status: "Aktif" }
];

function UserPage() {
    // 🔒 GERBANG KEAMANAN: Halaman ini murni hanya untuk Admin
    if (currentRole !== 'admin') {
        return `
            <div style="padding: 20px; text-align: center; color: #ef4444; margin-top: 60px; animation: fadeIn 0.3s ease;">
                <span style="font-size: 3.5rem;">🚫</span>
                <h3 style="margin-top: 15px; color: #1e293b;">Akses Ditolak</h3>
                <p style="color: #64748b; font-size: 0.9rem; line-height: 1.5; padding: 0 10px;">
                    Halaman ini adalah pusat kendali user. Hanya Admin yang memiliki akses.
                </p>
            </div>
        `;
    }
    
    setTimeout(loadUserData, 50);
    return `
        <div id="user-container" style="padding: 20px; animation: fadeIn 0.3s ease;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0; color: #0f766e;">👥 Data User</h2>
                <div id="wadah-btn-user"></div>
            </div>
            <p style="color: #64748b; font-size: 0.9rem; margin-top: -10px; margin-bottom: 20px;">Kelola hak akses pengurus dan warga.</p>
            
            <div id="list-user" style="display: flex; flex-direction: column; gap: 12px;"></div>

            <div id="modal-user" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center; backdrop-filter: blur(2px);">
                <div style="background: white; padding: 25px; border-radius: 16px; width: 90%; max-width: 400px;">
                    <h3 style="margin-top: 0; margin-bottom: 20px;">Tambah User Baru</h3>
                    <input type="text" id="input-nama-user" placeholder="Nama Lengkap" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none;">
                    
                    <label style="font-size: 0.8rem; color: #64748b; display: block; margin-bottom: 5px;">Pilih Peran Akun:</label>
                    <select id="input-role-user" style="width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none; background: white;">
                        <option value="admin">Admin RT</option>
                        <option value="bendahara">Bendahara</option>
                        <option value="penagih">Penagih</option>
                        <option value="warga">Warga</option>
                    </select>

                    <label style="font-size: 0.8rem; color: #64748b; display: block; margin-bottom: 5px;">Status Akun:</label>
                    <select id="input-status-user" style="width: 100%; padding: 10px; margin-bottom: 20px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none; background: white;">
                        <option value="Aktif">Aktif</option>
                        <option value="Nonaktif">Nonaktif</option>
                    </select>

                    <div style="display: flex; justify-content: flex-end; gap: 10px;">
                        <button id="btn-batal-user" style="padding: 10px 15px; border: none; background: #e2e8f0; border-radius: 8px; cursor: pointer;">Batal</button>
                        <button id="btn-simpan-user" style="padding: 10px 15px; background: #0f766e; color: white; border: none; border-radius: 8px; cursor: pointer;">Simpan</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function loadUserData() {
    const listContainer = document.getElementById("list-user");
    const wadahBtn = document.getElementById("wadah-btn-user");
    const modal = document.getElementById("modal-user");

    if (!listContainer || !wadahBtn) return;

    // Tampilkan tombol tambah hanya jika kontainer siap
    wadahBtn.innerHTML = `<button id="btn-tambah-user" style="padding: 8px 15px; background: #0f766e; color: white; border: none; border-radius: 8px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1); font-weight: bold;">+ Tambah</button>`;
    
    // Pasang fungsi klik buka-tutup modal
    document.getElementById("btn-tambah-user").onclick = () => modal.style.display = "flex";
    document.getElementById("btn-batal-user").onclick = () => modal.style.display = "none";
    
    // Fungsi simpan user baru
    document.getElementById("btn-simpan-user").onclick = () => {
        const nama = document.getElementById("input-nama-user").value;
        const role = document.getElementById("input-role-user").value;
        const status = document.getElementById("input-status-user").value;

        if (!nama) return alert("Nama lengkap wajib diisi!");
        
        dataUser.push({ nama, role, status });
        render();
        modal.style.display = "none";
        
        // Bersihkan field nama setelah sukses input
        document.getElementById("input-nama-user").value = "";
    };

    function render() {
        listContainer.innerHTML = "";

        if (dataUser.length === 0) {
            listContainer.innerHTML = `<p style="text-align:center; color:#94a3b8;">Belum ada user terdaftar.</p>`;
            return;
        }

        dataUser.forEach((user, index) => {
            let badgeColor = user.role === 'admin' ? '#dc2626' : (user.role === 'bendahara' ? '#eab308' : (user.role === 'penagih' ? '#3b82f6' : '#64748b'));
            let statusColor = user.status === 'Aktif' ? '#16a34a' : '#ef4444';
            let statusBg = user.status === 'Aktif' ? '#dcfce7' : '#fef2f2';

            listContainer.innerHTML += `
                <div class="card" style="display: flex; justify-content: space-between; align-items: center; padding: 15px; margin-bottom: 0;">
                    <div>
                        <h4 style="margin: 0; color: #1e293b;">${user.nama}</h4>
                        <div style="display: flex; gap: 5px; align-items: center; margin-top: 5px;">
                            <span style="background: ${badgeColor}20; color: ${badgeColor}; padding: 2px 8px; border-radius: 12px; font-size: 0.7rem; font-weight: bold; text-transform: capitalize;">${user.role}</span>
                            <span style="background: ${statusBg}; color: ${statusColor}; padding: 2px 8px; border-radius: 12px; font-size: 0.7rem; font-weight: bold;">${user.status}</span>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <button onclick="alert('Reset password untuk ${user.nama} berhasil dilakukan!')" style="background: transparent; border: none; font-size: 1.2rem; cursor: pointer;" title="Reset Password">🔑</button>
                        <button onclick="hapusUser(${index})" style="background: transparent; border: none; font-size: 1.2rem; cursor: pointer; color: #ef4444;" title="Hapus User">🗑️</button>
                    </div>
                </div>
            `;
        });
    }

    // Fungsi Hapus User
    window.hapusUser = function(index) {
        if(confirm("Yakin ingin menghapus akses user ini?")) {
            dataUser.splice(index, 1);
            render();
        }
    }

    render();
}
