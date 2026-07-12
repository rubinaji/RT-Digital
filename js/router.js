/*==================================================
   RT DIGITAL - ROUTER ENGINE
==================================================*/

/**
 * Berfungsi untuk berpindah halaman/menu tanpa reload
 * @param {string} pageName - Nama halaman yang dituju (dashboard, rumah, keuangan, dll)
 */
function navigate(pageName) {
    // Ambil kontainer tempat konten modul halaman akan dirender
    const contentBody = document.getElementById("main-content");
    
    if (!contentBody) return;

    // Tampilkan pesan memuat sebentar agar transisinya halus
    contentBody.innerHTML = `
        <div style="text-align: center; margin-top: 50px; color: #64748b;">
            <p>Memuat halaman...</p>
        </div>
    `;

    // Deteksi modul halaman mana yang harus dipanggil
    switch (pageName) {
        case "dashboard":
            contentBody.innerHTML = typeof DashboardPage === "function" ? DashboardPage() : "<p style='padding: 20px;'>Modul Dashboard sedang disiapkan...</p>";
            break;
        case "rumah":
            contentBody.innerHTML = typeof RumahPage === "function" ? RumahPage() : "<p style='padding: 20px;'>Modul Data Rumah sedang disiapkan...</p>";
            break;
        case "keuangan":
            contentBody.innerHTML = typeof KeuanganPage === "function" ? KeuanganPage() : "<p style='padding: 20px;'>Modul Keuangan sedang disiapkan...</p>";
            break;
        case "penagihan":
            contentBody.innerHTML = typeof PenagihanPage === "function" ? PenagihanPage() : "<p style='padding: 20px;'>Modul Penagihan sedang disiapkan...</p>";
            break;
        case "profil":
            contentBody.innerHTML = typeof ProfilPage === "function" ? ProfilPage() : "<p style='padding: 20px;'>Modul Profil sedang disiapkan...</p>";
            break;
        default:
            contentBody.innerHTML = "<p style='padding: 20px;'>Halaman tidak ditemukan.</p>";
    }

    // Perbarui status tampilan tombol aktif di Bottom Nav
    updateActiveNav(pageName);
}

/**
 * Mengatur efek visual aktif pada menu navigasi bawah saat diklik
 * @param {string} pageName 
 */
function updateActiveNav(pageName) {
    const navLinks = document.querySelectorAll(".bottom-nav a");
    navLinks.forEach(link => {
        // Reset style dasar untuk semua menu
        link.style.opacity = "0.6";
        link.style.borderBottom = "none";
        link.style.paddingBottom = "4px";
        
        // Jika link tersebut mengarah ke halaman yang sedang aktif, beri sorotan
        if (link.getAttribute("onclick") && link.getAttribute("onclick").includes(pageName)) {
            link.style.opacity = "1";
            link.style.borderBottom = "3px solid #0f766e";
        }
    });
}

// Otomatis buka halaman dashboard saat aplikasi pertama kali diakses browser
document.addEventListener("DOMContentLoaded", () => {
    navigate("dashboard");
});
