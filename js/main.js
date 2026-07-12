// FUNGSI NAVIGASI BAWAH (Dynamic Menu Berdasarkan Role Data Sheet)
function renderBottomNav() { 
    const navContainer = document.querySelector(".bottom-nav"); 
    if (!navContainer) return; 
    
    // Hapus paksaan gaya dari JS, biarkan style.css yang bekerja sepenuhnya!
    navContainer.removeAttribute("style");

    let navItems = []; 
    navItems.push({ id: 'dashboard', icon: '🏠', text: 'Home' }); 

    if (currentRole === 'admin' || currentRole === 'bendahara') { 
        navItems.push({ id: 'rumah', icon: '🏘️', text: 'Rumah' }); 
        navItems.push({ id: 'keuangan', icon: '💰', text: 'Keuangan' }); 
        navItems.push({ id: 'penagihan', icon: '📋', text: 'Penagihan' }); 
        navItems.push({ id: 'lainnya', icon: '☰', text: 'Lainnya' }); 
    } else if (currentRole === 'penagih') { 
        navItems.push({ id: 'penagihan', icon: '📋', text: 'Penagihan' }); 
    } else if (currentRole === 'warga') { 
        navItems.push({ id: 'keuangan', icon: '💰', text: 'Kas RT' }); 
        navItems.push({ id: 'penagihan', icon: '📋', text: 'Tagihan' }); 
        navItems.push({ id: 'lainnya', icon: '☰', text: 'Lainnya' }); 
    } 

    // Render HTML super bersih tanpa inline CSS yang bertabrakan
    navContainer.innerHTML = navItems.map(item => ` 
        <a href="#" onclick="navigate('${item.id}')"> 
            <span style="font-size: 1.4rem;">${item.icon}</span> 
            <span>${item.text}</span> 
        </a> 
    `).join(''); 

    const activePage = document.getElementById("main-content").dataset.activePage || "dashboard"; 
    if (typeof updateActiveNav === "function") {
        updateActiveNav(activePage); 
    }
}
