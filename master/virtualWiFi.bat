@ECHO OFF
SETLOCAL

:mainmenu
CALL :init
IF NOT "%~1"=="" (
  CALL :cmdLineParam %*
  GOTO end
)
CALL :getSSID
ECHO.
ECHO -------------------------------------------------
ECHO %~n0
ECHO Manage the Hosted network of Microsoft Windows(R)
ECHO -------------------------------------------------
ECHO 1 Get SSID Name
ECHO 2 Set SSID (curent: "%_txtSSID%")
ECHO 3 Set Key Passphrase (curent: %_txtPassphrase%)
ECHO 4 Service: Start
ECHO 5 Service: Stop
ECHO 6 Service: Restart
ECHO 7 Show service status (current: %_txtStatus%)
ECHO 8 Help
ECHO 0 Exit
ECHO -------------------------------------------------
SET /P _code=Enter the choise [0]: 
IF NOT DEFINED _code GOTO end
IF "%_code%"==""  GOTO end
IF "%_code%"=="0" GOTO end
IF "%_code%"=="1" CALL :getSSID
IF "%_code%"=="2" CALL :setSSID
IF "%_code%"=="3" CALL :setPassphrase
IF "%_code%"=="4" CALL :service start
IF "%_code%"=="5" CALL :service stop
IF "%_code%"=="6" CALL :service restart
IF "%_code%"=="7" CALL :service show
IF "%_code%"=="8" CALL :help
ECHO.
GOTO mainmenu

:end
ENDLOCAL
GOTO :EOF

:init
SET _code=
SET _cmd=
SET _txtSSID=%_SSID%
IF NOT DEFINED _txtSSID SET _txtSSID=N/A
SET _txtPassphrase=%_Passphrase%
IF NOT DEFINED _txtPassphrase SET _txtPassphrase=N/A
SET _cmd=netsh wlan ##CMD## hostednetwork
CALL :getStatus
GOTO :EOF

:getStatus
SET _txtStatus=
SET _parseParam=Status
SET _parseVar=_txtStatus
FOR /F "usebackq delims=" %%A IN (`%_cmd:##CMD##=show%`) DO CALL :parseSetting %%~A
FOR %%A IN (Param Var) DO SET _parse%%A=
GOTO :EOF

:getSSID
SET _parseParam=SSID name
SET _parseVar=_SSID
FOR /F "usebackq delims=" %%A IN (`%_cmd:##CMD##=show%`) DO CALL :parseSetting %%~A
SET _txtSSID=%_SSID%
FOR %%A IN (Param Var) DO SET _parse%%A=
GOTO :EOF

:setSSID
SET /P _SSID=Enter the SSID Name [%_txtSSID%]: 
IF "%_SSID%"=="" SET _SSID=
IF NOT DEFINED _SSID SET _SSID=%_txtSSID%
IF "%_SSID%"=="%_txtSSID%" GOTO :EOF
ECHO This will set the SSID into: %_SSID%
%_cmd:##CMD##=set% mode=allow ssid="%_SSID%"
GOTO :EOF

:setPassphrase
IF NOT DEFINED _SSID (
  ECHO No SSID defined yet.
  CALL :setSSID
  GOTO :EOF
)
SET _Passphrase=
SET /P _Passphrase=Enter the user Key Passphrase Name [8-63 chars] : 
SET _txtPassphrase=#%_Passphrase%#
IF "%_Passphrase%"=="" SET _Passphrase=
IF NOT "%_txtPassphrase:~1,8%"=="%_Passphrase:~0,8%" SET _Passphrase=
IF NOT DEFINED _Passphrase CALL :setPassphrase
SET _txtPassphrase=
ECHO This will set the Key Passphrase of %_SSID% into: %_Passphrase%
%_cmd:##CMD##=set% key="%_Passphrase%" keyUsage=persistent
ECHO.
GOTO :EOF

:service
SET _param=
IF /I "%~1"=="restart" (
  CALL :service stop
  CALL :service start
  SET _param=service %~1
)
FOR %%A IN (start stop show) DO IF /I "%~1"=="%%~A" (
  SET _param=service %%~A
  CALL %%_cmd:##CMD##=%%~A%%
)
GOTO :EOF

:parseSetting
SET _txtSetting=%*
IF NOT DEFINED _parseParam GOTO :EOF
IF NOT DEFINED _txtSetting GOTO :EOF
IF /I "%_txtSetting:~0,9%"=="%_parseParam%" SET %_parseVar%=%_txtSetting:~26,-1%
IF /I "%_txtSetting:~0,6%"=="%_parseParam%" SET %_parseVar%=%_txtSetting:~25%
GOTO :EOF

:cmdLineParam
SET _param=
FOR %%A IN (restart start stop show) DO IF /I "%~1"=="%%~A" CALL :service %%~A
FOR %%A IN (getSSID setSSID setPassPhrase getStatus) DO IF /I "%~1%~2"=="%%~A" (
  SET _param=%%~A
  IF /I "%~1"=="set" FOR %%B IN (SSID) DO CALL CALL :get%%~B
  CALL CALL :%%~A
  IF /I "%~1"=="get" CALL ECHO %~2: %%_txt%~2%%
)
IF NOT DEFINED _param CALL :help
GOTO :EOF

:help
ECHO %~n0 Help
ECHO Manage the Virtual WiFi, based on Hosted network of Microsoft Windows(R)
ECHO (Windows Vista or above) whose hosted network feature. This command requires
ECHO administrator privileges.
ECHO.
ECHO %~n0 [parameter]
ECHO.
ECHO Valid parameters are:
ECHO   restart^|start^|stop^|show
ECHO   SET SSID^|PassPhrase
ECHO   GET SSID^|Status
ECHO.
ECHO Remark:
ECHO start          - Start hosted network.
ECHO stop           - Stop hosted network.
ECHO restart        - Restart hosted network.
ECHO show           - Show hosted network properties and status.
ECHO set            - Sets configuration information.
ECHO   SSID         - Sets the SSID of the hosted network.
ECHO   PassPhrase   - Sets the user security key used by the hosted network.
ECHO                  The user security key should be a string with 8 to 63 ASCII
ECHO                  characters. The key is set to be persistent, saved and used
ECHO                  when the hosted network is started again in future.
ECHO                  The security type is WPA2 Personal.
ECHO get            - Gets configuration information.
ECHO   SSID         - Gets the SSID of the hosted network.
ECHO   Status       - Show hosted network status.
ECHO.
GOTO :EOF


