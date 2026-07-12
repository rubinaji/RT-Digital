/*================================================== 
  RT DIGITAL - GLOBAL STATE, SECURITY & ROUTER NAVIGATION
  (FILE UTAMA: js/main.js)
==================================================*/ 

// 🔑 AMBIL SESI LOGIN & PAKSA lowercase AGAR KEBAL HUMAN ERROR
let currentRole = (localStorage.getItem("rt_role") || "").toLowerCase().trim(); 
let myBlok = localStorage.getItem("rt_blok") || ""; 
let myName = localStorage.getItem("rt_name") || ""; 

// Pengecekan otomatis saat aplikasi pertama kali dibuka browser
document.addEventListener("DOMContentLoaded", () => {
    if (currentRole && myName) {
        if (document.getElementById("login-screen")) document.getElementById("login-screen").style.display = "none"; 
        if (document.getElementById("app")) document.getElementById("app").style.display = "block"; 
        
        updateUIProfile();
        renderBottomNav(); 
        navigate("dashboard"); // Otomatis masuk ke Home
    }
});

// FUNGSI UTAMA ROUTER (Menghidupkan tombol klik di semua halaman .js)
window.navigate = function(page) {
    const mainContent = document.getElementById("main-content");
    if (!mainContent) return;
    
    // Simpan status halaman aktif ke dataset HTML
    mainContent.dataset.activePage = page;
    
    // Update visual menu aktif jika fungsi css tersedia
    if (typeof updateActiveNav === "function") {
        updateActiveNav(page);
    }
    
    let roleBersih = (currentRole || "").toLowerCase().trim();
    
    // 🚦 SISTEM DISTRIBUSI ROUTING HALAMAN OPERASIONAL RT
    if (page === "dashboard") {
        if (typeof dashboardPage === "function") dashboardPage();
    } 
    else if (page === "rumah") {
        if (typeof rumahPage === "function") rumahPage();
    } 
    else if (page === "keuangan") {
        if (typeof keuanganPage === "function") keuanganPage();
    } 
    else if (page === "penagihan") {
        if (roleBersih === "warga") {
            alert("🔒 Akses Ditolak: Warga tidak diizinkan membuka menu Penagihan.");
            navigate("dashboard");
        } else {
            if (typeof penagihanPage === "function") penagihanPage();
        }
    } 
    else if (page === "lainnya") {
        if (typeof lainnyaPage === "function") lainnyaPage();
    } 
    else if (page === "pengumuman") {
        if (typeof pengumumanPage === "function") pengumumanPage();
    } 
    else if (page === "laporan") {
        if (typeof laporanPage === "function") laporanPage();
    } 
    else if (page === "pengaturan") {
        if (roleBersih !== "admin") {
            alert("🔒 Akses Ditolak: Menu Pengaturan khusus untuk Ketua RT (Admin).");
            navigate("lainnya");
        } else {
            if (typeof pengaturanPage === "function") pengaturanPage();
        }
    } 
    else if (page === "profil") {
        if (typeof profilPage === "function") profilPage();
    }
};

// FUNGSI UPDATE BADGE UI PROFIL
function updateUIProfile() {
    if (document.getElementById("user-badge-name")) {
        document.getElementById("user-badge-name").innerText = myName; 
    }
    if (document.getElementById("user-badge-role")) {
        document.getElementById("user-badge-role").innerText = currentRole.toUpperCase(); 
    }
    let icon = currentRole === 'admin' ? '👑' : (currentRole === 'bendahara' ? '💰' : (currentRole === 'penagih' ? '📋' : '👤')); 
    if (document.getElementById("user-badge-icon")) {
        document.getElementById("user-badge-icon").innerText = icon; 
    }
}

// FUNGSI PROSES LOGIN KE SERVER
window.prosesLogin = async function() {
    let inputUser = document.getElementById("login-username").value; 
    let inputPass = document.getElementById("login-password").value; 

    if (!inputUser || !inputPass) return alert("Username dan Password wajib diisi!"); 

    let respon = await api("login", { username: inputUser, password: inputPass }); 

    if (respon.status === "success") { 
        currentRole = (respon.role || "").toLowerCase().trim(); 
        myBlok = respon.blok; 
        myName = respon.name; 

        localStorage.setItem("rt_role", currentRole);
        localStorage.setItem("rt_blok", myBlok);
        localStorage.setItem("rt_name", myName);

        updateUIProfile();

        document.getElementById("login-screen").style.display = "none"; 
        document.getElementById("app").style.display = "block"; 

        renderBottomNav(); 
        navigate("dashboard"); 
    } else { 
        alert("❌ " + (respon.message || "Username atau Password salah.")); 
    } 
}; 

// FUNGSI LOGOUT KELUAR APLIKASI
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

// FUNGSI MENGGAMBAR NAVIGASI BAWAH DINAMIS
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
};
