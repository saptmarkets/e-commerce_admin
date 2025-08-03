@echo off
echo =====================================
echo   SAPT Markets - Master Deployment
echo =====================================
echo.
echo This script will deploy each component to its dedicated GitHub repository:
echo 📦 Backend  → https://github.com/saptmarkets/e-commerce_backend
echo 🎛️ Admin    → https://github.com/saptmarkets/e-commerce_admin  
echo 👥 Customer → https://github.com/saptmarkets/e-commerce_customer
echo.
echo ⚠️  WARNING: This will FORCE PUSH and overwrite existing repositories!
echo.

:menu
echo =====================================
echo   Choose deployment option:
echo =====================================
echo [1] Deploy Backend Only
echo [2] Deploy Admin Only  
echo [3] Deploy Customer Only
echo [4] Deploy All Components
echo [5] Exit
echo.
set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto deploy_backend
if "%choice%"=="2" goto deploy_admin
if "%choice%"=="3" goto deploy_customer
if "%choice%"=="4" goto deploy_all
if "%choice%"=="5" goto exit
echo Invalid choice. Please try again.
goto menu

:deploy_backend
echo.
echo 🚀 DEPLOYING BACKEND...
call deploy-backend.bat
echo.
echo ✅ Backend deployment completed!
pause
goto menu

:deploy_admin
echo.
echo 🚀 DEPLOYING ADMIN...
call deploy-admin.bat
echo.
echo ✅ Admin deployment completed!
pause
goto menu

:deploy_customer
echo.
echo 🚀 DEPLOYING CUSTOMER...
call deploy-customer.bat
echo.
echo ✅ Customer deployment completed!
pause
goto menu

:deploy_all
echo.
echo 🚀 DEPLOYING ALL COMPONENTS...
echo.
echo ⏰ This will take a few minutes...
echo.

echo [1/3] Deploying Backend...
call deploy-backend.bat
echo.

echo [2/3] Deploying Admin...
call deploy-admin.bat  
echo.

echo [3/3] Deploying Customer...
call deploy-customer.bat
echo.

echo =====================================
echo   🎉 ALL DEPLOYMENTS COMPLETED!
echo =====================================
echo.
echo 📦 Backend:  https://github.com/saptmarkets/e-commerce_backend
echo 🎛️ Admin:    https://github.com/saptmarkets/e-commerce_admin
echo 👥 Customer: https://github.com/saptmarkets/e-commerce_customer
echo.
echo 📋 Next Steps:
echo 1. Deploy Backend to your hosting platform (Railway/Render/Heroku)
echo 2. Deploy Admin to Vercel (should auto-deploy from GitHub)
echo 3. Deploy Customer to Vercel (should auto-deploy from GitHub)
echo.
pause
goto menu

:exit
echo.
echo 👋 Goodbye!
pause
exit 