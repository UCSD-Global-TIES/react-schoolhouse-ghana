## Schoolhouse Ghana 

*A full-stack MERN application (MongoDB, Express.js, React, and Node.js) designed to provide locally-stored resources to devices on the same network.*

### Overview

Commissioned by the GodFreds Foundation and the UCSD Global Ties program, Schoolhouse Ghana is striving to radically transform the education system at SAS (Semanhyiya American School) in Senase, Ghana. As internet usage is very expensive in this region, the school's access to online resources is greatly limited. In a school with hundreds of students and faculty, accessing online resources at school will quickly incur extensive internet charges.

Schoolhouse Ghana presents the solution. A file-sharing platform designed specifically for schools, with many features including:
- User authentication system with various account types & associated permissions (i.e. students, teachers, and administrative accounts)


- School-wide and subject-specific announcements


- Assigning students and teachers to grades 


- Creation of subject curriculums 


- File upload and management system

To get started and launch the server, follow the instructions below.

### Installation 
#### Prerequisites:
1. An IDE of your choice. A good option to start with is [VSCode](https://code.visualstudio.com/download).

2. [Node.js](https://nodejs.org/en/download/), a JavaScript runtime environment. 

3. [Robo 3T](https://robomongo.org/download), a GUI for MongoDB.

#### Clone the repository
```
git clone https://github.com/UCSD-Global-TIES/react-schoolhouse-ghana.git 
```
#### Install the dependencies
1. First, the package dependencies...
```
npm i 
```

2. Then, the database server **MongoDB**
> [Install MongoDB Community Server](https://www.mongodb.com/download-center/community)


#### Select a storage folder and temporary folder (optional)
*The storage folder will be automatically created if it does not exist already. Defaults to "../schoolhouse-storage"*
1. Open the *nasConfig.js* file in your preferred editor


2. Update the *path* field to the directory where you wish to store all resources 


3. Update the *tmp* field to the directory where you wish to save resources temporarily (before the server automatically moves it to the directory specified by *path*)

#### Start the server
```
npm start
```

##### Notes 
- When the server is first launched, a master account will be created with administrative privileges; the credentials for this account will only be displayed ONCE, so make sure to mark them down
- These credentials can also be found in the code






