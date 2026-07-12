/*==================================================
   RT DIGITAL - MODUL PENAGIHAN
==================================================*/

function PenagihanPage() {
    // Beri jeda agar DOM siap
    setTimeout(loadPenagihanData, 50);
    
    return `
        <div style="padding: 20px; animation: fadeIn 0.3s ease;">
            
            <div style="margin-bottom: 20px;">
                <h2 style="margin: 0; color: #1e293b;">📋 Status Iuran Bulan Ini</h2>
                <p style="margin: 5px 0 0 0; color: #64748b; font-size: 0.9rem;">Pantau warga yang sudah atau belum membayar kas.</p>
            </div>

            <div id="list-penagihan" style="display: flex; flex-direction: column; gap: 12px;"></div>

        </div>
    `;
}

function loadPenagihanData() {
    const container = document.getElementById("list-penagihan");
    if (!container) return;
    
    container.innerHTML = "";
    
    // Cek apakah dataRumah dari rumah.js bisa diakses
    if (typeof dataRumah !== 'undefined' && dataRumah.length > 0) {
        dataRumah.forEach((rumah, index) => {
            // DUMMY LOGIC: Sementara kita bikin selang-seling lunas & belum bayar
            // Nanti ini diganti dengan data asli dari Google Sheets
            let isLunas = index % 2 === 0; 
            
            let badgeBg = isLunas ? '#dcfce7' : '#fef2f2';
            let badgeColor = isLunas ? '#16a34a' : '#dc2626';
            let statusText = isLunas ? 'Lunas' : 'Belum Bayar';

            container.innerHTML += `
                <div class="card" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0; padding: 15px;">
                    <div>
                        <h4 style="margin: 0; color: #0f172a; font-size: 1.1rem;">Blok ${rumah.blok}</h4>
                        <p style="margin: 3px 0 0 0; font-size: 0.9rem; color: #64748b;">${rumah.nama}</p>
                    </div>
                    <span style="background: ${badgeBg}; color: ${badgeColor}; padding: 5px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: bold;">${statusText}</span>
                </div>
            `;
        });
    } else {
        container.innerHTML = `
            <div class="card" style="text-align: center; padding: 20px; color: #64748b;">
                <p>Belum ada data warga.</p>
            </div>
        `;
    }
}
