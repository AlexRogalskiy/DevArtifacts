:: Author: Brian Dinneen
@echo off

SET JAVA_OPTS=-Xms256m -Xmx1024m -XX:NewSize=128m -XX:MaxNewSize=256m -Xmn128M -Xms1024M -Xmx2048M
pushd %~dp0\apache-tomcat-8.5.4
ECHO Delete logs, caches and temp files
IF EXIST temp rmdir /s /q temp
IF EXIST logs rmdir /s /q logs
IF EXIST work rmdir /s /q work

ECHO ReCreating required folders
IF NOT EXIST temp mkdir temp
IF NOT EXIST logs mkdir logs
IF NOT EXIST work mkdir work
IF NOT EXIST webapps.notinuse mkdir webapps.notinuse
IF NOT EXIST webapps.tobedeleted mkdir webapps.tobedeleted

ECHO Clean up old apps
IF EXIST webapps.tobedeleted rmdir /s /q webapps.tobedeleted
IF NOT EXIST webapps.tobedeleted mkdir webapps.tobedeleted

ECHO Launching tomcat
ECHO JAVA_OPTS     :: %JAVA_OPTS%
ECHO CATALINA_OPTS :: %CATALINA_OPTS%

cmd /c bin\startup.bat

popd
