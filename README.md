CRUD Application Walkthrough
The application has been restored to Spring Boot. Here is how to run it.

Prerequisites
MySQL Database (Must be running on port 3306)
Maven (Installed and in system PATH)
Java 17+
Steps to Run
1. Database Setup
Open your MySQL client (Workbench or CLI).
Run the 
database.sql
 script located in the project root.
It implies: CREATE DATABASE user_management;
2. Verify Credentials
Check 
src/main/resources/application.properties
.

Default User: root
Default Password: root
If yours are different, update them in the file.
3. Start the Application
Open a terminal in the project folder and run:

mvn spring-boot:run
4. Open in Browser
Once you see "Started CrudApplication", go to: [http://localhost:9090]

Features
Add User: Click "Add New User".
Edit/Delete: Use the buttons in the table.
Search: Type in the search bar to filter results.
