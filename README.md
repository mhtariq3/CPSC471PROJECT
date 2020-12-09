# CPSC 471 Final Project - README

## Sage Medical Clinic Appointment Booking Application
A medical clinic appointment booking application created using HTML, CSS, NodeJS, ExpressJS, and a local MS SQL Database.

## Instructions on how to run the application
#### 1. Install NodeJS and MS SQL Server Express
  * NodeJS: https://nodejs.org/en/
  * MS SQL Server Express: https://www.microsoft.com/en-ca/sql-server/sql-server-downloads
  * SSMS: https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-ver15

#### 2. Change to project directory and run the command:
  >npm i

#### 3. Database Setup
  1. Run SSMS
  2. Set the server name as: localhost\SQLEXPRESS
  3. Press Connect
  4. Create a new database named 'clinic'
  5. Goto Security -> Login -> Create a new Login with user and pass as 'user' and 'user' respectively with default database as clinic
  6. While creating new Login, goto Securables and grant the user with all the permissions
  7. Right click on localhost\SQLEXPRESS -> Properties -> Security -> Switch to SQL Server and Windows Authentication mode
  8. Disconnect and Connect to database with new login
  9. Execute Script.sql on clinic database
  
#### 4. In terminal, run the command:
  >node app.js

#### 5. In a browser, goto localhost:3000 and view project
