/*==================================================
   RT DIGITAL - GLOBAL STATE & ROLE MANAGER
==================================================*/

// Peran default saat aplikasi pertama kali dibuka
let currentRole = "admin";

// Fungsi untuk mengganti peran secara global
function changeRole(role) {
    currentRole = role;
    
    // Ambil halaman yang sedang aktif saat ini dari button nav yang menyala
    const activeNav = document.querySelector(".bottom-nav a[style*='opacity: 1']");
    
    if (activeNav) {
        // Render ulang halaman tersebut agar tampilannya menyesuaikan peran baru
        const page = activeNav.getAttribute("onclick").match(/'([^']+)'/)[1];
        navigate(page);
    } else {
        navigate("dashboard");
    }
}
