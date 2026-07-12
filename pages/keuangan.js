dataKeuangan.forEach((item, index) => {
            total += (item.tipe === "masuk" ? item.jumlah : -item.jumlah);
            listContainer.innerHTML += `
                <div class="card" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0; padding: 15px;">
                    <div style="flex: 1;">
                        <p style="margin: 0; font-weight: bold; color: #1e293b;">${item.ket}</p>
                    </div>
                    <div style="display: flex; align-items: center;">
                        <p style="margin: 0; color: ${item.tipe === "masuk" ? "#16a34a" : "#dc2626"}; font-weight: bold;">
                            ${item.tipe === "masuk" ? "+" : "-"} Rp ${item.jumlah.toLocaleString('id-ID')}
                        </p>
                    </div>
                </div>
            `;
        });
