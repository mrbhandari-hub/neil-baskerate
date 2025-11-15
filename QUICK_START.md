# Quick Start - Copy & Paste These Commands

Follow these commands in order. Copy each command, paste it into Terminal, and press Enter.

## Step 1: Configure Git (Do this once on your computer)

Replace with YOUR information:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Step 2: After creating your GitHub repository, run these:

**Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub info!**

```bash
cd /Users/rahulbhandari/neil-baskerate
git add .
git commit -m "Initial commit - my basketball app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

**Example:**
If your GitHub username is `johndoe` and your repo is `neil-baskerate`, the remote command would be:
```bash
git remote add origin https://github.com/johndoe/neil-baskerate.git
```

## Step 3: When pushing, use:
- **Username:** Your GitHub username
- **Password:** Your Personal Access Token (see guide for how to create one)

---

## For Future Updates:

Whenever you make changes to your code:

```bash
cd /Users/rahulbhandari/neil-baskerate
git add .
git commit -m "Describe what you changed"
git push
```

That's it! Vercel will automatically update your website.

