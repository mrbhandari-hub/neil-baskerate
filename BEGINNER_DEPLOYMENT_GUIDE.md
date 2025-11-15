# Complete Beginner's Guide to Deploying Your Website

This guide will walk you through every single step to get your website online with a custom domain. Don't worry if you're new to this - I'll explain everything!

---

## 📋 What You'll Need

1. A computer with your code (you have this!)
2. A GitHub account (free - we'll create it)
3. A Vercel account (free - we'll create it)
4. A domain name (we'll buy one together)

**Total Cost:** ~$10-15/year for a domain (everything else is free!)

---

## Part 1: Setting Up Git (Version Control)

Git helps you save and share your code. Think of it like Google Drive for code.

### Step 1.1: Check if Git is installed

1. Open Terminal (on Mac: Press `Cmd + Space`, type "Terminal", press Enter)
2. Type this command and press Enter:
   ```bash
   git --version
   ```
3. If you see a version number (like `git version 2.x.x`), you're good! Skip to Step 1.3
4. If you see "command not found", continue to Step 1.2

### Step 1.2: Install Git (if needed)

**On Mac:**
1. Go to [git-scm.com/download/mac](https://git-scm.com/download/mac)
2. Download and install Git
3. Or install Xcode Command Line Tools by running:
   ```bash
   xcode-select --install
   ```

**On Windows:**
1. Go to [git-scm.com/download/win](https://git-scm.com/download/win)
2. Download and install Git
3. During installation, use all default options

### Step 1.3: Configure Git with your name and email

In Terminal, run these commands (replace with YOUR name and email):

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

**Example:**
```bash
git config --global user.name "John Doe"
git config --global user.email "john@example.com"
```

Press Enter after each command. You won't see any output - that's normal!

---

## Part 2: Creating a GitHub Account and Repository

GitHub is where we'll store your code online (like Dropbox for code).

### Step 2.1: Create a GitHub Account

1. Go to [github.com](https://github.com)
2. Click "Sign up" (top right)
3. Enter:
   - Username (choose something you like, e.g., "johndoe-dev")
   - Email address
   - Password
4. Verify your email address (check your inbox)
5. Complete the setup questions (you can skip most of them)

### Step 2.2: Create a New Repository

1. Once logged into GitHub, click the **"+"** icon (top right)
2. Click **"New repository"**
3. Fill in:
   - **Repository name:** `neil-baskerate` (or any name you like)
   - **Description:** "My basketball drawing app" (optional)
   - **Visibility:** Choose **"Public"** (free accounts can have unlimited public repos)
   - **DO NOT** check "Add a README file" (we already have code)
   - **DO NOT** add .gitignore or license (we'll use what we have)
4. Click **"Create repository"**

### Step 2.3: Copy Your Repository URL

After creating the repository, GitHub will show you a page with setup instructions. You'll see a URL that looks like:
```
https://github.com/yourusername/neil-baskerate.git
```

**Copy this URL** - you'll need it in the next step!

---

## Part 3: Uploading Your Code to GitHub

Now we'll upload your code to GitHub.

### Step 3.1: Open Terminal in Your Project Folder

1. Open Terminal
2. Navigate to your project folder by typing:
   ```bash
   cd /Users/rahulbhandari/neil-baskerate
   ```
   Press Enter

### Step 3.2: Initialize Git in Your Project

Run these commands one by one (press Enter after each):

```bash
git init
```

This creates a Git repository in your folder.

### Step 3.3: Add All Your Files

```bash
git add .
```

This tells Git to track all your files. The `.` means "everything in this folder".

### Step 3.4: Create Your First Commit

```bash
git commit -m "Initial commit - my basketball app"
```

This saves a snapshot of your code. The message describes what you're saving.

### Step 3.5: Connect to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

**Replace `YOUR_USERNAME` and `YOUR_REPO_NAME`** with your actual GitHub username and repository name!

**Example:**
```bash
git remote add origin https://github.com/johndoe/neil-baskerate.git
```

### Step 3.6: Push Your Code to GitHub

```bash
git branch -M main
git push -u origin main
```

You'll be asked for your GitHub username and password. 
- **Username:** Your GitHub username
- **Password:** Use a **Personal Access Token** (not your regular password - see below)

#### Creating a Personal Access Token (GitHub Password):

1. Go to GitHub.com → Click your profile picture (top right) → **Settings**
2. Scroll down → Click **"Developer settings"** (left sidebar)
3. Click **"Personal access tokens"** → **"Tokens (classic)"**
4. Click **"Generate new token"** → **"Generate new token (classic)"**
5. Give it a name: "My Computer"
6. Select expiration: "90 days" (or "No expiration" if you prefer)
7. Check the box: **"repo"** (this gives access to repositories)
8. Scroll down → Click **"Generate token"**
9. **COPY THE TOKEN IMMEDIATELY** (you won't see it again!)
10. Use this token as your password when pushing code

After entering your credentials, your code will upload to GitHub! 🎉

**Verify:** Go to your GitHub repository page - you should see all your files there!

---

## Part 4: Deploying to Vercel (Making It Live)

Vercel will host your website and make it accessible to everyone on the internet.

### Step 4.1: Create a Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Click **"Continue with GitHub"** (easiest option)
4. Authorize Vercel to access your GitHub account
5. Complete your profile (you can skip most fields)

### Step 4.2: Import Your Project

1. Once logged into Vercel, click **"Add New..."** → **"Project"**
2. You'll see a list of your GitHub repositories
3. Find **"neil-baskerate"** (or whatever you named it)
4. Click **"Import"** next to it

### Step 4.3: Configure Your Project

Vercel will auto-detect your project settings. You should see:
- **Framework Preset:** Vite
- **Root Directory:** `./` (leave as is)
- **Build Command:** `npm run build` (should be auto-filled)
- **Output Directory:** `dist` (should be auto-filled)
- **Install Command:** `npm install` (should be auto-filled)

**Don't change anything** - just click **"Deploy"**!

### Step 4.4: Wait for Deployment

Vercel will:
1. Install your dependencies
2. Build your project
3. Deploy it to the internet

This takes about 1-2 minutes. You'll see a progress log.

### Step 4.5: Your Site is Live! 🎉

Once deployment completes, you'll see:
- ✅ "Congratulations! Your project has been deployed"
- A URL like: `neil-baskerate.vercel.app`

**Click the URL** - your website is now live on the internet!

**Note:** Every time you push code to GitHub, Vercel will automatically redeploy your site!

---

## Part 5: Buying and Connecting a Custom Domain

Now let's get your own domain name (like `yourname.com` instead of `neil-baskerate.vercel.app`).

### Step 5.1: Choose a Domain Registrar

Popular options:
- **Namecheap** - Good prices, easy to use
- **Google Domains** - Simple interface
- **Cloudflare Registrar** - Very cheap, no markup
- **GoDaddy** - Popular but can be expensive

**I recommend Namecheap or Cloudflare for beginners.**

### Step 5.2: Buy Your Domain

1. Go to your chosen registrar (e.g., [namecheap.com](https://namecheap.com))
2. Search for a domain name (e.g., "mybasketballapp.com")
3. Add it to cart and checkout
4. Complete the purchase (~$10-15/year for .com domains)

**Tips for choosing a domain:**
- Keep it short and memorable
- Use .com if available (most trusted)
- Avoid hyphens and numbers if possible

### Step 5.3: Connect Domain to Vercel

1. Go back to your Vercel project dashboard
2. Click on your project name
3. Go to **"Settings"** tab (top menu)
4. Click **"Domains"** (left sidebar)
5. In the "Add Domain" field, enter your domain (e.g., `yourdomain.com`)
6. Click **"Add"**

### Step 5.4: Configure DNS Settings

Vercel will show you DNS configuration options. Choose one:

#### Option A: Using Vercel's Nameservers (Easiest)

1. Vercel will show you nameservers (like `ns1.vercel-dns.com`)
2. Go to your domain registrar's website
3. Find "DNS Settings" or "Nameservers"
4. Replace the default nameservers with Vercel's nameservers
5. Save changes
6. Wait 5-60 minutes for DNS to propagate

#### Option B: Using DNS Records (More Control)

1. In Vercel, choose "Add DNS Record" instead
2. Vercel will show you a CNAME or A record to add
3. Go to your domain registrar's DNS settings
4. Add the record Vercel provided:
   - **Type:** CNAME (or A)
   - **Name:** @ (or leave blank for root domain)
   - **Value:** The value Vercel shows you
5. Save changes
6. Wait 5-60 minutes

### Step 5.5: Wait for SSL Certificate

Vercel automatically creates an SSL certificate (the padlock icon in browsers). This usually takes a few minutes after DNS propagates.

### Step 5.6: Test Your Domain

1. Wait 10-60 minutes for DNS to update
2. Visit your domain in a browser (e.g., `yourdomain.com`)
3. Your site should load! 🎉

**Note:** If it doesn't work immediately, wait a bit longer - DNS changes can take up to 24 hours (but usually much faster).

---

## Part 6: Making Updates to Your Site

Whenever you want to update your website:

1. Make changes to your code
2. In Terminal, navigate to your project:
   ```bash
   cd /Users/rahulbhandari/neil-baskerate
   ```
3. Add your changes:
   ```bash
   git add .
   ```
4. Commit your changes:
   ```bash
   git commit -m "Description of what you changed"
   ```
5. Push to GitHub:
   ```bash
   git push
   ```
6. Vercel will automatically detect the change and redeploy your site (takes 1-2 minutes)

---

## 🆘 Troubleshooting

### "Git command not found"
- Install Git (see Step 1.2)

### "Permission denied" when pushing to GitHub
- Make sure you're using a Personal Access Token, not your password
- Check that the token has "repo" permissions

### "Build failed" on Vercel
- Check the build logs in Vercel dashboard
- Make sure `npm run build` works locally first
- Common issues: missing dependencies, syntax errors

### Domain not working
- Wait longer (DNS can take up to 24 hours)
- Double-check DNS settings match Vercel's instructions exactly
- Try clearing your browser cache
- Check if DNS has propagated: [whatsmydns.net](https://www.whatsmydns.net)

### Site shows "404" or blank page
- Make sure you're visiting the root domain (e.g., `yourdomain.com`)
- Check Vercel deployment logs for errors
- Verify the build completed successfully

---

## ✅ Checklist

- [ ] Git installed and configured
- [ ] GitHub account created
- [ ] Repository created on GitHub
- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Project deployed to Vercel
- [ ] Domain purchased
- [ ] Domain connected to Vercel
- [ ] DNS configured
- [ ] Site accessible at custom domain

---

## 🎉 Congratulations!

You now have:
- ✅ Your code on GitHub (backed up and version controlled)
- ✅ Your website live on the internet
- ✅ A custom domain name
- ✅ Automatic deployments when you update code
- ✅ Free SSL certificate (secure connection)

**Your website is now live at your custom domain!**

---

## Need Help?

If you get stuck at any step, let me know which step you're on and what error message you're seeing, and I'll help you troubleshoot!

