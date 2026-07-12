/*==================================================
   RT DIGITAL - HALAMAN DATA RUMAH & WARGA
==================================================*/

// 1. Kita siapkan datanya dalam bentuk Array agar mudah dikelola
let dataRumah = [
    { blok: "A-01", nama: "Bpk. Budi Santoso", status: "Ditempati" },
    { blok: "A-02", nama: "Belum ada penghuni", status: "Kosong" },
    { blok: "A-03", nama: "Ibu Siti Aminah", status: "Dikontrak" }
];

function RumahPage() {
    // Beri jeda sedikit agar wadah HTML siap
    setTimeout(loadRumahData, 50);
    return `
        <div id="rumah-container" style="animation: fadeIn 0.3s ease; padding: 20px;">
            <div style="text-align: center; margin-top: 50px; color: #64748b;">
                <div class="spinner" style="margin: 0 auto 10px auto;"></div>
                <p>Memuat data warga...</p>
            </div>
        </div>
    `;
}

function loadRumahData() {
    const container = document.getElementById("rumah-container");
    if (!container) return;

    // 2. Buat kerangka UI utama (Header & Input Pencarian)
    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #0f766e; font-size: 1.5rem;">Data Rumah</h2>
            <button id="btn-tambah" class="btn-primary" style="padding: 8px 15px; font-size: 0.9rem;">+ Tambah</button>
        </div>
        <div style="margin-bottom: 20px;">
            <input type="text" id="input-cari" placeholder="Cari nama atau blok rumah..." style="width: 100%; padding: 12px 15px; border-radius: 10px; border: 1px solid #e2e8f0; outline: none; font-size: 1rem; box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);">
        </div>
        <div id="list-rumah" style="display: flex; flex-direction: column; gap: 12px;"></div>
    `;

    // 3. Tampilkan seluruh data saat halaman pertama kali dimuat
    renderListRumah(dataRumah);

    // 4. Fitur Pencarian (Real-time Filter)
    document.getElementById("input-cari").addEventListener("input", function(e) {
        const keyword = e.target.value.toLowerCase();
        // Saring data berdasarkan nama atau blok yang cocok
        const dataDisaring = dataRumah.filter(rumah => 
            rumah.nama.toLowerCase().includes(keyword) || 
            rumah.blok.toLowerCase().includes(keyword)
        );
        // Tampilkan ulang data yang sudah disaring
        renderListRumah(dataDisaring);
    });

    // 5. Fitur Tombol Tambah (Sementara pakai alert)
    document.getElementById("btn-tambah").addEventListener("click", function() {
        alert("Fitur form tambah data warga akan segera hadir!");
    });
}

// Fungsi khusus untuk menggambar daftar rumah ke layar
function renderListRumah(data) {
    const listContainer = document.getElementById("list-rumah");
    listContainer.innerHTML = ""; // Bersihkan layar sebelum menggambar ulang

    // Jika hasil pencarian tidak ditemukan
    if (data.length === 0) {
        listContainer.innerHTML = `<p style="text-align:center; color:#94a3b8; margin-top:20px;">Data tidak ditemukan.</p>`;
        return;
    }

    // Lakukan perulangan (looping) untuk setiap data rumah
    data.forEach(rumah => {
        // Logika untuk menentukan warna label status
        let badgeBg = rumah.status === 'Ditempati' ? '#dcfce7' : (rumah.status === 'Kosong' ? '#fef2f2' : '#fef08a');
        let badgeColor = rumah.status === 'Ditempati' ? '#16a34a' : (rumah.status === 'Kosong' ? '#dc2626' : '#a16207');

        listContainer.innerHTML += `
            <div style="background: white; padding: 15px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h4 style="margin: 0; color: #0f172a; font-size: 1.1rem;">Blok ${rumah.blok}</h4>
                    <p style="margin: 3px 0 0 0; font-size: 0.9rem; color: #64748b;">${rumah.nama}</p>
                </div>
                <span style="background: ${badgeBg}; color: ${badgeColor}; padding: 5px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: bold;">${rumah.status}</span>
            </div>
        `;
    });
}
