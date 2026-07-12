async function penagihanPage() {
    const mainContent = document.getElementById("main-content");
    mainContent.innerHTML = `<div style="padding:20px;text-align:center;">🔄 Mengecek data tagihan...</div>`;

    let res = await api("getTagihan");
    let htmlTagihan = res.data.map(t => `
        <div style="background:white;padding:15px;border-radius:12px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;border:1px solid #eee;">
            <div>
                <b style="display:block;">${t.blok} - ${t.nama}</b>
                <span style="color:#dc2626;font-size:0.8rem;font-weight:bold;">Belum Bayar iuran</span>
            </div>
            <button onclick="tagihWA('${t.wa}', '${t.blok}')" style="background:#22c55e;color:white;border:none;padding:8px 12px;border-radius:8px;font-size:0.8rem;font-weight:bold;cursor:pointer;">📢 Tagih</button>
        </div>
    `).join('');

    mainContent.innerHTML = `
        <div style="padding:20px;">
            <h2 style="color:#0f766e;margin-bottom:20px;">📋 Penagihan Iuran</h2>
            <div id="list-tagihan">${htmlTagihan || '<p style="text-align:center;color:#16a34a;">✅ Semua warga sudah lunas!</p>'}</div>
        </div>
    `;
}

window.tagihWA = function(wa, blok) {
    let pesan = window.encodeURIComponent(`Halo Bapak/Ibu Warga ${blok}, sekedar mengingatkan untuk pembayaran iuran bulan ini belum tercatat di sistem RT Digital. Mohon segera melakukan pembayaran. Terima kasih. 🙏`);
    window.open(`https://wa.me/${wa}?text=${pesan}`, '_blank');
}
