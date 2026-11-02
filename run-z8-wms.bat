@echo off
title Z8 WMS // WAREHOUSE MANAGEMENT SYSTEM
cls
echo ================================================================
echo    Z8 E-MOTION // WAREHOUSE MANAGEMENT SYSTEM (WMS)
echo    Sistema Oficial de Gestao de Estoque, Chassis e Oficina
echo ================================================================
echo.

cd /d "%~dp0\z8-wms"
call run-wms.bat
