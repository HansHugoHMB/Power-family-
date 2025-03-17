function validateCode(index, value) {
    const row = document.getElementById(`row-${index}`);
    const status = document.getElementById(`status-${index}`);
    const input = row.querySelector('.code-input');
    
    if (value === students[index].code) {
        row.classList.add('valid');
        row.classList.remove('invalid');
        status.innerText = "Présent";
        input.style.display = 'none'; // Cacher le champ de saisie
    } else if (value.length >= 6) {
        row.classList.add('invalid');
        row.classList.remove('valid');
        status.innerText = "Code erroné";
    } else {
        row.classList.remove('valid', 'invalid');
        status.innerText = "Absent";
        input.style.display = ''; // Réafficher le champ si nécessaire
    }
}
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

function genererPDF() {
  var doc = new jsPDF();
  doc.fromHTML(document.body, 15, 15, {
    width: 170,
  });
  doc.save("mon_document.pdf");
}

import config from './config/token.js';

const GITHUB_USER = "HansHugoHMB";
const REPO_NAME = "Power-family-";
const FILE_PATH = "data/presences.json";
const TOKEN = "config.GITHUB_TOKEN";

// Fonction pour récupérer les présences depuis GitHub
async function fetchPresences() {
    const url = `https://api.github.com/repos/${GITHUB_USER}/${REPO_NAME}/contents/${FILE_PATH}`;
    
    try {
        const response = await fetch(url, { headers: { "Accept": "application/vnd.github.v3+json" } });
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

    let existingData = await fetchPresences();
    let newData = { ...existingData, ...presences };
    let contentEncoded = btoa(JSON.stringify(newData, null, 2));

    let sha = "";
    try {
        const res = await fetch(url, { headers: { "Accept": "application/vnd.github.v3+json" } });
        const data = await res.json();
        sha = data.sha;
    } catch (e) {
        console.log("Fichier non trouvé, création d'un nouveau fichier.");
    }

    const body = {
        message: "Mise à jour automatique des présences",
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

// Fonction pour valider le code et sauvegarder
function validateCode(index, value) {
    const row = document.getElementById(`row-${index}`);
    const status = document.getElementById(`status-${index}`);
    
    let presences = {};
    if (value === students[index].code) {
        row.classList.add('valid');
        row.classList.remove('invalid');
        status.innerText = "Présent";
        presences[students[index].name] = "Présent";
    } else if (value.length >= 6) {
        row.classList.add('invalid');
        row.classList.remove('valid');
        status.innerText = "Code erroné";
        presences[students[index].name] = "Code erroné";
    } else {
        row.classList.remove('valid', 'invalid');
        status.innerText = "Absent";
        presences[students[index].name] = "Absent";
    }

    saveToLocalStorage(presences); // Enregistrer localement
    savePresences(presences); // Enregistrer sur GitHub
}

// Charger les présences depuis GitHub au démarrage
async function loadPresence() {
    let savedData = await fetchPresences();
    if (savedData) {
        students.forEach((student, index) => {
            let statusElement = document.getElementById(`status-${index}`);
            if (savedData[student.name]) {
                statusElement.textContent = savedData[student.name];
                statusElement.className = savedData[student.name] === "Présent" ? "valid" : savedData[student.name] === "Code erroné" ? "invalid" : "";
            }
        });
    }

    // Charger les présences depuis localStorage
    let localData = loadFromLocalStorage();
    if (localData) {
        students.forEach((student, index) => {
            let statusElement = document.getElementById(`status-${index}`);
            if (localData[student.name]) {
                statusElement.textContent = localData[student.name];
                statusElement.className = localData[student.name] === "Présent" ? "valid" : localData[student.name] === "Code erroné" ? "invalid" : "";
            }
        });
    }
}

// Initialisation de la page
document.addEventListener('DOMContentLoaded', async () => {
    renderList();
    await loadPresence();
});

console.log("Données enregistrées :", localStorage.getItem("presences"));


function loadAttendance() {
    getDocs(attendanceCollection).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const studentId = doc.id; // L'ID du document est maintenant une string
            const index = parseInt(studentId); // Convertir en nombre pour l'index du tableau students
            if (students[index]) {
                const row = document.getElementById(`row-${index}`);
                const statusTextElement = document.getElementById(`textStatus-${index}`);
                const statusSpanElement = document.getElementById(`status-${index}`);
                const codeInputElement = document.getElementById(`code-input-${index}`);

                if (data.status === "Présent") {
                    row.classList.add('valid');
                    row.classList.remove('invalid');
                    statusTextElement.innerText = "Présent";
                    codeInputElement.style.display = 'none';
                    statusSpanElement.style.display = 'inline';
                    codeInputElement.value = data.code;
                } else if (data.status === "Fraudeur") {
                    row.classList.add('invalid');
                    row.classList.remove('valid');
                    statusTextElement.innerText = "Fraudeur";
                    codeInputElement.style.display = 'inline';
                    statusSpanElement.style.display = 'none';
                    codeInputElement.value = data.code;
                    if (!fraudeStudents.includes(students[index].name)) {
                        fraudeStudents.push(students[index].name);
                    }
                } else {
                    row.classList.remove('valid', 'invalid');
                    statusTextElement.innerText = "Absent";
                    codeInputElement.style.display = 'inline';
                    statusSpanElement.style.display = 'none';
                    codeInputElement.value = "";
                }
            }
        });
        updateTotals();
        updateFraudeListDisplay();
        updatePresentListDisplay();
        updateAbsentListDisplay();
    }).catch((error) => {
        console.error("Error loading attendance from Firebase: ", error);
    });
}

function resetAttendance() {
    if (confirm("Êtes-vous sûr de vouloir réinitialiser toutes les présences ?")) {
        getDocs(attendanceCollection).then(querySnapshot => {
            const batch = writeBatch(db);
            querySnapshot.forEach(doc => {
                const docRef = doc(attendanceCollection, doc.id);
                batch.delete(docRef);
            });
            return batch.commit();
        }).then(() => {
            console.log("Attendance data reset successfully.");
            // Reset local UI
            fraudeStudents =;
            presentStudents =;
            absentStudents =;
            renderList();
            updateTotals();
            updateFraudeListDisplay();
            updatePresentListDisplay();
            updateAbsentListDisplay();
        }).catch(error => {
            console.error("Error resetting attendance data: ", error);
        });
    }
}