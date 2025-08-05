@echo off
echo 🚀 Preparing SAPT Markets Backend for Deployment...

REM Navigate to backend directory
cd backend

REM Remove node_modules if it exists
echo 📦 Cleaning up node_modules...
if exist node_modules rmdir /s /q node_modules

REM Remove any existing git repository
echo 🔧 Removing existing git repository...
if exist .git rmdir /s /q .git

REM Initialize new git repository
echo 📝 Initializing new git repository...
git init

REM Create or update .gitignore for backend
echo 🔒 Creating backend .gitignore...
echo # Node modules > .gitignore
echo node_modules/ >> .gitignore
echo npm-debug.log* >> .gitignore
echo yarn-debug.log* >> .gitignore
echo yarn-error.log* >> .gitignore
echo .npm >> .gitignore
echo .yarn-integrity >> .gitignore
echo # Environment files >> .gitignore
echo .env >> .gitignore
echo .env.local >> .gitignore
echo .env.development.local >> .gitignore
echo .env.test.local >> .gitignore
echo .env.production.local >> .gitignore
echo # Runtime data >> .gitignore
echo pids >> .gitignore
echo *.pid >> .gitignore
echo *.seed >> .gitignore
echo *.pid.lock >> .gitignore
echo # Coverage directory used by tools like istanbul >> .gitignore
echo coverage/ >> .gitignore
echo .nyc_output >> .gitignore
echo # Logs >> .gitignore
echo logs >> .gitignore
echo *.log >> .gitignore
echo npm-debug.log* >> .gitignore
echo yarn-debug.log* >> .gitignore
echo yarn-error.log* >> .gitignore
echo lerna-debug.log* >> .gitignore
echo # OS generated files >> .gitignore
echo .DS_Store >> .gitignore
echo .DS_Store? >> .gitignore
echo ._* >> .gitignore
echo .Spotlight-V100 >> .gitignore
echo .Trashes >> .gitignore
echo ehthumbs.db >> .gitignore
echo Thumbs.db >> .gitignore
echo # IDE files >> .gitignore
echo .vscode/ >> .gitignore
echo .idea/ >> .gitignore
echo *.swp >> .gitignore
echo *.swo >> .gitignore
echo *~ >> .gitignore

REM Add all backend files except those in .gitignore
echo 📁 Adding backend files to git...
git add .

REM Create initial commit
echo 💾 Creating initial commit...
git commit -m "Initial commit: SAPT Markets Backend API"

REM Add remote repository for backend
echo 🔗 Adding backend remote repository...
git remote add origin https://github.com/saptmarkets/e-commerce_backend.git

REM Push to main branch
echo 🚀 Pushing to GitHub...
git branch -M main
git push -u origin main --force

echo ✅ Backend successfully pushed to GitHub!
echo 🌐 Repository: https://github.com/saptmarkets/e-commerce_backend.git
echo.
echo 📋 Next Steps:
echo 1. Go to your deployment platform (Railway, Render, Heroku)
echo 2. Connect the GitHub repository: saptmarkets/e-commerce_backend
echo 3. Configure environment variables
echo 4. Deploy!
echo.
echo 🔗 Deployment Platforms:
echo - Railway: https://railway.app
echo - Render: https://render.com
echo - Heroku: https://heroku.com
pause 