/*==================================================
   RT DIGITAL - ROUTER ENGINE
==================================================*/

function navigate(pageName) {
    const contentBody = document.getElementById("main-content");
    if (!contentBody) return;

    // Simpan data halaman yang aktif untuk styling
    contentBody.dataset.activePage = pageName;

    contentBody.innerHTML = `
        <div style="text-align: center; margin-top: 50px; color: #64748b;">
            <p>Memuat halaman...</p>
        </div>
    `;

    // Deteksi modul halaman mana yang harus dipanggil
    switch (pageName) {
        case "dashboard":
            contentBody.innerHTML = typeof DashboardPage === "function" ? DashboardPage() : "<p>Modul disiapkan...</p>";
            break;
        case "rumah":
            contentBody.innerHTML = typeof RumahPage === "function" ? RumahPage() : "<p>Modul disiapkan...</p>";
            break;
        case "keuangan":
            contentBody.innerHTML = typeof KeuanganPage === "function" ? KeuanganPage() : "<p>Modul disiapkan...</p>";
            break;
        case "penagihan":
            contentBody.innerHTML = typeof PenagihanPage === "function" ? PenagihanPage() : "<p>Modul disiapkan...</p>";
            break;
        case "profil":
            contentBody.innerHTML = typeof ProfilPage === "function" ? ProfilPage() : "<p>Modul disiapkan...</p>";
            break;
        case "lainnya":
            contentBody.innerHTML = typeof LainnyaPage === "function" ? LainnyaPage() : "<p>Modul disiapkan...</p>";
            break;
        default:
            contentBody.innerHTML = "<p style='padding: 20px;'>Halaman tidak ditemukan.</p>";
    }

    updateActiveNav(pageName);
}

function updateActiveNav(pageName) {
    const navLinks = document.querySelectorAll(".bottom-nav a");
    navLinks.forEach(link => {
        link.style.opacity = "0.6";
        link.style.borderBottom = "none";
        link.style.paddingBottom = "4px";
        
        if (link.getAttribute("onclick") && link.getAttribute("onclick").includes(pageName)) {
            link.style.opacity = "1";
            link.style.borderBottom = "3px solid #0f766e";
        }
    });
}
