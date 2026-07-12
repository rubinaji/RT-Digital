/*==================================================
   RT DIGITAL - MODUL PENAGIHAN
==================================================*/
function PenagihanPage() {
    return `
        <div style="padding: 20px;">
            <h2 style="color: #0f766e;">Status Iuran Warga</h2>
            <div style="background: white; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0;">
                <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
                    <span>Blok A-01</span>
                    <span style="color: #16a34a; font-weight: bold;">Lunas</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 10px 0;">
                    <span>Blok A-02</span>
                    <span style="color: #dc2626; font-weight: bold;">Belum Bayar</span>
                </div>
            </div>
        </div>
    `;
}
