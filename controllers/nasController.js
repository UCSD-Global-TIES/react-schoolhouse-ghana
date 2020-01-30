const fs = require('fs');
const DRIVE_NAME = "Z:";
const CLASS_PATH = `${DRIVE_NAME}/grade_1`
const FOLDER_PATH = `${CLASS_PATH}/addition`;
const NEW_FOLDER_PATH = `${CLASS_PATH}/division`;

const FILE_NAME = "sample.txt"
const NEW_FILE_NAME = "new_sample.txt";
const FILE_PATH = `${FOLDER_PATH}/${FILE_NAME}`;
const NEW_FILE_PATH = NEW_FOLDER_PATH;

// READ: Listing directory contents
// ---------------------------------------------------------------
const readDir = (dirPath) => {
    fs.readdir(dirPath, (err, itemPaths) => {
        for(const itemPath of itemPaths) {
            console.log(`${DRIVE_NAME}/${itemPath}`)
        }
    })
}

// readDir(`${DRIVE_NAME}\\${FOLDER_PATH}`);

// WRITE: Creating a directory
// ---------------------------------------------------------------
// Won't create a new directory if one with the 
// same name already exists (EXPECTED)
const createDir = (dirPath) => {
    fs.mkdirSync(dirPath, { recursive: true }, (err) => {
        if(err) throw err; 

        console.log(`Your directory, "${dirPath}" , was made!`);
    })
}

// createDir(NEW_DIR_NAME);

// WRITE: Moving a file
// ---------------------------------------------------------------

const moveFile = (filename, oldFilePath, newFolderPath) => {
    let newFilePath = `${newFolderPath}/${filename}`;

    fs.rename(oldFilePath, newFilePath, function (err) {
        if (err) throw err;
        console.log('File Moved!');
      });
}

// moveFile(FILE_NAME, FILE_PATH, NEW_FILE_PATH);

// WRITE: Renaming a file
// ---------------------------------------------------------------

const renameFile = (old_filename, oldFilePath, new_filename) => {

    const newFilePath = oldFilePath.replace(old_filename, new_filename);
    console.log(newFilePath)
    fs.rename(oldFilePath, newFilePath, function (err) {
        if (err) throw err;
        console.log('File Renamed!');
    });
}

// renameFile(FILE_NAME, `${NEW_FILE_PATH}/${FILE_NAME}`, NEW_FILE_NAME);

// WRITE: Deleting a file
// ---------------------------------------------------------------

const deleteFile = (filePath) =>{ 
    fs.unlink(filePath, function (err) {
        if (err) throw err;
        // if no error, file has been deleted successfully
        console.log('File deleted!');
    }); 
}

// deleteFile(`${DRIVE_NAME}/${FOLDER_PATH}/${FILE_PATH}`);

// WRITE: Uploading a file to directory
// ---------------------------------------------------------------
// https://codeforgeek.com/multiple-file-upload-node-js/
// https://stackoverflow.com/questions/38458570/multer-uploading-array-of-files-fail/38476327
// https://code.tutsplus.com/tutorials/file-upload-with-multer-in-node--cms-32088

const express = require("express");
const bodyParser = require("body-parser");
const multer = require('multer');
const app = express();

app.use(bodyParser.json());

let storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'Z:');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});

let upload = multer({ storage : storage });

app.get('/',function(req,res){
      res.sendFile(__dirname + "/index.html");
});

// app.post('/upload', upload.array('files'), function(req,res, next){
//     const files = req.files
//     if (!files) {
//         const error = new Error('Please choose files')
//         error.httpStatusCode = 400
//         return next(error)
//     }
 
//     res.send(files)
// });

app.post('/upload', function(req,res){
    console.log(req);
    const FOLDER_PATH = NEW_FOLDER_PATH;
    storage = multer.diskStorage({
        destination: function (req, file, callback) {
          callback(null, FOLDER_PATH);
        },
        filename: function (req, file, callback) {
          callback(null, file.originalname);
        }
      });
    upload = multer({ storage : storage }).array("files");
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});

app.listen(3000,function(){
    console.log("Working on port 3000");
});