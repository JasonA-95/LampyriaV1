# Lampyria : Les Sept Lueurs

RPG tactique au tour par tour, jouable dans un navigateur moderne.

## Lancer le jeu

Depuis ce dossier, démarrez un serveur web local :

```powershell
py -m http.server 8000
```

Ouvrez ensuite <http://localhost:8000>. Le service worker nécessite HTTPS ou
`localhost` ; ouvrir directement `index.html` depuis le disque ne permet pas
d'utiliser le mode hors ligne.

## Tests

Avec Node.js installé, exécutez toute la suite :

```powershell
node --test
```

## Organisation

- `donnees.js` contient les données du monde, des classes et des rencontres.
- `moteur.js`, `exploration.js` et `alea.js` gèrent les combats et l'exploration.
- `etat.js`, `sauvegarde.test.js` et `succes.js` couvrent l'état et la progression.
- `index.html` assemble l'interface et charge les modules JavaScript.
- `sw.js` gère les caches hors ligne ; les sauvegardes de progression restent
  dans le stockage local du navigateur.

Le service worker conserve les réponses réseau réussies et réutilise le cache
si le réseau est indisponible. Les instruments audio gardent un cache séparé.
Lors de l'activation d'une nouvelle version, seuls les anciens caches nommés
`lampyria-v<number>` sont supprimés. L'action « Mettre à jour le jeu » vide
ces caches de version et désenregistre uniquement le service worker de
Lampyria ; le cache audio et les caches des autres applications de l'origine
sont conservés. Les ressources sont mises en cache à leur première visite en
ligne, elles ne sont pas préchargées.
