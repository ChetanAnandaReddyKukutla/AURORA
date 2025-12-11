# 🚀 Quick Deploy Guide

Deploy Aurora Apparel in under 5 minutes!

## Fastest Option: Render (FREE)

1. **Sign up:** Go to https://render.com and create a free account

2. **New Web Service:** Click "New +" → "Web Service"

3. **Connect Repository:**
   - If using Git: Connect your GitHub/GitLab repository
   - If no Git: Use "Public Git Repository" and paste your repo URL

4. **Configure:**
   ```
   Name: aurora-apparel
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

5. **Deploy:** Click "Create Web Service"

6. **Done!** Your site will be live at:
   `https://aurora-apparel-xxxx.onrender.com`

---

## Alternative: Railway (FREE)

1. Go to https://railway.app
2. Click "Start a New Project"
3. Choose "Deploy from GitHub repo"
4. Select your repository
5. Railway auto-detects everything and deploys
6. Get your URL from Deployments tab

**That's it! 🎉**

---

## Without Git Repository?

### Option 1: Create Git Repo

```bash
cd "c:\Users\herok\Documents\ecommerce website"
git init
git add .
git commit -m "Initial commit"
```

Then push to GitHub:
```bash
# Create repo on github.com first, then:
git remote add origin https://github.com/yourusername/aurora-apparel.git
git branch -M main
git push -u origin main
```

### Option 2: Deploy with Vercel CLI

```bash
npm install -g vercel
cd "c:\Users\herok\Documents\ecommerce website"
vercel
```

Follow prompts, then run:
```bash
vercel --prod
```

---

## Testing Your Live Site

Once deployed, test these URLs (replace with your actual domain):

✅ Home: `https://your-app.com/`
✅ Shop: `https://your-app.com/plp`
✅ Product: `https://your-app.com/pdp/AUR-001`
✅ Cart: `https://your-app.com/cart`

---

## Custom Domain Setup

### On Render:
1. Go to Settings → Custom Domain
2. Add your domain
3. Update DNS with provided CNAME

### On Railway:
1. Settings → Domains
2. Add custom domain
3. Follow DNS instructions

---

## Need Help?

- 📖 Full deployment guide: See `DEPLOYMENT.md`
- 🐛 Issues? Check the Troubleshooting section in README.md
- 💬 Platform support:
  - Render: https://render.com/docs
  - Railway: https://docs.railway.app

---

**You're ready to go live! 🎊**
