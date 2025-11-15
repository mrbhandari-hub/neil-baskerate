#!/bin/bash

# Deployment Helper Script
# This script helps you push your code to GitHub

echo "🚀 Deployment Helper"
echo "==================="
echo ""

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo "❌ Error: Not a git repository!"
    echo "Run: git init"
    exit 1
fi

# Check if remote is set
if ! git remote get-url origin &> /dev/null; then
    echo "⚠️  No GitHub remote configured yet."
    echo ""
    echo "First, create a repository on GitHub, then run:"
    echo "  git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
    echo ""
    read -p "Do you want to add a remote now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter your GitHub repository URL: " repo_url
        git remote add origin "$repo_url"
        echo "✅ Remote added!"
    else
        exit 1
    fi
fi

# Build the project first
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix errors before deploying."
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Add all changes
echo "📝 Staging changes..."
git add .

# Commit
read -p "Enter commit message (or press Enter for default): " commit_msg
if [ -z "$commit_msg" ]; then
    commit_msg="Update: $(date '+%Y-%m-%d %H:%M:%S')"
fi

git commit -m "$commit_msg"

# Push to GitHub
echo ""
echo "🚀 Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo "🌐 Vercel will automatically deploy your changes in 1-2 minutes."
    echo ""
    echo "Check your Vercel dashboard to see the deployment status."
else
    echo ""
    echo "❌ Push failed. Common issues:"
    echo "   - Make sure you have a Personal Access Token set up"
    echo "   - Check that your GitHub repository exists"
    echo "   - Verify your remote URL is correct"
fi

