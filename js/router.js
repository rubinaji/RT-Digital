/*==================================================
  RT DIGITAL - ROUTER ENGINE
==================================================*/

/**
 * Berfungsi untuk berpindah halaman/menu tanpa reload
 * @param {string} pageName - Nama halaman yang dituju (dashboard, warga, keuangan, dll)
 */
function navigate(pageName) {
  const appContainer = document.getElementById("app");
  
  // 1. Bersihkan kontainer utama terlebih dahulu
  appContainer.innerHTML = "";
  
  // 2. Suntikkan HTML Layout Dasar (Header + Tempat Konten + Bottom Nav)
  appContainer.innerHTML = renderBaseLayout();
  
  // 3. Ambil kontainer body tempat modul halaman akan dirender
  const contentBody = document.getElementById("content-body");
  
  // 4. Deteksi modul halaman mana yang harus dipanggil
  switch (pageName) {
    case "dashboard":
      // Cek apakah fungsi halaman dashboard sudah ada (akan dibuat di modul berikutnya)
      contentBody.innerHTML = typeof DashboardPage === "function" ? DashboardPage() : "<p>Modul Dashboard sedang disiapkan...</p>";
      break;
    case "rumah":
      contentBody.innerHTML = typeof RumahPage === "function" ? RumahPage() : "<p>Modul Data Rumah sedang disiapkan...</p>";
      break;
    case "keuangan":
    contentBody.innerHTML = typeof KeuanganPage === "function" ? KeuanganPage() : "<p>Modul Keuangan sedang disiapkan...</p>";
    break;
    case "penagihan":
    contentBody.innerHTML = typeof PenagihanPage === "function" ? PenagihanPage() : "<p>Modul Penagihan sedang disiapkan...</p>";
    break;
    case "profil":
    contentBody.innerHTML = typeof ProfilPage === "function" ? ProfilPage() : "<p>Modul Profil sedang disiapkan...</p>";
    break;
    default:
      contentBody.innerHTML = "<p>Halaman tidak ditemukan.</p>";
  }
  
  // 5. Perbarui status tombol aktif di Bottom Nav
  updateActiveNav(pageName);
}

/**
 * Menghasilkan kerangka HTML dasar untuk aplikasi
 */
function renderBaseLayout() {
  return `
    <header class="main-header">
      <div class="header-title">RT Digital v1</div>
    </header>
    
    <main id="content-body" class="content-body"></main>
    
    <nav class="bottom-nav">
      <button class="nav-item" data-page="dashboard" onclick="navigate('dashboard')">
        <span class="icon">🏠</span><span>Home</span>
      </button>
      <button class="nav-item" data-page="rumah" onclick="navigate('rumah')">
        <span class="icon">👥</span><span>Rumah</span>
      </button>
      <button class="nav-item" data-page="keuangan" onclick="navigate('keuangan')">
        <span class="icon">💰</span><span>Keuangan</span>
      </button>
      <button class="nav-item" data-page="penagihan" onclick="navigate('penagihan')">
        <span class="icon">📋</span><span>Penagihan</span>
      </button>
      <button class="nav-item" data-page="profil" onclick="navigate('profil')">
        <span class="icon">👤</span><span>Profil</span>
      </button>
    </nav>
  `;
}

/**
 * Mengatur kelas 'active' pada tombol menu bawah yang sedang dibuka
 */
function updateActiveNav(pageName) {
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach(item => {
    if (item.getAttribute("data-page") === pageName) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}
