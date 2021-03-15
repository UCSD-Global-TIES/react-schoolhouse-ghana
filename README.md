# Schoolhouse Ghana 

*A full-stack MERN application (MongoDB, Express.js, React, and Node.js) designed to provide locally-stored resources to devices on the same network.*

## Overview

Commissioned by the GodFreds Foundation and the UCSD Global Ties program, Schoolhouse Ghana is striving to radically transform the education system at SAS (Semanhyiya American School) in Senase, Ghana. As internet usage is very expensive in this region, the school's access to online resources is greatly limited. In a school with hundreds of students and faculty, accessing online resources at school will quickly incur extensive internet charges.

EduTies presents the solution. A file-sharing platform designed specifically for schools, with many features including:
- User authentication system with various account types & associated permissions (i.e. students, teachers, and administrative accounts)


- School-wide and subject-specific announcements


- Assigning students and teachers to grades 


- Creation of subject curriculums 


- File upload and management system

To get started and launch the server, follow the instructions below.

## Installation 
### Prerequisite Downloads:
1. An integrated development environment (IDE) of your choice. This a software program that allows you to edit, execute, and debug code all in the same place.  A good option to start with is [VSCode](https://code.visualstudio.com/download).

2. [Git](https://git-scm.com/downloads), a version control management system for our code. To test your installation, open a terminal and type in the following  command: `git --version`. If this gives you an error, you may have to manually add git to your system's PATH environment variable. See a Windows guide [here](https://stackoverflow.com/questions/4492979/git-is-not-recognized-as-an-internal-or-external-command). 
3. [Node.js](https://nodejs.org/en/download/), a JavaScript runtime environment. 

3. [Robo 3T](https://robomongo.org/download), a GUI for MongoDB.

### Clone the repository
1. Open up your IDE and open a terminal.
2. Navigate to the folder where you want the project to reside. Use the command `cd DIRECTORY_NAME` to navigate your computer's file structure. The command `ls` shows you the files in your current directory (valid for macOS, and Windows PowerShell -- NOT Windows command prompt).
3. Create a Github account and ask someone to add you to the private repo (where all of our project's files reside). Type in the following command:
```
git clone https://github.com/UCSD-Global-TIES/react-schoolhouse-ghana.git 
```
### Install the dependencies
1. First, resolve package dependencies with the following command:
```
npm i 
```

2. Then, the database server **MongoDB**
> [Install MongoDB Community Server](https://www.mongodb.com/download-center/community)


### Select a storage folder and temporary folder (optional)
*The storage folder will be automatically created if it does not exist already. Defaults to "../schoolhouse-storage"*
1. Open the *nasConfig.js* file in your preferred editor (i.e. VSCode).


2. Update the *path* field to the directory where you wish to store all resources. 


3. Update the *tmp* field to the directory where you wish to save resources temporarily (before the server automatically moves it to the directory specified by *path*).

### Start the server
```
npm start
```

#### Notes 
- When the server is first launched, a master account will be created with administrative privileges; the credentials for this account will only be displayed ONCE, so make sure to mark them down
- These credentials can also be found in the code


### Making Changes
To get the latest changes from the remote [repository](https://www.geeksforgeeks.org/what-is-a-git-repository/):
```
git pull origin master
```
To create a new branch and immediately perform a checkout:
```
git checkout -b BRANCH_NAME
```
Once you are satisfied with your changes, save the files and use the following commands to "save" the project's state:
```
git add .
git commit -m "a short message describing the changes in this commit you are about to make"
```
Finally, push these changes to the remote repo so others can access your updates.
1. If the branch you're pushing already exists, use the following:
```
git push origin BRANCH_NAME
```
2. Otherwise, if you created this local branch after pulling and it does NOT exist in the remote repo yet, use the following:
```
git push -u origin BRANCH_NAME
```
Finally, go make a pull request and assign it to someone for review.



