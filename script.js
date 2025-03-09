document.getElementById('printBtn').addEventListener('click', () => {
    // Solution hybride intelligente
    if (navigator.userAgent.includes('Android')) {
        // Astuce pour WebView Android
        try {
            window.print();
        } catch (e) {
            showAndroidInstruction();
        }
    } else {
        window.print();
    }
});

function showAndroidInstruction() {
    const msg = document.createElement('div');
    msg.innerHTML = `
        <div style="
            position: fixed;
            bottom: 100px;
            right: 30px;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            z-index: 9999;
        ">
            <p>📱 Appuyez longtemps sur la page → Partager → Imprimer</p>
            <button onclick="this.parentElement.remove()">OK</button>
        </div>
    `;
    document.body.appendChild(msg);
}
