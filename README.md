# Nihongo Drop (にほんご ドロップ)

A Tetris-style game to learn Japanese while having fun! Match hiragana characters to form JLPT N5 vocabulary words.

## 🎮 Play

**[Play now on GitHub Pages](https://VOTRE-USERNAME.github.io/hiragana-drop/)**

## 🕹️ Controls

- **Mouse/Touch**: Move the cursor to position the block, click/tap to hard drop
- **Keyboard**:
  - `←` / `→`: Move left/right
  - `↓`: Move down one cell
  - `Space` or `Enter`: Start/Restart the game

## 🚀 Local development

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## 📦 Tech stack

- **TypeScript** – Main language
- **Vite** – Build tool and dev server
- **Vitest** – Test framework
- **CSS3** – Neon-style animations and effects

## 🎯 Features

- ✅ Smart hiragana tokenizer (handles combined small characters)
- ✅ Automatic detection of JLPT N5 vocabulary words
- ✅ Fuse animations with visual effects
- ✅ Gravity and cascading after matches
- ✅ Touch support for mobile
- ✅ Full keyboard controls

## 📄 GitHub Pages deployment

This project can be deployed to GitHub Pages either automatically via GitHub Actions
or manually using a helper script.

Manual deployment:
```bash
npm run deploy
```

## 📜 License

MIT
