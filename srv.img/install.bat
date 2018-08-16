for %%I in (npm) do set "exepath=%%~$PATH:I"

echo %exepath%

start  "" /b "%exepath%" install -g express 
start  "" /b "%exepath%" install -g compression     
start  "" /b "%exepath%" install -g body-parser   
start  "" /b "%exepath%" install -g multer
start  "" /b "%exepath%" install -g request    
start  "" /b "%exepath%" install -g sharp
start  "" /b "%exepath%" install -g uuid
start  "" /b "%exepath%" link express     
start  "" /b "%exepath%" link compression     
start  "" /b "%exepath%" link body-parser      
start  "" /b "%exepath%" link multer
start  "" /b "%exepath%" link request          
start  "" /b "%exepath%" link sharp
start  "" /b "%exepath%" link uuid