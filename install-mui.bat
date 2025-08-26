@echo off
echo Installing Material-UI dependencies...
cd store-fe
npm uninstall antd
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
echo Material-UI installation complete!
echo.
echo Please restart your development server after installation.
pause