# Vice City Neon — Countdown Lock Screen Studio

A static, zero-dependency **GTA-inspired Countdown Lock Screen Designer** built for instant hosting on **GitHub Pages**.

## Included in This Repository
- **`index.html` / `styles.css` / `app.js`** — Interactive Lock Screen Studio with:
  - 3 GTA-inspired palettes (**Vice City Neon**, **San Andreas Street**, **Los Santos Luxe**) + custom background upload
  - Presets for **Thanksgiving Gathering**, **Mission: Project Phoenix**, and **Project Launch**
  - Automatic working-backward milestone builder (`T-21`, `T-14`, `T-7`, `T-3`, `T-1`, `Launch Day`)
  - Device safe-zone overlays and full-resolution PNG export for **iPhone Pro Max (`1290×2796`)** and **Samsung Ultra (`1440×3120`)**
- **`assets/`** — All 4 pre-rendered Vice City Neon 9:16 wallpapers, including `blank-hud-base.jpg` for daily phone automation.
- **`.github/workflows/pages.yml`** — Pre-configured GitHub Actions workflow for automatic GitHub Pages deployment.

## Quick Deploy to GitHub Pages (60 Seconds)
1. Create a new public repository on GitHub (for example, `countdown-lockscreen`).
2. Extract this ZIP and upload all files (including `index.html`, `styles.css`, `app.js`, `assets/`, and `.github/`) to the root of your `main` branch.
3. In your repository, go to **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **GitHub Actions** (or **Deploy from a branch → `main` / `/ (root)`**).
5. Your live project link will be published at:
   `https://<your-github-username>.github.io/<repo-name>/`
