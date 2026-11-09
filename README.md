# Lampyria : Les Sept Lueurs

RPG au tour par tour inspiré de Dofus, jouable dans le navigateur et installable (PWA). JavaScript pur, sans compilation.

- **Jouer** : https://jasona-95.github.io/LampyriaV1/
- **Exploration** en 2D, **combats** en 2D ou en 3D iso (Babylon.js, optionnel).
- Activé par défaut ; Options > « Combat 3D » (ou `?3d=0` dans l'adresse) pour revenir à la 2D. Personnages et monstres en sprites pixel art (désactivables dans Options).
- **Hors ligne** : le jeu et le moteur 3D sont mis en cache à la première visite. Babylon.js est chargé depuis `babylon.js` à la racine (version 6.49.0, copie de https://cdn.jsdelivr.net/npm/babylonjs@6.49.0/babylon.js), avec repli sur les CDN si le fichier est absent.
- **Mise à jour** : Options > « Mettre à jour le jeu » (nécessite une connexion, la sauvegarde est conservée).

## Développement
- Tests : `node --test *.test.js`
- Moteur de combat (`moteur.js`) sans DOM ; rendu 2D (`rendu.js`), rendu 3D (`rendu3d.js`), interface (`affichage.js`).
- Après modification, incrémenter la version du cache dans `sw.js`.

Crédits et licences : voir `CREDITS.md`. Licence : voir `LICENSE`.
