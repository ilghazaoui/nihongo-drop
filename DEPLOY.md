# 📘 Instructions de déploiement GitHub Pages

## Étape 1 : Créer un dépôt GitHub

1. Va sur [github.com](https://github.com) et connecte-toi
2. Clique sur le bouton **"New repository"** (ou "+" en haut à droite → "New repository")
3. Nomme ton dépôt : **`hiragana-drop`** (ou un autre nom)
4. Laisse-le **public** (obligatoire pour GitHub Pages gratuit)
5. **Ne coche pas** "Initialize with README" (tu en as déjà un)
6. Clique sur **"Create repository"**

## Étape 2 : Configuration importante dans vite.config.ts

**IMPORTANT** : Ouvre le fichier `vite.config.ts` et remplace le nom du repo par le tien :

```typescript
export default defineConfig({
  base: '/hiragana-drop/', // ⚠️ Remplace par '/ton-nom-de-repo/'
})
```

Par exemple, si ton dépôt s'appelle `nihongo-game`, mets :
```typescript
base: '/nihongo-game/'
```

## Étape 3 : Initialiser Git et pusher le code

Dans ton terminal PowerShell, dans le dossier du projet :

```powershell
# Initialiser git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Faire le premier commit
git commit -m "Initial commit: Nihongo Drop game"

# Ajouter l'origine (remplace VOTRE-USERNAME et le nom du repo)
git remote add origin https://github.com/VOTRE-USERNAME/hiragana-drop.git

# Renommer la branche en main si nécessaire
git branch -M main

# Pousser vers GitHub
git push -u origin main
```

## Étape 4 : Activer GitHub Pages

1. Va sur ton dépôt GitHub dans ton navigateur
2. Clique sur **"Settings"** (onglet en haut)
3. Dans le menu de gauche, clique sur **"Pages"**
4. Sous **"Source"**, sélectionne **"GitHub Actions"**
5. C'est tout ! Le workflow se lancera automatiquement

## Étape 5 : Vérifier le déploiement

1. Va dans l'onglet **"Actions"** de ton dépôt
2. Tu devrais voir le workflow "Deploy static content to Pages" en cours
3. Attends qu'il devienne vert ✅ (environ 1-2 minutes)
4. Ton jeu sera accessible à : `https://VOTRE-USERNAME.github.io/hiragana-drop/`

## 🔄 Déploiements futurs

Chaque fois que tu pousses du code sur la branche `main`, le jeu se redéploie automatiquement !

```powershell
git add .
git commit -m "Description de tes changements"
git push
```

## 🚀 Alternative : Déploiement manuel

Si tu préfères déployer manuellement sans GitHub Actions :

```powershell
npm run deploy
```

Cette commande :
1. Build le projet
2. Crée une branche `gh-pages`
3. Y pousse le contenu du dossier `dist`

⚠️ **Note** : Si tu utilises cette méthode, va dans Settings → Pages et sélectionne la branche `gh-pages` comme source.

## ❓ Problèmes fréquents

### Le jeu affiche une page blanche
- Vérifie que le `base` dans `vite.config.ts` correspond exactement au nom de ton dépôt
- Exemple : si ton dépôt est `https://github.com/john/my-game`, mets `base: '/my-game/'`

### Erreur 404 sur GitHub Pages
- Attends 2-3 minutes après le déploiement
- Vérifie que GitHub Pages est bien activé dans Settings → Pages
- Le workflow doit être en vert dans l'onglet Actions

### Le workflow ne se lance pas
- Vérifie que le fichier `.github/workflows/deploy.yml` existe
- Vérifie que tu as bien push sur la branche `main` (pas `master`)

## 📝 Mettre à jour le README

N'oublie pas de mettre à jour l'URL dans `README.md` :

```markdown
**[Jouer maintenant sur GitHub Pages](https://VOTRE-USERNAME.github.io/hiragana-drop/)**
```

Remplace `VOTRE-USERNAME` par ton nom d'utilisateur GitHub.

---

🎉 **Félicitations !** Ton jeu est maintenant déployé et accessible au monde entier !

