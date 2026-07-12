/*==================================================
   RT DIGITAL - GLOBAL STATE & ROLE MANAGER
==================================================*/

let currentRole = "admin";

// Fungsi untuk menggambar ulang Navigasi Bawah sesuai peran
function renderBottomNav() {
    const navContainer = document.querySelector(".bottom-nav");
    if (!navContainer) return;

    // 🌟 SIHIR BIKIN MENU MENYAMPING (HORIZONTAL) 🌟
    navContainer.style.display = "flex";
    navContainer.style.justifyContent = "space-around";
    navContainer.style.alignItems = "center";
    navContainer.style.padding = "10px 0";
    navContainer.style.background = "#ffffff";
    navContainer.style.borderTop = "1px solid #e2e8f0";

    let navItems = [];

    // 1. HOME (Menu Wajib Semua Peran)
    navItems.push({ id: 'dashboard', icon: '🏠', text: 'Home' });

    // 2. LOGIKA MENU BERDASARKAN PERAN
    if (currentRole === 'admin') {
        navItems.push({ id: 'rumah', icon: '🏘️', text: 'Rumah' });
        navItems.push({ id: 'keuangan', icon: '💰', text: 'Keuangan' });
        navItems.push({ id: 'penagihan', icon: '📋', text: 'Penagihan' });
        navItems.push({ id: 'lainnya', icon: '☰', text: 'Lainnya' }); // Menu Akses Admin
    } 
    else if (currentRole === 'bendahara') {
        navItems.push({ id: 'rumah', icon: '🏘️', text: 'Rumah' }); 
        navItems.push({ id: 'keuangan', icon: '💰', text: 'Keuangan' });
        navItems.push({ id: 'penagihan', icon: '📋', text: 'Penagihan' });
        navItems.push({ id: 'lainnya', icon: '☰', text: 'Lainnya' }); // 🔓 BENDHARA SEKARANG BISA AKSES MENU LAINNYA!
    } 
    else if (currentRole === 'penagih') {
        navItems.push({ id: 'penagihan', icon: '📋', text: 'Penagihan' });
    } 
    else if (currentRole === 'warga') {
        navItems.push({ id: 'keuangan', icon: '💰', text: 'Kas RT' }); 
        navItems.push({ id: 'penagihan', icon: '📋', text: 'Tagihan' });
    }

    // Suntikkan menu ke dalam HTML
    navContainer.innerHTML = navItems.map(item => `
        <a href="#" onclick="navigate('${item.id}')" style="text-decoration: none; color: #0f766e; display: flex; flex-direction: column; align-items: center; gap: 4px; font-size: 0.75rem; font-weight: bold; transition: 0.3s; padding-bottom: 4px; opacity: 0.6; width: 60px;">
            <span style="font-size: 1.4rem;">${item.icon}</span>
            ${item.text}
        </a>
    `).join('');
    
    // Panggil fungsi untuk nge-highlight menu yang sedang aktif
    const activePage = document.getElementById("main-content").dataset.activePage || "dashboard";
    updateActiveNav(activePage);
}

// Fungsi untuk mengganti peran secara global
function changeRole(role) {
    currentRole = role;
    renderBottomNav();
    navigate("dashboard");
}

// Jalankan render navigasi saat web pertama kali dibuka
document.addEventListener("DOMContentLoaded", () => {
    renderBottomNav();
});
