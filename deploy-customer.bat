@echo off
echo 🚀 Preparing SAPT Markets Customer App for Deployment...

REM Navigate to customer directory
cd customer

REM Remove node_modules if it exists
echo 📦 Cleaning up node_modules...
if exist node_modules rmdir /s /q node_modules

REM Remove dist folder if it exists
echo 🗂️ Cleaning up build folder...
if exist .next rmdir /s /q .next

REM Remove any existing git repository
echo 🔧 Removing existing git repository...
if exist .git rmdir /s /q .git

REM Initialize new git repository
echo 📝 Initializing new git repository...
git init

REM Add all files except those in .gitignore
echo 📁 Adding files to git...
git add .

REM Create initial commit
echo 💾 Creating initial commit...
git commit -m "Initial commit: SAPT Markets Customer App"

REM Add remote repository
echo 🔗 Adding remote repository...
git remote add origin https://github.com/saptmarkets/e-commerce_customer.git

REM Push to main branch
echo 🚀 Pushing to GitHub...
git branch -M main
git push -u origin main --force

echo ✅ Customer app successfully pushed to GitHub!
echo 🌐 Repository: https://github.com/saptmarkets/e-commerce_customer.git
echo.
echo 📋 Next Steps:
echo 1. Go to Vercel Dashboard: https://vercel.com/dashboard
echo 2. Click 'New Project'
echo 3. Import the repository: saptmarkets/e-commerce_customer
echo 4. Configure environment variables
echo 5. Deploy!
echo.
echo 📝 Environment Variables to set on Vercel:
echo - NEXT_PUBLIC_API_BASE_URL: https://e-commerce-backend-l0s0.onrender.com/api
echo - NEXTAUTH_SECRET: saptmarkets-customer-nextauth-secret-key-2024
echo - NEXTAUTH_URL: https://your-customer-domain.vercel.app
pause 