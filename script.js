document.getElementById('printBtn').addEventListener('click', function() {
    // Solution universelle
    if (navigator.userAgent.toLowerCase().includes('android')) {
        // Pour WebView Android
        window.print = function() {
            alert("Utilisez le menu partage → Imprimer");
        };
    }
    window.print();
});
