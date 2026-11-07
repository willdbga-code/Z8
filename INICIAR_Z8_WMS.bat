@echo off
title Z8 WMS // WAREHOUSE MANAGEMENT SYSTEM
cls
echo ================================================================
echo    Z8 E-MOTION // WMS EXECUTAVEL DESKTOP
echo    Iniciando Cockpit Operacional e Oficina Tecnica...
echo ================================================================
cd /d "%~dp0z8-wms\dist-app\Z8-WMS-win32-x64"
start "" "Z8-WMS.exe"
exit
