/*==================================================
   RT DIGITAL - MODUL KEUANGAN (INTERAKTIF)
==================================================*/

let dataKeuangan = [
    { ket: "Iuran Warga - Blok A-01", jumlah: 50000, tipe: "masuk" },
    { ket: "Bayar Sampah", jumlah: 150000, tipe: "keluar" }
];

function KeuanganPage() {
    setTimeout(loadKeuanganData, 50);
    return `
        <div id="keuangan-container" style="padding: 20px; animation: fadeIn 0.3s ease;">
            <div class="card" style="background: linear-gradient(135deg, #0f766e, #14b8a6); color: white; padding: 20px; border: none; margin-bottom: 20px;">
                <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">Total Saldo Kas</p>
                <h1 id="total-saldo" style="margin: 5px 0 0 0; font-size: 2.2rem;">Rp 0</h1>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0;">Riwayat Transaksi</h3>
                <div id="wadah-btn-kas"></div>
            </div>

            <div id="list-transaksi" style="display: flex; flex-direction: column; gap: 10px;"></div>

            <div id="modal-kas" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center; backdrop-filter: blur(2px);">
                <div style="background: white; padding: 20px; border-radius: 16px; width: 90%; max-width: 350px;">
                    <h3 style="margin-top: 0;">Tambah Transaksi</h3>
                    <input type="text" id="input-ket" placeholder="Keterangan (mis: Iuran A-02)" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none;">
                    <input type="number" id="input-jumlah" placeholder="Jumlah (Rp)" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none;">
                    <select id="input-tipe" style="width: 100%; padding: 10px; margin-bottom: 20px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none;">
                        <option value="masuk">Pemasukan (+)</option>
                        <option value="keluar">Pengeluaran (-)</option>
                    </select>
                    <div style="display: flex; gap: 10px;">
                        <button id="btn-batal-kas" style="flex: 1; padding: 10px; border: none; background: #e2e8f0; border-radius: 8px; cursor: pointer;">Batal</button>
                        <button id="btn-simpan-kas" style="flex: 1; padding: 10px; border: none; background: #0f766e; color: white; border-radius: 8px; cursor: pointer;">Simpan</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function loadKeuanganData() {
    const listContainer = document.getElementById("list-transaksi");
    const modal = document.getElementById("modal-kas");
    const wadahBtnKas = document.getElementById("wadah-btn-kas");

    // CEK PERAN: Tombol + Kas HANYA untuk Admin dan Bendahara
    if (currentRole === 'admin' || currentRole === 'bendahara') {
        wadahBtnKas.innerHTML = `<button id="btn-tambah-kas" style="background: #0f766e; color: white; border: none; padding: 8px 15px; border-radius: 8px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">+ Kas</button>`;
        
        document.getElementById("btn-tambah-kas").onclick = () => modal.style.display = "flex";
        document.getElementById("btn-batal-kas").onclick = () => modal.style.display = "none";
        
        document.getElementById("btn-simpan-kas").onclick = () => {
            const ket = document.getElementById("input-ket").value;
            const jumlah = parseInt(document.getElementById("input-jumlah").value);
            const tipe = document.getElementById("input-tipe").value;

            if (ket && jumlah) {
                dataKeuangan.unshift({ ket, jumlah, tipe });
                render();
                modal.style.display = "none";
            } else {
                alert("Isi keterangan dan jumlah!");
            }
        };
    }

    function render() {
        listContainer.innerHTML = "";
        let total = 0;

        if(dataKeuangan.length === 0) return listContainer.innerHTML = `<p style="text-align:center; color:#94a3b8;">Belum ada transaksi.</p>`;

        dataKeuangan.forEach((item, index) => {
            total += (item.tipe === "masuk" ? item.jumlah : -item.jumlah);
            
            // CEK PERAN: Tombol hapus transaksi untuk Admin & Bendahara
            const btnHapus = (currentRole === 'admin' || currentRole === 'bendahara')
                ? `<button style="background: transparent; border: none; color: #ef4444; cursor: pointer; margin-left: 10px; font-size: 1.1rem;" onclick="hapusKas(${index})">🗑️</button>`
                : ``;

            listContainer.innerHTML += `
                <div class="card" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0; padding: 15px;">
                    <div style="flex: 1;">
                        <p style="margin: 0; font-weight: bold; color: #1e293b;">${item.ket}</p>
                    </div>
                    <div style="display: flex; align-items: center;">
                        <p style="margin: 0; color: ${item.tipe === "masuk" ? "#16a34a" : "#dc2626"}; font-weight: bold;">
                            ${item.tipe === "masuk" ? "+" : "-"} Rp ${item.jumlah.toLocaleString('id-ID')}
                        </p>
                        ${btnHapus}
                    </div>
                </div>
            `;
        });
        
        // Update Total Saldo dengan format Rupiah
        document.getElementById("total-saldo").innerText = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(total);
    }

    // Fungsi Hapus Kas
    window.hapusKas = function(index) {
        if(confirm("Yakin ingin menghapus transaksi ini?")) {
            dataKeuangan.splice(index, 1);
            render();
        }
    }

    render();
}
