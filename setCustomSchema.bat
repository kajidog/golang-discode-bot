@echo off
setlocal

set KEY=HKCR\voiceping
set URL_PROTOCOL=VoicePing Protocol
set APP_PATH="%~dp0build\bin\VoicePing.exe"

:: カスタムURLスキームを登録
reg add "%KEY%" /ve /d "URL:%URL_PROTOCOL%" /f
reg add "%KEY%" /v "URL Protocol" /d "" /f
reg add "%KEY%\shell\open\command" /ve /d "%APP_PATH% \"%%1\"" /f

endlocal
echo カスタムURLスキーム VoicePing が登録されました。
pause