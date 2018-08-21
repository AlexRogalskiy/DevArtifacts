:: Author: Brian Dinneen
@echo off

:ConfigureDefaultsIfNotDefined
IF NOT DEFINED NEXUS_HOME  SET NEXUS_HOME=%~dp0\nexus-3.0.1-01

pushd %~dp0
%NEXUS_HOME%\bin\nexus /run
popd
