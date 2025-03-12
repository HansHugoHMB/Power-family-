import config from './config/token.js';

const GITHUB_USER = "HansHugoHMB";
const REPO_NAME = "Power-family-";
const FILE_PATH = "data/presences.json";
const TOKEN = config.GITHUB_TOKEN;

// Fonction pour récupérer les présences depuis GitHub
async function fetchPresences() {
    const url = `https://api.github.com/repos/${GITHUB_USER}/${REPO_NAME}/contents/${FILE_PATH}`;
    
    try {
        const response = await fetch(url, { headers: { "Authorization": `token ${TOKEN}`, "Accept": "application/vnd.github.v3+json" } });
        const data = await response.json();
        
        if (data.content) {
            let decodedData = atob(data.content);
            return JSON.parse(decodedData);
        }
    } catch (error) {
        console.error("Erreur lors du chargement des présences :", error);
    }
    return {};
}

// Fonction pour sauvegarder les présences sur GitHub
async function savePresences(presences) {
    const url = `https://api.github.com/repos/${GITHUB_USER}/${REPO_NAME}/contents/${FILE_PATH}`;
    
    const existingData = await fetchPresences();
    const newData = { ...existingData, ...presences };
    const contentEncoded = btoa(JSON.stringify(newData, null, 2));

    let sha = "";
    try {
        const res = await fetch(url, { headers: { "Authorization": `token ${TOKEN}`, "Accept": "application/vnd.github.v3+json" } });
        const data = await res.json();
        sha = data.sha;
    } catch (error) {
        console.log("Fichier non trouvé, création d'un nouveau fichier.");
    }

    const body = {
        message: "Mise à jour des présences",
        content: contentEncoded,
        sha: sha
    };

    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Authorization": `token ${TOKEN}`,
            "Accept": "application/vnd.github.v3+json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        console.error("❌ Erreur lors de l'enregistrement sur GitHub !");
    } else {
        console.log("✅ Présences enregistrées avec succès !");
    }
}

// Fonction pour enregistrer manuellement les présences
function manualSave() {
    const presences = {};
    const rows = document.querySelectorAll('.student-row');
    
    rows.forEach(row => {
        const studentName = row.querySelector('.student-name').innerText;
        const status = row.querySelector('.status').innerText;
        presences[studentName] = status;
    });
    
    savePresences(presences);
}

// Ajouter un écouteur d'événement pour le bouton d'enregistrement manuel
document.getElementById('saveBtn').addEventListener('click', manualSave);