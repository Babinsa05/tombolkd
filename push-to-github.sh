#!/bin/bash

# Script untuk push PWA ke GitHub Pages

echo "🚀 Memulai deployment Udayana Portal PWA..."

# Setup git jika belum
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
fi

# Tambahkan remote jika belum
if ! git remote | grep -q "origin"; then
    echo "🔗 Adding GitHub remote..."
    git remote add origin https://github.com/babinsa05/tombol2.git
fi

# Pull perubahan terbaru
echo "📥 Pulling latest changes..."
git pull origin main --rebase

# Tambahkan semua file
echo "📁 Adding files..."
git add index.html
git add sw.js
git add push-to-github.sh

# Buat commit
echo "💾 Committing changes..."
git commit -m "Deploy PWA Udayana Portal with Service Worker & APK support

- Added Service Worker for offline capability
- Added PWA installation support
- Added APK download button
- Optimized for GitHub Pages
- Added manifest and icons
- Improved error handling"

# Push ke GitHub
echo "🚀 Pushing to GitHub..."
git push -u origin main

echo "✅ Deployment selesai!"
echo "🌐 Aplikasi akan tersedia di: https://babinsa05.github.io/tombol2/"
echo ""
echo "📋 Checklist PWA:"
echo "1. ✅ Service Worker terdaftar"
echo "2. ✅ Manifest terpasang"
echo "3. ✅ Icons tersedia"
echo "4. ✅ APK download button"
echo "5. ✅ Offline support"
echo ""
echo "🔧 Testing:"
echo "- Buka https://babinsa05.github.io/tombol2/"
echo "- Klik 'Add to Home Screen' (PWA)"
echo "- Klik 'Download APK' untuk versi native"
echo "- Coba mode offline"
