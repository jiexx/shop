for %%I in (npm) do set "exepath=%%~$PATH:I"

echo %exepath%

start  "" /b "%exepath%" install -g express 
start  "" /b "%exepath%" install -g fdfs     
start  "" /b "%exepath%" install -g fast-csv   
start  "" /b "%exepath%" install -g mysql      
start  "" /b "%exepath%" install -g request    
start  "" /b "%exepath%" install -g traverse   
start  "" /b "%exepath%" install -g promise    
start  "" /b "%exepath%" install -g multer     
start  "" /b "%exepath%" install -g body-parser
start  "" /b "%exepath%" install -g crypto  
start  "" /b "%exepath%" install -g nano-time 
start  "" /b "%exepath%" install -g cache-manager  
start  "" /b "%exepath%" install -g cache-manager-fs
start  "" /b "%exepath%" install -g uuid
start  "" /b "%exepath%" link express     
start  "" /b "%exepath%" link fdfs      
start  "" /b "%exepath%" link fast-csv         
start  "" /b "%exepath%" link mysql            
start  "" /b "%exepath%" link request          
start  "" /b "%exepath%" link traverse         
start  "" /b "%exepath%" link promise          
start  "" /b "%exepath%" link multer           
start  "" /b "%exepath%" link body-parser      
start  "" /b "%exepath%" link crypto 
start  "" /b "%exepath%" link nano-time    
start  "" /b "%exepath%" link cache-manager  
start  "" /b "%exepath%" link cache-manager-fs
start  "" /b "%exepath%" link uuid