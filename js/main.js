/*==================================================
   RT DIGITAL - GLOBAL STATE & ROLE MANAGER
==================================================*/

let currentRole = "admin";
window.myBlok = "Blok A-03"; // Default login simulasi warga

function renderBottomNav() {
    const navContainer = document.querySelector(".bottom-nav");
    if (!navContainer) return;

    navContainer.style.display = "flex";
    navContainer.style.justifyContent = "space-around";
    navContainer.style.alignItems = "center";
    navContainer.style.padding = "10px 0";
    navContainer.style.background = "#ffffff";
    navContainer.style.borderTop = "1px solid #e2e8f0";

    let navItems = [];

    navItems.push({ id: 'dashboard', icon: '🏠', text: 'Home' });

    if (currentRole === 'admin') {
        navItems.push({ id: 'rumah', icon: '🏘️', text: 'Rumah' });
        navItems.push({ id: 'keuangan', icon: '💰', text: 'Keuangan' });
        navItems.push({ id: 'penagihan', icon: '📋', text: 'Penagihan' });
        navItems.push({ id: 'lainnya', icon: '☰', text: 'Lainnya' });
    } 
    else if (currentRole === 'bendahara') {
        navItems.push({ id: 'rumah', icon: '🏘️', text: 'Rumah' }); 
        navItems.push({ id: 'keuangan', icon: '💰', text: 'Keuangan' });
        navItems.push({ id: 'penagihan', icon: '📋', text: 'Penagihan' });
        navItems.push({ id: 'lainnya', icon: '☰', text: 'Lainnya' }); 
    } 
    else if (currentRole === 'penagih') {
        navItems.push({ id: 'penagihan', icon: '📋', text: 'Penagihan' });
    } 
    else if (currentRole === 'warga') {
        navItems.push({ id: 'keuangan', icon: '💰', text: 'Kas RT' }); 
        navItems.push({ id: 'penagihan', icon: '📋', text: 'Tagihan' });
        navItems.push({ id: 'lainnya', icon: '☰', text: 'Lainnya' });
    }

    navContainer.innerHTML = navItems.map(item => `
        <a href="#" onclick="navigate('${item.id}')" style="text-decoration: none; color: #0f766e; display: flex; flex-direction: column; align-items: center; gap: 4px; font-size: 0.75rem; font-weight: bold; transition: 0.3s; padding-bottom: 4px; opacity: 0.6; width: 60px;">
            <span style="font-size: 1.4rem;">${item.icon}</span>
            ${item.text}
        </a>
    `).join('');
    
    const activePage = document.getElementById("main-content").dataset.activePage || "dashboard";
    updateActiveNav(activePage);
}

function changeRole(role) {
    currentRole = role;
    
    // 🔒 SIMULASI LOGIN: Sistem akan bertanya ini rumah siapa
    if (role === 'warga') {
        let cekBlok = prompt("Simulasi Login Warga:\\nMasukkan Nomor Blok Anda (Contoh: Blok A-03)", window.myBlok);
        if (cekBlok) window.myBlok = cekBlok;
    }

    renderBottomNav();
    navigate("dashboard");
}

document.addEventListener("DOMContentLoaded", () => {
    renderBottomNav();
});
