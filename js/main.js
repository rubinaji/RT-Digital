/*==================================================
   RT DIGITAL - GLOBAL STATE & SECURITY (LOGIN)
==================================================*/

// Variabel Global untuk menyimpan sesi user yang sedang aktif
let currentRole = ""; 
let myBlok = ""; 
let myName = "";

// 🗄️ DATABASE AKUN (Simulasi Sementara sebelum pakai LocalStorage)
const dataAkun = [
    { username: "admin", password: "123", role: "admin", name: "Ketua RT", blok: "Admin" },
    { username: "bendahara", password: "123", role: "bendahara", name: "Bpk. Keuangan", blok: "Bendahara" },
    { username: "penagih", password: "123", role: "penagih", name: "Bpk. Kolektor", blok: "Penagih" },
    // Akun otomatis warga: Username = Nama Blok
    { username: "blok a-01", password: "123456", role: "warga", name: "Bpk. Budi Santoso", blok: "Blok A-01" },
    { username: "blok a-03", password: "123456", role: "warga", name: "Ibu Siti Aminah", blok: "Blok A-03" }
];

// FUNGSI LOGIN
window.prosesLogin = function() {
    let inputUser = document.getElementById("login-username").value.toLowerCase();
    let inputPass = document.getElementById("login-password").value;

    if (!inputUser || !inputPass) return alert("Username dan Password wajib diisi!");

    // Cari akun di database
    let akunDitemukan = dataAkun.find(akun => akun.username === inputUser && akun.password === inputPass);

    if (akunDitemukan) {
        // Set Data Sesi
        currentRole = akunDitemukan.role;
        myBlok = akunDitemukan.blok;
        myName = akunDitemukan.name;

        // Update UI Profil di Pojok Kanan Atas
        document.getElementById("user-badge-name").innerText = myName;
        document.getElementById("user-badge-role").innerText = currentRole;
        let icon = currentRole === 'admin' ? '👑' : (currentRole === 'bendahara' ? '💰' : (currentRole === 'penagih' ? '📋' : '👤'));
        document.getElementById("user-badge-icon").innerText = icon;

        // Sembunyikan Layar Login, Tampilkan Aplikasi
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("app").style.display = "block";

        // Render menu & halaman awal
        renderBottomNav();
        navigate("dashboard");
    } else {
        alert("❌ Login Gagal! Username atau Password salah.");
    }
}

// FUNGSI LOGOUT (Ditambahkan ke tombol "Keluar" di menu Lainnya)
window.prosesLogout = function() {
    if(confirm("Yakin ingin keluar dari aplikasi?")) {
        currentRole = "";
        myBlok = "";
        myName = "";
        
        document.getElementById("login-username").value = "";
        document.getElementById("login-password").value = "";
        
        document.getElementById("app").style.display = "none";
        document.getElementById("login-screen").style.display = "flex";
    }
}

// FUNGSI NAVIGASI BAWAH (Sama seperti sebelumnya)
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

    if (currentRole === 'admin' || currentRole === 'bendahara') {
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
