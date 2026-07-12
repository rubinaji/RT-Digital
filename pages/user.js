/*==================================================
   RT DIGITAL - MODUL DATA USER
==================================================*/

let dataUser = [
    { nama: "Budi (Admin)", role: "admin", status: "Aktif" },
    { nama: "Siti (Bendahara)", role: "bendahara", status: "Aktif" },
    { nama: "Agus (Penagih)", role: "penagih", status: "Aktif" }
];

function UserPage() {
    if (currentRole !== 'admin') return `<div style="padding: 20px; text-align: center; color: #ef4444;">🚫 Akses Ditolak</div>`;
    
    setTimeout(renderUserList, 50);
    return `
        <div style="padding: 20px; animation: fadeIn 0.3s ease;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0; color: #0f766e;">👥 Data User</h2>
                <button onclick="alert('Fitur tambah user segera aktif!')" style="padding: 8px 15px; background: #0f766e; color: white; border: none; border-radius: 8px; cursor: pointer;">+ Tambah</button>
            </div>
            <p style="color: #64748b; font-size: 0.9rem; margin-top: -10px; margin-bottom: 20px;">Kelola hak akses pengurus dan warga.</p>
            
            <div id="list-user" style="display: flex; flex-direction: column; gap: 12px;"></div>
        </div>
    `;
}

function renderUserList() {
    const container = document.getElementById("list-user");
    if (!container) return;
    container.innerHTML = "";

    dataUser.forEach((user, index) => {
        let badgeColor = user.role === 'admin' ? '#dc2626' : (user.role === 'bendahara' ? '#eab308' : '#3b82f6');
        
        container.innerHTML += `
            <div class="card" style="display: flex; justify-content: space-between; align-items: center; padding: 15px; margin-bottom: 0;">
                <div>
                    <h4 style="margin: 0; color: #1e293b;">${user.nama}</h4>
                    <span style="background: ${badgeColor}20; color: ${badgeColor}; padding: 3px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: bold; display: inline-block; margin-top: 5px; text-transform: capitalize;">${user.role}</span>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button onclick="alert('Reset password ${user.nama}?')" style="background: transparent; border: none; font-size: 1.2rem; cursor: pointer;" title="Reset Password">🔑</button>
                    <button onclick="hapusUser(${index})" style="background: transparent; border: none; font-size: 1.2rem; cursor: pointer;" title="Hapus User">🗑️</button>
                </div>
            </div>
        `;
    });
}

window.hapusUser = function(index) {
    if(confirm("Yakin ingin menghapus user ini?")) {
        dataUser.splice(index, 1);
        renderUserList();
    }
}
