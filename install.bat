for %%I in (npm) do set "exepath=%%~$PATH:I"

echo %exepath%

start  "" /b "%exepath%" install -g express   
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
start  "" /b "%exepath%" install -g passport
start  "" /b "%exepath%" install -g passport-jwt
start  "" /b "%exepath%" install -g jsonwebtoken
start  "" /b "%exepath%" install -g passport-jwt
start  "" /b "%exepath%" install -g cookie-parser
start  "" /b "%exepath%" install -g ejs
start  "" /b "%exepath%" install -g shortid
start  "" /b "%exepath%" install -g gremlin
start  "" /b "%exepath%" install -g trek-captcha
start  "" /b "%exepath%" link express         
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
start  "" /b "%exepath%" link passport
start  "" /b "%exepath%" link passport-jwt
start  "" /b "%exepath%" link jsonwebtoken
start  "" /b "%exepath%" link cookie-parser
start  "" /b "%exepath%" link ejs
start  "" /b "%exepath%" link shortid
start  "" /b "%exepath%" link gremlin
start  "" /b "%exepath%" link trek-captcha
REM #ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '123$%^'