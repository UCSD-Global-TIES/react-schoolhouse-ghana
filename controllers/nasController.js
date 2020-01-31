const fs = require('fs');
const checkDiskSpace = require('check-disk-space');


// WRITE: Creating a directory
// ---------------------------------------------------------------
// Won't create a new directory if one with the 
// same name already exists 
export const createDir = (dir_path, dir_name, cb) => {
    // Checking if directory exists
    // ---------------------------------------------------------------
    const dirExists = (path, dir_name, cb) => {
        fs.readdir(path, (err, itemNames) => {
            if (itemNames.includes(dir_name)) {
                cb(true);
                return;
            }

            cb(false);
        })
    }

    // dirExists(`${"C:/Users"}`, "Matt", (res) => console.log(res));
    dirExists(dir_path, dir_name, (dir_exists) => {
        if (!dir_exists) {
            fs.mkdirSync(`${dir_path}/${dir_name}`, {
                recursive: true
            }, (err) => {
                if (err) throw err;
            })
            cb(true);
        } else {
            cb(false);
        }

    })
}

// createDir(".", "test", (res) => console.log(res));

// WRITE: Moving a file
// ---------------------------------------------------------------

export const moveFile = (filename, oldFilePath, newFolderPath) => {
    let newFilePath = `${newFolderPath}/${filename}`;

    fs.rename(oldFilePath, newFilePath, function (err) {
        if (err) throw err;
        console.log('File Moved!');
    });
}

// moveFile(FILE_NAME, FILE_PATH, NEW_FILE_PATH);

// WRITE: Renaming a file
// ---------------------------------------------------------------

export const renameFile = (old_filename, oldFilePath, new_filename) => {

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

export const deleteFile = (filePath) => {
    fs.unlink(filePath, function (err) {
        if (err) throw err;
        // if no error, file has been deleted successfully
        console.log('File deleted!');
    });
}

// Get disk space 
export const getDiskSpace = (path, cb) => {
    return checkDiskSpace(path).then((diskSpace) => {
        cb(diskSpace);
    });
}

// getDiskSpace("C:/", (diskSpace) => {
//     console.log(((diskSpace.free / diskSpace.size) * 100).toFixed(2) + "%");
// })

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

let upload = multer({
    storage: storage
});

app.get('/', function (req, res) {
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

app.post('/upload', function (req, res) {

    const FOLDER_PATH = req.body.path;
    storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, FOLDER_PATH);
        },
        filename: function (req, file, callback) {
            callback(null, file.originalname);
        }
    });
    upload = multer({
        storage: storage
    }).array("files");
    upload(req, res, function (err) {
        if (err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});

// app.listen(3000,function(){
//     console.log("Working on port 3000");
// });

// module.exports = {
// }