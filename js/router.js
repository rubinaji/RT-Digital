/*==================================================
   RT DIGITAL - ROUTER ENGINE (UNIVERSAL & ASYNC)
==================================================*/

function navigate(pageName) {
    const contentBody = document.getElementById("main-content");
    if (!contentBody) return;

    // Simpan data halaman yang aktif untuk styling navigasi
    contentBody.dataset.activePage = pageName;

    contentBody.innerHTML = `
        <div style="text-align: center; margin-top: 50px; color: #64748b;">
            <p>Memuat halaman...</p>
        </div>
    `;

    // 🔎 PENGAMAN OTOMATIS: Mendeteksi fungsi versi camelCase (dashboardPage) atau PascalCase (DashboardPage)
    let namaFungsiCamel = pageName + "Page";
    let namaFungsiPascal = pageName.charAt(0).toUpperCase() + pageName.slice(1) + "Page";
    
    let targetFunction = window[namaFungsiCamel] || window[namaFungsiPascal];

    // Eksekusi Halaman jika modul fungsi ditemukan
    if (typeof targetFunction === "function") {
        const hasilRender = targetFunction();
        
        // Jika fungsi halaman mengembalikan teks HTML biasa (versi lama), cetak langsung
        if (typeof hasilRender === "string") {
            contentBody.innerHTML = hasilRender;
        }
        // Jika hasilnya Promise/tidak mengembalikan string (artinya dia mengubah DOM secara internal/async), 
        // biarkan fungsi tersebut yang mengontrol isi main-content secara mandiri.
    } else {
        // Tampilan cadangan jika file halaman benar-benar belum dibuat
        contentBody.innerHTML = `
            <div style="text-align: center; margin-top: 50px; color: #94a3b8;">
                <p>Modul halaman <b>${pageName}</b> sedang disiapkan...</p>
            </div>
        `;
    }

    updateActiveNav(pageName);
}

// FUNGSI UPDATE INDIKATOR MENU BAWAH (SINKRONISASI)
function updateActiveNav(pageName) {
    const navLinks = document.querySelectorAll(".bottom-nav a");
    if (!navLinks) return;

    navLinks.forEach(link => {
        // 1. Reset semua menu menjadi pudar (Abu-abu / Tidak Aktif)
        link.style.opacity = "0.5";
        link.style.color = "var(--text-muted, #64748b)";
        link.style.borderBottom = "none";
        
        // 2. Cari menu yang cocok persis dengan halaman yang sedang dibuka
        if (link.getAttribute("onclick") && link.getAttribute("onclick").includes(`Maps('${pageName}')`)) {
            // Beri warna menyala (Hijau / Aktif)
            link.style.opacity = "1";
            link.style.color = "var(--primary, #0f766e)";
            link.style.borderBottom = "3px solid var(--primary, #0f766e)";
        }
    });
}
