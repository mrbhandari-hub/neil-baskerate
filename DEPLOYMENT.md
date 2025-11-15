# Deployment Guide

This guide covers the easiest ways to deploy your React + Vite app to a custom domain.

## Option 1: Vercel (Recommended - Easiest)

**Why Vercel?**
- ✅ Free tier with generous limits
- ✅ Automatic deployments from Git
- ✅ Easy custom domain setup
- ✅ Built-in SSL certificates
- ✅ Optimized for React/Vite apps
- ✅ Zero configuration needed

### Steps:

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com) and sign up (free)
   - Click "Add New Project"
   - Import your Git repository
   - Vercel will auto-detect it's a Vite project
   - Click "Deploy" (no configuration needed!)

3. **Add Custom Domain:**
   - In your Vercel project dashboard, go to "Settings" → "Domains"
   - Click "Add Domain"
   - Enter your domain name (e.g., `yourdomain.com`)
   - Follow the DNS configuration instructions:
     - Add a CNAME record pointing to `cname.vercel-dns.com`
     - Or add an A record with the IP address Vercel provides
   - Vercel automatically provisions SSL certificates

4. **Buy a Domain (if you haven't):**
   - Popular options: Namecheap, Google Domains, Cloudflare Registrar, GoDaddy
   - After purchase, update your domain's DNS settings as instructed by Vercel

**Cost:** Free for hobby projects, ~$20/month for domains

---

## Option 2: Netlify

**Why Netlify?**
- ✅ Free tier available
- ✅ Drag-and-drop deployment option
- ✅ Easy custom domain setup
- ✅ Built-in form handling, serverless functions

### Steps:

1. **Push to Git** (same as Vercel step 1)

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com) and sign up
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository
   - Build settings (auto-detected):
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Click "Deploy site"

3. **Add Custom Domain:**
   - Go to "Domain settings" → "Add custom domain"
   - Enter your domain
   - Configure DNS as instructed

**Cost:** Free tier available, domain costs separate

---

## Option 3: Cloudflare Pages

**Why Cloudflare Pages?**
- ✅ Completely free (including bandwidth)
- ✅ Fast global CDN
- ✅ Easy Git integration
- ✅ Can buy domain directly from Cloudflare

### Steps:

1. **Push to Git** (same as above)

2. **Deploy to Cloudflare Pages:**
   - Go to [pages.cloudflare.com](https://pages.cloudflare.com)
   - Sign up/login
   - Click "Create a project" → "Connect to Git"
   - Select your repository
   - Build settings:
     - Framework preset: Vite
     - Build command: `npm run build`
     - Build output directory: `dist`
   - Click "Save and Deploy"

3. **Add Custom Domain:**
   - In project settings → "Custom domains"
   - Add your domain
   - Update DNS records as shown

**Cost:** Free, domain costs separate (or buy from Cloudflare)

---

## Option 4: GitHub Pages (Free but more setup)

**Why GitHub Pages?**
- ✅ Completely free
- ✅ Works with GitHub repositories
- ⚠️ Requires more configuration

### Steps:

1. **Install gh-pages package:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json:**
   Add to scripts:
   ```json
   "deploy": "npm run build && gh-pages -d dist"
   ```

3. **Update vite.config.js:**
   ```js
   export default defineConfig({
     plugins: [react()],
     base: '/your-repo-name/' // or '/' for custom domain
   })
   ```

4. **Deploy:**
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages:**
   - Go to repo Settings → Pages
   - Select source branch: `gh-pages`
   - For custom domain, add CNAME file in `public/` folder

---

## Quick Comparison

| Platform | Ease of Use | Free Tier | Custom Domain | Best For |
|----------|-------------|-----------|---------------|----------|
| **Vercel** | ⭐⭐⭐⭐⭐ | ✅ Yes | ✅ Easy | React/Vite apps |
| **Netlify** | ⭐⭐⭐⭐ | ✅ Yes | ✅ Easy | Static sites |
| **Cloudflare Pages** | ⭐⭐⭐⭐ | ✅ Yes | ✅ Easy | High traffic |
| **GitHub Pages** | ⭐⭐⭐ | ✅ Yes | ⚠️ Medium | Simple sites |

---

## Recommended: Vercel Setup

If you want the easiest path, I can help you:
1. Set up a Vercel configuration file
2. Prepare your project for deployment
3. Guide you through the domain purchase and setup

Just let me know if you'd like me to set this up!

