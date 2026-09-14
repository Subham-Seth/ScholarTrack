@echo off
set "SCRIPT_DIR=%~dp0"
set "MAVEN_EXE=%SCRIPT_DIR%..\.tools\apache-maven-3.9.6\bin\mvn.cmd"

if exist "%MAVEN_EXE%" (
    "%MAVEN_EXE%" %*
) else (
    mvn %*
)
