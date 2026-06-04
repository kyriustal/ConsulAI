@echo off
setlocal enabledelayedexpansion

echo ====================================================
echo           ConsulAI - Build e Deploy Automotivo
echo ====================================================
echo.

:: 1. Executar o build
echo [1/3] Executando compilacao local (Vite + Esbuild)...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERRO] A compilacao falhou. O commit/push foi cancelado.
    pause
    exit /b %ERRORLEVEL%
)
echo [OK] Compilacao concluida com sucesso!
echo.

:: 2. Adicionar arquivos ao Git
echo [2/3] Adicionando arquivos modificados ao Git...
git add .
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERRO] Falha ao executar 'git add'.
    pause
    exit /b %ERRORLEVEL%
)

:: Obter a data e hora atuais para a mensagem de commit
for /f "tokens=2 delims==" %%i in ('wmic os get localdatetime /value') do set datetime=%%i
set year=!datetime:~0,4!
set month=!datetime:~4,2!
set day=!datetime:~6,2!
set hour=!datetime:~8,2!
set minute=!datetime:~10,2!
set second=!datetime:~12,2!
set commit_msg=Auto-build e deploy: !day!/!month!/!year! - !hour!:!minute!:!second!

:: 3. Fazer commit e push
echo [3/3] Criando o commit: "!commit_msg!"...
git commit -m "!commit_msg!"
if %ERRORLEVEL% neq 0 (
    echo.
    echo [AVISO] Nenhum arquivo novo ou alterado para commitar, ou falha no commit.
)

:: Obter o nome da branch atual
for /f "tokens=*" %%i in ('git branch --show-current') do set BRANCH=%%i
if "!BRANCH!"=="" (
    set BRANCH=main
)

echo.
echo Enviando alteracoes para a branch '!BRANCH!' no GitHub...
git push origin !BRANCH!
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERRO] Falha ao enviar para o GitHub. Verifique a autenticacao e tente novamente.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ====================================================
echo [SUCESSO] Codigo enviado para o GitHub com sucesso!
echo O deploy automatico comecara em instantes no GitHub Actions.
echo ====================================================
echo.
pause
