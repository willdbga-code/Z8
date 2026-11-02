@echo off
title Z8 WMS // WAREHOUSE MANAGEMENT SYSTEM
cls
echo ================================================================
echo    Z8 E-MOTION // WAREHOUSE MANAGEMENT SYSTEM (WMS)
echo    Sistema Oficial de Gestao de Estoque, Chassis e Oficina
echo    CNPJ: 68.774.164/0001-00 // Sao Jose dos Campos - SP
echo ================================================================
echo.

cd /d "%~dp0"

echo [1/2] Iniciando Servidor Local Z8 WMS na porta 3300...
start /b "" node server.cjs

timeout /t 2 /nobreak >nul

echo [2/2] Abrindo Cockpit Executivo Z8 em Modo Aplicativo Nativo...
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --app=http://localhost:3300 --window-size=1440,900
) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --app=http://localhost:3300 --window-size=1440,900
) else if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --app=http://localhost:3300 --window-size=1440,900
) else (
    start http://localhost:3300
)

echo.
echo ================================================================
echo  Cockpit Operacional ativo em:  http://localhost:3300
echo  Scanner Mobile disponivel na rede Wi-Fi local!
echo ================================================================
echo.
pause
