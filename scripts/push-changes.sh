#!/bin/bash

# Configure git
git config user.email "v0@vercel.com"
git config user.name "v0"

# Add all changes
git add .

# Commit changes
git commit -m "feat: add logo to navbar and footer, fix admin link removal, add updateContact function"

# Push to the current branch
git push origin add-logo-to-website

echo "✅ Changes pushed successfully to add-logo-to-website branch!"
