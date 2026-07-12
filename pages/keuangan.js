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
        <div id="keuangan-container" style="padding: 20px;">
            <div id="saldo-card" style="background: #0f766e; color: white; padding: 20px; border-radius: 16px; margin-bottom: 20px;">
                <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">Total Saldo Kas</p>
                <h1 id="total-saldo" style="margin: 5px 0 0 0;">Rp 0</h1>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0;">Riwayat Transaksi</h3>
                <button id="btn-tambah-kas" style="background: #0f766e; color: white; border: none; padding: 8px 15px; border-radius: 8px; cursor: pointer;">+ Kas</button>
            </div>

            <div id="list-transaksi" style="display: flex; flex-direction: column; gap: 10px;"></div>

            <div id="modal-kas" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center;">
                <div style="background: white; padding: 20px; border-radius: 16px; width: 90%; max-width: 350px;">
                    <h3>Tambah Transaksi</h3>
                    <input type="text" id="input-ket" placeholder="Keterangan (mis: Iuran A-02)" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 8px;">
                    <input type="number" id="input-jumlah" placeholder="Jumlah (Rp)" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 8px;">
                    <select id="input-tipe" style="width: 100%; padding: 10px; margin-bottom: 20px; border: 1px solid #ddd; border-radius: 8px;">
                        <option value="masuk">Pemasukan (+)</option>
                        <option value="keluar">Pengeluaran (-)</option>
                    </select>
                    <div style="display: flex; gap: 10px;">
                        <button id="btn-batal-kas" style="flex: 1; padding: 10px; border: none; background: #eee; border-radius: 8px;">Batal</button>
                        <button id="btn-simpan-kas" style="flex: 1; padding: 10px; border: none; background: #0f766e; color: white; border-radius: 8px;">Simpan</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function loadKeuanganData() {
    const listContainer = document.getElementById("list-transaksi");
    const modal = document.getElementById("modal-kas");

    function render() {
        listContainer.innerHTML = "";
        let total = 0;

        dataKeuangan.forEach(item => {
            total += (item.tipe === "masuk" ? item.jumlah : -item.jumlah);
            listContainer.innerHTML += `
                <div style="background: white; padding: 15px; border-radius: 10px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between;">
                    <p style="margin: 0; font-weight: bold;">${item.ket}</p>
                    <p style="margin: 0; color: ${item.tipe === "masuk" ? "#16a34a" : "#dc2626"}; font-weight: bold;">
                        ${item.tipe === "masuk" ? "+" : "-"} Rp ${item.jumlah.toLocaleString()}
                    </p>
                </div>
            `;
        });
        document.getElementById("total-saldo").innerText = `Rp ${total.toLocaleString()}`;
    }

    render();

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
            alert("Isi data dengan lengkap!");
        }
    };
}
