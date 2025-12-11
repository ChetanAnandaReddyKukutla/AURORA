# Deployment Guide - Aurora Apparel

This guide covers deploying the Aurora Apparel e-commerce platform to various hosting providers.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Deployment Options](#deployment-options)
- [Environment Setup](#environment-setup)
- [Production Checklist](#production-checklist)

---

## Prerequisites

Before deploying, ensure you have:
- Node.js 14.0.0 or higher installed
- Git repository initialized
- All dependencies installed (`npm install`)
- Environment variables configured

---

## Deployment Options

### Option 1: Render (Recommended - Free Tier Available)

**Steps:**
1. Create account at [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your Git repository
4. Configure:
   - **Name:** aurora-apparel
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
5. Add environment variables (if needed)
6. Click "Create Web Service"

**Result:** Your app will be live at `https://aurora-apparel-xxxx.onrender.com`

---

### Option 2: Railway

**Steps:**
1. Create account at [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway auto-detects Node.js and deploys
5. Configure environment variables in "Variables" tab
6. Get your URL from the "Deployments" tab

**Result:** Live at `https://aurora-apparel.up.railway.app`

---

### Option 3: Heroku

**Steps:**
1. Install Heroku CLI: `npm install -g heroku`
2. Login: `heroku login`
3. Create app: `heroku create aurora-apparel`
4. Deploy:
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```
5. Open app: `heroku open`

**Configuration:**
```bash
heroku config:set NODE_ENV=production
```

**Result:** Live at `https://aurora-apparel.herokuapp.com`

---

### Option 4: Vercel

**Steps:**
1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel`
3. Follow prompts
4. Deploy: `vercel --prod`

**Note:** Vercel is optimized for Next.js but works with Express. You may need a `vercel.json` config file.

---

### Option 5: DigitalOcean App Platform

**Steps:**
1. Create account at [digitalocean.com](https://www.digitalocean.com)
2. Go to "App Platform" → "Create App"
3. Connect GitHub repository
4. Configure:
   - **Name:** aurora-apparel
   - **Build Command:** `npm install`
   - **Run Command:** `npm start`
   - **HTTP Port:** 3000
5. Select plan (starts at $5/month)
6. Launch app

**Result:** Live at `https://aurora-apparel-xxxxx.ondigitalocean.app`

---

### Option 6: AWS (EC2 or Elastic Beanstalk)

**EC2 Steps (Manual):**
1. Launch EC2 instance (Ubuntu recommended)
2. SSH into instance
3. Install Node.js:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
4. Clone repository:
   ```bash
   git clone https://github.com/yourusername/aurora-apparel.git
   cd aurora-apparel
   npm install
   ```
5. Install PM2 (process manager):
   ```bash
   sudo npm install -g pm2
   pm2 start server.js --name aurora-apparel
   pm2 startup
   pm2 save
   ```
6. Configure security group to allow port 3000
7. Access via `http://your-ec2-ip:3000`

**Elastic Beanstalk (Simpler):**
1. Install EB CLI: `pip install awsebcli`
2. Initialize: `eb init`
3. Create environment: `eb create aurora-apparel-env`
4. Deploy: `eb deploy`
5. Open: `eb open`

---

## Environment Setup

### Required Environment Variables

Create a `.env` file (never commit this!):

```env
PORT=3000
NODE_ENV=production
```

### Optional Variables

```env
SESSION_SECRET=your-random-secret-key-here
ALLOWED_ORIGINS=https://yourdomain.com
```

---

## Production Checklist

Before going live:

### Security
- [ ] Install security packages: `npm install helmet compression cors`
- [ ] Configure HTTPS (most platforms provide this automatically)
- [ ] Set strong `SESSION_SECRET` environment variable
- [ ] Review and configure Content Security Policy in `helmet`
- [ ] Add rate limiting if needed
- [ ] Disable error stack traces in production

### Performance
- [ ] Enable compression (included in server.js)
- [ ] Configure static file caching
- [ ] Optimize images in `public/images/`
- [ ] Consider using a CDN for static assets
- [ ] Test with multiple concurrent users

### Monitoring
- [ ] Set up error logging (Sentry, LogRocket, etc.)
- [ ] Configure uptime monitoring (UptimeRobot, Pingdom)
- [ ] Set up performance monitoring
- [ ] Configure alerts for downtime

### Testing
- [ ] Test all routes (Home, PLP, PDP, Cart, Checkout, Thank You)
- [ ] Test cart functionality (add, remove, update)
- [ ] Test checkout flow completely
- [ ] Test on multiple devices (mobile, tablet, desktop)
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Verify Adobe Data Layer events fire correctly

### Analytics
- [ ] Add Adobe Launch embed code (see README.md)
- [ ] Configure Launch rules for data layer events
- [ ] Test analytics tracking in production
- [ ] Set up conversion tracking

### Content
- [ ] Replace placeholder images with real product photos
- [ ] Update product descriptions and prices
- [ ] Add more products if needed (edit `products` array in server.js)
- [ ] Customize brand name and colors if desired

### Legal
- [ ] Add Privacy Policy page
- [ ] Add Terms & Conditions page
- [ ] Add shipping and return policies
- [ ] Configure real payment processing (replace fake checkout)

---

## Custom Domain Setup

### With Render
1. Go to "Settings" → "Custom Domain"
2. Add your domain
3. Configure DNS with provided CNAME record

### With Railway
1. Go to "Settings" → "Domains"
2. Add custom domain
3. Update DNS records as instructed

### With Vercel
1. Run: `vercel domains add yourdomain.com`
2. Follow DNS configuration prompts

### General DNS Configuration
Point your domain to the hosting provider:
- **Type:** CNAME
- **Name:** www (or @)
- **Value:** [provided by hosting platform]

---

## Database Migration (Optional)

The current app uses in-memory storage. For production, consider:

### MongoDB Atlas (Free Tier)
1. Create account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create cluster
3. Get connection string
4. Install: `npm install mongoose`
5. Update server.js to use MongoDB

### PostgreSQL (Heroku, Railway, or Supabase)
1. Get database URL from provider
2. Install: `npm install pg`
3. Update server.js to use PostgreSQL

### Firebase/Firestore
1. Create Firebase project
2. Install: `npm install firebase-admin`
3. Configure Firestore for products, cart, orders

---

## Scaling Considerations

As your store grows:

1. **Database:** Switch from in-memory to persistent database
2. **Session Storage:** Use Redis for session management
3. **File Storage:** Use S3 or Cloudinary for product images
4. **Caching:** Implement Redis caching for product data
5. **Load Balancing:** Use multiple instances with a load balancer
6. **CDN:** Serve static assets via CloudFront or Cloudflare

---

## Troubleshooting

### App won't start
- Check Node.js version: `node --version` (should be 14+)
- Verify all dependencies: `npm install`
- Check PORT environment variable

### 502 Bad Gateway
- Ensure app is listening on correct PORT
- Check if process is running: `pm2 list` (if using PM2)
- Review application logs

### Slow performance
- Enable compression (already configured)
- Optimize images
- Use CDN for static files
- Consider upgrading hosting plan

### Cart not persisting
- Check if cookies are enabled
- Verify cookie settings in production (secure, sameSite)
- Consider using database for cart persistence

---

## Support & Resources

- **Render Docs:** https://render.com/docs
- **Railway Docs:** https://docs.railway.app
- **Heroku Docs:** https://devcenter.heroku.com
- **Node.js Best Practices:** https://github.com/goldbergyoni/nodebestpractices

---

## Next Steps After Deployment

1. Share your live URL!
2. Test all functionality in production
3. Add Adobe Launch tracking code
4. Set up monitoring and alerts
5. Gather user feedback
6. Iterate and improve

**Your Aurora Apparel store is ready to go live! 🚀**
