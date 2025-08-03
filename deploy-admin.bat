@echo off
echo 🚀 Preparing SAPT Markets Admin App for Deployment...

REM Navigate to admin directory
cd admin

REM Remove node_modules if it exists
echo 📦 Cleaning up node_modules...
if exist node_modules rmdir /s /q node_modules

REM Remove dist folder if it exists
echo 🗂️ Cleaning up build folder...
if exist dist rmdir /s /q dist

REM Remove any existing git repository to start fresh
echo 🔧 Removing existing git repository...
if exist .git rmdir /s /q .git

REM Initialize new git repository
echo 📝 Initializing new git repository...
git init

REM Create or update .gitignore for admin
echo 🔒 Creating admin .gitignore...
echo # Dependencies > .gitignore
echo node_modules/ >> .gitignore
echo npm-debug.log* >> .gitignore
echo yarn-debug.log* >> .gitignore
echo yarn-error.log* >> .gitignore
echo .npm >> .gitignore
echo .yarn-integrity >> .gitignore
echo # Build outputs >> .gitignore
echo dist/ >> .gitignore
echo build/ >> .gitignore
echo .next/ >> .gitignore
echo # Environment files >> .gitignore
echo .env >> .gitignore
echo .env.local >> .gitignore
echo .env.development.local >> .gitignore
echo .env.test.local >> .gitignore
echo .env.production.local >> .gitignore
echo # Editor files >> .gitignore
echo .DS_Store >> .gitignore
echo .vscode/ >> .gitignore
echo .idea/ >> .gitignore
echo # Logs >> .gitignore
echo *.log >> .gitignore
echo logs/ >> .gitignore

REM Add all files except those in .gitignore
echo 📁 Adding files to git...
git add .

REM Create initial commit
echo 💾 Creating initial commit...
git commit -m "Clean deployment: SAPT Markets Admin App - Latest with Odoo sync improvements"

REM Rename branch to main
echo 🔄 Setting branch to main...
git branch -M main

REM Add remote repository
echo 🌐 Adding remote repository...
git remote add origin https://github.com/saptmarkets/e-commerce_admin.git

REM Force push to overwrite existing repository with clean files
echo 🚀 Force pushing to clean admin repository...
git push origin main --force

echo ✅ Admin deployment completed successfully!
echo 📦 Repository: https://github.com/saptmarkets/e-commerce_admin
echo 🎯 Only admin files have been deployed

cd ..
pause 