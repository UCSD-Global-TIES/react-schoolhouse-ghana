const fs = require('fs');
const checkDiskSpace = require('check-disk-space');
const multer = require('multer');
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

module.exports = {
    // WRITE: Creating a directory
    // ---------------------------------------------------------------
    createDir: function (dir_path, dir_name, cb) {
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
    },
    // WRITE: Moving a file
    // ---------------------------------------------------------------
    moveFile: function (filename, oldFilePath, newFolderPath) {
        let newFilePath = `${newFolderPath}/${filename}`;

        fs.rename(oldFilePath, newFilePath, function (err) {
            if (err) throw err;
            console.log('File Moved!');
        });
    },
    // WRITE: Renaming a file
    // ---------------------------------------------------------------
    renameFile: function (old_filename, oldFilePath, new_filename) {

        const newFilePath = oldFilePath.replace(old_filename, new_filename);
        console.log(newFilePath)
        fs.rename(oldFilePath, newFilePath, function (err) {
            if (err) throw err;
            console.log('File Renamed!');
        });
    },
    // WRITE: Deleting a file
    // ---------------------------------------------------------------
    deleteFile: function (filePath) {
        fs.unlink(filePath, function (err) {
            if (err) throw err;
            // if no error, file has been deleted successfully
            console.log('File deleted!');
        });
    },
    // WRITE: Uploading a file to directory
    // ---------------------------------------------------------------
    // https://codeforgeek.com/multiple-file-upload-node-js/
    // https://stackoverflow.com/questions/38458570/multer-uploading-array-of-files-fail/38476327
    // https://code.tutsplus.com/tutorials/file-upload-with-multer-in-node--cms-32088
    uploadFile: function (req, res) {

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
    },
    // READ: Get disk space 
    getDiskSpace: function (path, cb) {
        return checkDiskSpace(path).then((diskSpace) => {
            cb(diskSpace);
        });
    }

}