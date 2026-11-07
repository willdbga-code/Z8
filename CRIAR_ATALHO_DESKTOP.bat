@echo off
set SCRIPT="%TEMP%\%RANDOM%-%RANDOM%_shortcut.vbs"
echo Set oWS = WScript.CreateObject("WScript.Shell") >> %SCRIPT%
echo sLinkFile = oWS.SpecialFolders("Desktop") ^& "\Z8 WMS.lnk" >> %SCRIPT%
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> %SCRIPT%
echo oLink.TargetPath = "%~dp0z8-wms\dist-app\Z8-WMS-win32-x64\Z8-WMS.exe" >> %SCRIPT%
echo oLink.WorkingDirectory = "%~dp0z8-wms\dist-app\Z8-WMS-win32-x64" >> %SCRIPT%
echo oLink.Description = "Z8 E-Motion // Warehouse Management System & Oficina Tecnica" >> %SCRIPT%
echo oLink.IconLocation = "%~dp0z8-wms\assets\logos\z8_wms_icon.ico,0" >> %SCRIPT%
echo oLink.Save >> %SCRIPT%
cscript /nologo %SCRIPT%
del %SCRIPT%
echo ================================================================
echo   Atalho Z8 WMS criado com sucesso na sua Area de Trabalho!
echo ================================================================
ping -n 2 127.0.0.1 >nul
exit
