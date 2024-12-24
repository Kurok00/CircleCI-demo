@echo off
echo ====== Git Auto Push Script ======
echo.

:: Add all changes
git add .

:: Get commit message
set /p commit_msg="Enter commit message: "

:: Commit with message
git commit -m "%commit_msg%"

:: Force push to master
git push origin master --force

:: Show status
echo.
echo ====== Push Complete ======
git status

pause