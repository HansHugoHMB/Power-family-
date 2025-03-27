// Nom du cache
const CACHE_NAME = 'prepa-h-cache-v1';

// Liste des fichiers à mettre en cache lors de l'installation
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css', // Remplacez par le chemin de votre fichier CSS principal
  '/js/main.js',   // Remplacez par le chemin de votre fichier JavaScript principal
  // '/images/logo.png', // Si vous avez des images, ajoutez leurs chemins
  // '/autres-pages.html', // Ajoutez les autres pages de votre site
  // '/autres-fichiers.js' // Ajoutez d'autres fichiers JavaScript
];

// Événement d'installation : enregistre les fichiers en cache
self.addEventListener('install', function(event) {
  // Attendre que le cache soit ouvert
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache ouvert !');
        // Ajouter tous les URLs à mettre en cache
        return cache.addAll(urlsToCache);
      })
  );
});

// Événement de récupération (fetch) : intercepte les requêtes et tente de les servir depuis le cache
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Si la réponse est dans le cache, la retourner
        if (response) {
          return response;
        }
        // Sinon, faire une requête au réseau
        return fetch(event.request);
      }
    )
  );
});

// Événement d'activation : nettoie les anciens caches
self.addEventListener('activate', function(event) {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});