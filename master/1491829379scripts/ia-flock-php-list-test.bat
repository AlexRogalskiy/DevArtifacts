@ECHO OFF
SET INDLOG=index7.log
SET PHPEXE=C:\EXE\PHP7\php.exe
ECHO TEST: %PHPEXE% > %INDLOG%
START %COMSPEC% /C %PHPEXE% update.php
TIMEOUT /T 5 /NOBREAK
ECHO *************** >> %INDLOG%
ECHO *** PHASE 1 *** >> %INDLOG%
ECHO *************** >> %INDLOG%
%PHPEXE% index.php >> %INDLOG%
TIMEOUT /T 10 /NOBREAK
ECHO.
ECHO *************** >> %INDLOG%
ECHO *** PHASE 2 *** >> %INDLOG%
ECHO *************** >> %INDLOG%
%PHPEXE% index.php >> %INDLOG%

