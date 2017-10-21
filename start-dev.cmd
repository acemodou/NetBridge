:check_nodejs
   :: Check if NodeJS is installed a
   echo node version:
   cmd /c node -version
   if "%ERRORLEVEL"=="0" goto check_nodejs

   echo Installing NodeJS
   echo You need to close this window and start one more time 
   echo ... So sorry! :(
   echo . 
   echo This should only happen once 
   echo. 
   pause 
   exit 1
   :check_nodejs

:check_nodemon
   :: Install NodeMon globally
   echo nodemon version 
   cmd /c nodemon -version
   if "%ERRORLEVEL"=="0" goto check_nodemon

   echo Installing nodemon 
   cmd /c npm install nodemon -g 
   :check_nodemon

:install_npm_packages
  ::Updates/adds Node packages for site 
  echo Checking NPM site packages
  cmd /c npm install
  :install_npm_packages_

:start_app_dev
  :: Start application in dev mode 
  echo Starting app
  nodemon app.js 
  goto the_end
  :start_app_dev_


:the_end
   exit /b 0