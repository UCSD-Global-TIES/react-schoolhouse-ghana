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
    NAS_PATH: "Z:/",
    // WRITE: Creating a directory
    // ---------------------------------------------------------------
    createDir: function (dir_path, dir_name) {
        return new Promise((resolve, reject) => { // Checking if directory exists
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
                    const path = `${dir_path}/${Date.now()}-${dir_name}`
                    fs.mkdirSync(path, {
                        recursive: true
                    }, (err) => {
                        if (err) throw err;
                    })
                    resolve(path);
                } else {
                    resolve(false);
                }

            })
        })
    },
    // WRITE: Removing a directory recursively
    // ---------------------------------------------------------------
    removeDir: function (dir_path) {
        return new Promise((resolve, reject) => {
            fs.rmdirSync(dir_path, {
                recursive: true
            }, (err) => {
                if (err) resolve(false);
            })
            resolve(true);

        })
    },
    // WRITE: Moving a file
    // ---------------------------------------------------------------
    moveFile: function (filename, oldFilePath, newFolderPath) {
        let newFilePath = `${newFolderPath}/${filename}`;

        fs.rename(oldFilePath, newFilePath, function (err) {
            if (err) throw err;
        });
    },
    // WRITE: Renaming a file
    // ---------------------------------------------------------------
    renameFile: function (old_filename, oldFilePath, new_filename) {

        const newFilePath = oldFilePath.replace(old_filename, new_filename);
        console.log(newFilePath)
        fs.rename(oldFilePath, newFilePath, function (err) {
            if (err) throw err;
        });
    },
    // WRITE: Deleting a file
    // ---------------------------------------------------------------
    deleteFile: function (filePath) {
        return new Promise((resolve, reject) => {
            fs.unlink(filePath, function (err) {
                if (err) resolve(null);
                // if no error, file has been deleted successfully
                resolve({});
            });
        })
    },
    // WRITE: Uploading a file to directory
    // ---------------------------------------------------------------
    // https://codeforgeek.com/multiple-file-upload-node-js/
    // https://stackoverflow.com/questions/38458570/multer-uploading-array-of-files-fail/38476327
    // https://code.tutsplus.com/tutorials/file-upload-with-multer-in-node--cms-32088
    uploadFile: function (req, res, path) {
        new Promise((resolve, reject) => {
            const FOLDER_PATH = path;
            storage = multer.diskStorage({
                destination: function (req, file, callback) {
                    callback(null, FOLDER_PATH);
                },
                filename: function (req, file, callback) {
                    callback(null, `${Date.now()}-${file.originalname}`);
                }
            });
            // upload = multer({
            //     storage: storage
            // }).array("files");

            upload = multer({
                storage: storage
            }).single("file");

            upload(req, res, function (err) {
                if (err) {
                    return resolve(null);
                }
                resolve({
                    name: `${Date.now()}-${req.file.originalname}`,
                    path: `${FOLDER_PATH}/${Date.now()}-${req.file.originalname}`,
                    created: Date.now()
                });
            });
        })
    },
    // TODO - NOT USED (SHOULD BE CALLED EVERYTIME UPLOADING TO NAS)
    // READ: Get disk space 
    getDiskSpace: function (path, cb) {
        return checkDiskSpace(path).then((diskSpace) => {
            cb(diskSpace);
        });
    }

}