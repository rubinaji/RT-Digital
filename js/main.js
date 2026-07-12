/*==================================================
   RT DIGITAL - GLOBAL STATE & ROLE MANAGER
==================================================*/

let currentRole = "admin";

// Fungsi untuk menggambar ulang Navigasi Bawah sesuai peran
function renderBottomNav() {
    const navContainer = document.querySelector(".bottom-nav");
    if (!navContainer) return;

    let navItems = [];

    // 1. HOME (Menu Wajib Semua Peran)
    navItems.push({ id: 'dashboard', icon: '🏠', text: 'Home' });

    // 2. LOGIKA MENU BERDASARKAN PERAN
    if (currentRole === 'admin') {
        navItems.push({ id: 'rumah', icon: '🏘️', text: 'Rumah' });
        navItems.push({ id: 'keuangan', icon: '💰', text: 'Keuangan' });
        navItems.push({ id: 'penagihan', icon: '📋', text: 'Penagihan' });
        navItems.push({ id: 'lainnya', icon: '☰', text: 'Lainnya' }); // Menu Super Admin
    } 
    else if (currentRole === 'bendahara') {
        navItems.push({ id: 'rumah', icon: '🏘️', text: 'Rumah' }); // Hanya bisa lihat data
        navItems.push({ id: 'keuangan', icon: '💰', text: 'Keuangan' });
        navItems.push({ id: 'penagihan', icon: '📋', text: 'Penagihan' });
    } 
    else if (currentRole === 'penagih') {
        navItems.push({ id: 'penagihan', icon: '📋', text: 'Penagihan' });
    } 
    else if (currentRole === 'warga') {
        navItems.push({ id: 'keuangan', icon: '💰', text: 'Kas RT' }); // Transparansi
        navItems.push({ id: 'penagihan', icon: '📋', text: 'Tagihan' });
    }

    // Suntikkan menu ke dalam HTML
    navContainer.innerHTML = navItems.map(item => `
        <a href="#" onclick="navigate('${item.id}')" style="text-decoration: none; color: #0f766e; display: flex; flex-direction: column; align-items: center; gap: 4px; font-size: 0.75rem; font-weight: bold; transition: 0.3s; padding-bottom: 4px; opacity: 0.6;">
            <span style="font-size: 1.4rem;">${item.icon}</span>
            ${item.text}
        </a>
    `).join('');
}

// Fungsi untuk mengganti peran secara global
function changeRole(role) {
    currentRole = role;
    
    // 1. Refresh menu navigasi bawah
    renderBottomNav();
    
    // 2. Setiap kali ganti akun, "lempar" paksa kembali ke Dashboard
    // Ini biar nggak ada kejadian Penagih "nyangkut" di halaman Keuangan peninggalan Bendahara
    navigate("dashboard");
}

// Jalankan render navigasi saat web pertama kali dibuka
document.addEventListener("DOMContentLoaded", () => {
    renderBottomNav();
});
