# ETS Website — How to Preview and Deploy

## Step 1: Preview Locally (Right Now)

Simply **double-click** the `index.html` file in your file explorer. It will open in your browser and work perfectly — no server needed. Everything is in a single file (HTML, CSS, JavaScript).

---

## Step 2: Deploy to GitHub Pages (Free, Takes 10 Minutes)

### First Time Setup

1. **Go to GitHub** → github.com → Sign in to your account
2. **Create a new repository:**
   - Click the green "New" button (or go to github.com/new)
   - Repository name: `ets-website` (or anything you like)
   - Set to **Public** (required for free GitHub Pages)
   - Check "Add a README file"
   - Click "Create repository"

3. **Upload your website files:**
   - In your new repo, click **"Add file"** → **"Upload files"**
   - Drag and drop the `index.html` file from the `website` folder
   - Write a commit message like "Initial website"
   - Click **"Commit changes"**

4. **Enable GitHub Pages:**
   - Go to your repo's **Settings** tab (top menu)
   - In the left sidebar, click **Pages**
   - Under "Source", select **"Deploy from a branch"**
   - Under "Branch", select **"main"** and **"/ (root)"**
   - Click **Save**

5. **Wait 1-2 minutes**, then your site will be live at:
   ```
   https://YOUR-USERNAME.github.io/ets-website/
   ```

### Updating the Site Later

Whenever you want to make changes:
1. Go to your repo on GitHub
2. Click `index.html`
3. Click the pencil icon (Edit)
4. Make changes
5. Click "Commit changes"
6. Wait 1-2 minutes for it to go live

---

## Step 3: When You're Ready to Go Live (After Internal Approval)

When leadership approves and you want a real domain like `ets-solutions.de`:

### Option A: Keep GitHub Pages + Custom Domain (Free hosting)
1. Buy a domain (~10-15 EUR/year) from Namecheap, GoDaddy, or similar
2. In your GitHub repo → Settings → Pages → Custom domain
3. Enter your domain, follow GitHub's DNS instructions
4. Done — professional URL, still free hosting

### Option B: Move to a CMS (For easier editing by non-technical team)
1. **Webflow** (~15 EUR/month) — visual drag-and-drop, no code needed
2. **WordPress** (~5-15 EUR/month for hosting) — most popular, lots of plugins
3. **Framer** (~10 EUR/month) — modern, fast, good for simple sites

For now, GitHub Pages is the right choice — free, professional URL, and the content you have is all you need for the proof of concept.

---

## What's in the Website

| Feature | Description |
|---|---|
| **Hero section** | Main headline, stats, calls to action |
| **Problem section** | Side-by-side rate comparison (local banks vs ECA) |
| **How it Works** | 5-step process explained simply |
| **Savings Calculator** | Interactive tool — visitor picks country and equipment cost, sees the savings |
| **Sectors** | Mining, Construction, Manufacturing, Energy, Logistics cards |
| **Qualification Check** | Interactive checklist — visitors self-assess their fit |
| **ECA Partners** | Six ECAs with flags and descriptions |
| **About / Credibility** | INZAG group stats (77 years, 1000+ contracts, etc.) |
| **Contact CTA** | Email link and qualification check link |
| **Chatbot** | Rule-based conversation assistant (bottom-right corner) that guides visitors through ECA basics, qualification, and savings |
| **SEO** | Meta tags, Open Graph tags, semantic HTML, keyword-optimized content |

---

## Customization Quick Guide

To change text or numbers, open `index.html` in any text editor (even Notepad) and search for the text you want to change. Everything is in one file and clearly structured.

### Common Changes:
- **Email address**: Search for `ets@inzag.de` and replace with your actual email
- **Phone number**: Search for `[Phone]` in the CTA section
- **Interest rates**: Search for the rate values (e.g., `10–14%`) in the rate cards
- **Company stats**: Search for `77+`, `1,000+` etc. in the About section
- **Colors**: Change `--primary: #0C2340` or `--accent: #D4A843` in the CSS variables at the top
