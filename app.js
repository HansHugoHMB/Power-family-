// Firebase configuration (REPLACE with YOUR configuration from Firebase Console)
        const firebaseConfig = {
          apiKey: "AIzaSyDxKIjc4oamJcbxSpc_JXs1JevdHk_nxgk",
          authDomain: "prepa-h.firebaseapp.com",
          projectId: "prepa-h",
          storageBucket: "prepa-h.firebasestorage.app",
          messagingSenderId: "252096818674",
          appId: "1:252096818674:web:eeee54b5fd936789650f6b",
          measurementId: "G-8S2ZNC74FW"
        };

        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);

        // Get a reference to the Realtime Database
        const database = firebase.database();

        // ... (Reste du code JavaScript : students array, renderList, validateCode, etc. - inchangé dans cette partie) ...

        let fraudeStudents = []; // Tableau pour stocker les étudiants frauduleux

        function renderList() {
            // ... (Fonction renderList - inchangée) ...
            loadAttendanceData(); // Charger les données après avoir rendu la liste
        }

        // Fonction pour sauvegarder les données dans Firebase Realtime Database
        function saveAttendanceData() {
           // ... (Fonction saveAttendanceData - inchangée) ...
        }

        // Fonction pour charger les données depuis Firebase Realtime Database
        function loadAttendanceData() {
            // ... (Fonction loadAttendanceData - inchangée) ...
        }


        function updateTotals() {
            // ... (Fonction updateTotals - inchangée) ...
        }

        function updateFraudeListDisplay() {
            // ... (Fonction updateFraudeListDisplay - inchangée) ...
        }


        function validateCode(index, value) {
            // ... (Fonction validateCode - inchangée) ...
            saveAttendanceData(); // Sauvegarder les données après chaque changement de statut !
        }


        // Initialiser le tableau, les totaux et la liste des frauduleux
        renderList();
        updateTotals();
        updateFraudeListDisplay();


