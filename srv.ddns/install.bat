for %%I in (npm) do set "exepath=%%~$PATH:I"

echo %exepath%

start  "" /b "%exepath%" install -g cron 
start  "" /b "%exepath%" install -g request    

start  "" /b "%exepath%" link cron     
start  "" /b "%exepath%" link request          
