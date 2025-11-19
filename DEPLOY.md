# 📘 GitHub Pages deployment instructions

## Step 1: Create a GitHub repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **"New repository"** button (or "+" in the top right → "New repository")
3. Name your repo: **`hiragana-drop`** (or any other name)
4. Leave it **public** (required for free GitHub Pages)
5. **Do not check** "Initialize with README" (you already have one)
6. Click **"Create repository"**

## Step 2: Important config in vite.config.ts

**IMPORTANT**: Open `vite.config.ts` and adjust the repo name:

```typescript
export default defineConfig({
  base: '/hiragana-drop/', // ⚠️ Replace with '/your-repo-name/'
})
```

For example, if your repo is called `nihongo-game`, use:
```typescript
base: '/nihongo-game/'
```

## Step 3: Initialize Git and push the code

In your PowerShell terminal, inside the project folder:

```powershell
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create the first commit
git commit -m "Initial commit: Nihongo Drop game"

# Add the remote (replace YOUR-USERNAME and repo name)
git remote add origin https://github.com/YOUR-USERNAME/hiragana-drop.git

# Rename the branch to main if necessary
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 4: Enable GitHub Pages

1. Go to your GitHub repo in the browser
2. Click the **"Settings"** tab
3. In the left menu, click **"Pages"**
4. Under **"Source"**, select **"GitHub Actions"**
5. That's it! The workflow will start automatically

## Step 5: Check the deployment

1. Go to the **"Actions"** tab of your repo
2. You should see the "Deploy static content to Pages" workflow running
3. Wait for it to turn green ✅ (about 1–2 minutes)
4. Your game will be available at: `https://YOUR-USERNAME.github.io/hiragana-drop/`

## 🔄 Future deployments

Every time you push code to the `main` branch, the game is redeployed automatically:

```powershell
git add .
git commit -m "Describe your changes"
git push
```

## 🚀 Alternative: Manual deployment

If you prefer to deploy manually without GitHub Actions:

```powershell
npm run deploy
```

This command:
1. Builds the project
2. Creates a `gh-pages` branch
3. Pushes the contents of the `dist` folder to it

⚠️ **Note**: If you use this method, go to Settings → Pages and select the `gh-pages` branch as the source.

## ❓ Common issues

### The game shows a blank page
- Make sure `base` in `vite.config.ts` exactly matches your repo name
- Example: if your repo is `https://github.com/john/my-game`, set `base: '/my-game/'`

### 404 error on GitHub Pages
- Wait 2–3 minutes after deployment
- Make sure GitHub Pages is enabled under Settings → Pages
- The workflow should be green in the Actions tab

### The workflow does not start
- Check that the `.github/workflows/deploy.yml` file exists
- Verify that you pushed to the `main` branch (not `master`)

## 📝 Update the README

Don't forget to update the URL in `README.md`:

```markdown
**[Play now on GitHub Pages](https://YOUR-USERNAME.github.io/hiragana-drop/)**
```

Replace `YOUR-USERNAME` with your GitHub username.

---

🎉 **Congratulations!** Your game is now deployed and accessible to the world!
