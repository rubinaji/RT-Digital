/*================================================== 
  RT DIGITAL - GLOBAL STATE & SECURITY (LOGIN) 
==================================================*/ 

// Variabel Global untuk menyimpan sesi user yang sedang aktif 
let currentRole = ""; 
let myBlok = ""; 
let myName = ""; 

// FUNGSI LOGIN (Terintegrasi Real-time dengan Google Sheets via api.js)
window.prosesLogin = async function() {
    let inputUser = document.getElementById("login-username").value; 
    let inputPass = document.getElementById("login-password").value; 

    if (!inputUser || !inputPass) return alert("Username dan Password wajib diisi!"); 

    // Kirim data ke backend Google Sheet melalui jembatan API POST
    let respon = await api("login", { username: inputUser, password: inputPass }); 

    if (respon.status === "success") { 
        // Set Data Sesi dari database Google Sheet
        currentRole = respon.role; 
        myBlok = respon.blok; 
        myName = respon.name; 

        // Update UI Profil di Pojok Kanan Atas 
        if (document.getElementById("user-badge-name")) {
            document.getElementById("user-badge-name").innerText = myName; 
        }
        if (document.getElementById("user-badge-role")) {
            document.getElementById("user-badge-role").innerText = currentRole; 
        }
        
        let icon = currentRole === 'admin' ? '👑' : (currentRole === 'bendahara' ? '💰' : (currentRole === 'penagih' ? '📋' : '👤')); 
        if (document.getElementById("user-badge-icon")) {
            document.getElementById("user-badge-icon").innerText = icon; 
        }

        // Sembunyikan Layar Login, Tampilkan Aplikasi 
        document.getElementById("login-screen").style.display = "none"; 
        document.getElementById("app").style.display = "block"; 

        // Render menu & halaman awal 
        renderBottomNav(); 
        navigate("dashboard"); 
    } else { 
        // Menampilkan pesan error kegagalan login langsung dari Google Apps Script
        alert("❌ " + (respon.message || "Login Gagal! Username atau Password salah.")); 
    } 
}; 

// FUNGSI LOGOUT (Ditambahkan ke tombol "Keluar" di menu Lainnya) 
window.prosesLogout = function() { 
    if (confirm("Yakin ingin keluar dari aplikasi?")) { 
        currentRole = ""; 
        myBlok = ""; 
        myName = ""; 
        document.getElementById("login-username").value = ""; 
        document.getElementById("login-password").value = ""; 
        document.getElementById("app").style.display = "none"; 
        document.getElementById("login-screen").style.display = "flex"; 
    } 
}; 

// FUNGSI NAVIGASI BAWAH (Dynamic Menu Berdasarkan Role Data Sheet)
window.renderBottomNav = function() { 
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

    // Render HTML super bersih tanpa efek loncat
    navContainer.innerHTML = navItems.map(item => ` 
        <a href="javascript:void(0)" onclick="navigate('${item.id}')" style="padding-bottom: 5px;"> 
            <span style="font-size: 1.4rem; margin-bottom: 2px;">${item.icon}</span> 
            <span>${item.text}</span> 
        </a> 
    `).join(''); 

    const activePage = document.getElementById("main-content").dataset.activePage || "dashboard"; 
    if (typeof updateActiveNav === "function") {
        // Paksa sinkronisasi setelah menu digambar ulang
        setTimeout(() => updateActiveNav(activePage), 50); 
    }
};
