/*================================================== 
  RT DIGITAL - GLOBAL STATE & SECURITY (LOGIN) 
  (SUPER REVISI: KEBAL HURUF BESAR/KECIL GLOBAL)
==================================================*/ 

// 🔥 KUNCI UTAMA: Ambil sesi dan paksa huruf kecil sejak awal aplikasi dimuat!
let currentRole = (localStorage.getItem("rt_role") || "").toLowerCase().trim(); 
let myBlok = localStorage.getItem("rt_blok") || ""; 
let myName = localStorage.getItem("rt_name") || ""; 

document.addEventListener("DOMContentLoaded", () => {
    if (currentRole && myName) {
        if (document.getElementById("login-screen")) document.getElementById("login-screen").style.display = "none"; 
        if (document.getElementById("app")) document.getElementById("app").style.display = "block"; 
        
        updateUIProfile();
        renderBottomNav(); 
        navigate("dashboard"); 
    }
});

function updateUIProfile() {
    if (document.getElementById("user-badge-name")) {
        document.getElementById("user-badge-name").innerText = myName; 
    }
    if (document.getElementById("user-badge-role")) {
        // Tampilkan dengan huruf besar agar UI tetap terlihat rapi & profesional
        document.getElementById("user-badge-role").innerText = currentRole.toUpperCase(); 
    }
    let icon = currentRole === 'admin' ? '👑' : (currentRole === 'bendahara' ? '💰' : (currentRole === 'penagih' ? '📋' : '👤')); 
    if (document.getElementById("user-badge-icon")) {
        document.getElementById("user-badge-icon").innerText = icon; 
    }
}

// FUNGSI LOGIN (Terkoneksi Google Sheets)
window.prosesLogin = async function() {
    let inputUser = document.getElementById("login-username").value; 
    let inputPass = document.getElementById("login-password").value; 

    if (!inputUser || !inputPass) return alert("Username dan Password wajib diisi!"); 

    let respon = await api("login", { username: inputUser, password: inputPass }); 

    if (respon.status === "success") { 
        // 🔥 KUNCI UTAMA 2: Ubah data dari server jadi huruf kecil sebelum masuk ke memori aplikasi
        currentRole = (respon.role || "").toLowerCase().trim(); 
        myBlok = respon.blok; 
        myName = respon.name; 

        localStorage.setItem("rt_role", currentRole); // Simpan ke browser dalam bentuk lowercase
        localStorage.setItem("rt_blok", myBlok);
        localStorage.setItem("rt_name", myName);

        updateUIProfile();

        document.getElementById("login-screen").style.display = "none"; 
        document.getElementById("app").style.display = "block"; 

        renderBottomNav(); 
        navigate("dashboard"); 
    } else { 
        alert("❌ " + (respon.message || "Login Gagal! Username atau Password salah.")); 
    } 
}; 

// FUNGSI LOGOUT 
window.prosesLogout = function() { 
    if (confirm("Yakin ingin keluar dari aplikasi?")) { 
        currentRole = ""; 
        myBlok = ""; 
        myName = ""; 
        localStorage.clear(); 
        
        document.getElementById("login-username").value = ""; 
        document.getElementById("login-password").value = ""; 
        document.getElementById("app").style.display = "none"; 
        document.getElementById("login-screen").style.display = "flex"; 
    } 
}; 

// FUNGSI NAVIGASI BAWAH 
window.renderBottomNav = function() { 
    const navContainer = document.querySelector(".bottom-nav"); 
    if (!navContainer) return; 
    
    navContainer.removeAttribute("style");
    let navItems = []; 
    
    navItems.push({ id: 'dashboard', icon: '🏠', text: 'Home' }); 

    if (currentRole === 'admin' || currentRole === 'bendahara' || currentRole === 'penagih') {
        navItems.push({ id: 'rumah', icon: '🏘️', text: 'Rumah' }); 
        navItems.push({ id: 'keuangan', icon: '💰', text: 'Keuangan' }); 
        navItems.push({ id: 'penagihan', icon: '📋', text: 'Penagihan' }); 
        navItems.push({ id: 'lainnya', icon: '☰', text: 'Lainnya' }); 
    } else if (currentRole === 'warga') { 
        navItems.push({ id: 'rumah', icon: '🏘️', text: 'Rumah Warga' }); 
        navItems.push({ id: 'keuangan', icon: '💰', text: 'Kas RT' }); 
        navItems.push({ id: 'lainnya', icon: '☰', text: 'Lainnya' }); 
    } 

    navContainer.innerHTML = navItems.map(item => ` 
        <a href="javascript:void(0)" onclick="navigate('${item.id}')" style="padding-bottom: 5px;"> 
            <span style="font-size: 1.4rem; margin-bottom: 2px;">${item.icon}</span> 
            <span>${item.text}</span> 
        </a> 
    `).join(''); 

    const activePage = document.getElementById("main-content").dataset.activePage || "dashboard"; 
    if (typeof updateActiveNav === "function") {
        setTimeout(() => updateActiveNav(activePage), 50); 
    }
};
