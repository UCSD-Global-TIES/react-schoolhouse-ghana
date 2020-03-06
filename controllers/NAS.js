const fs = require('file-system');
const checkDiskSpace = require('check-disk-space');
const multer = require('multer');
const config = require('../nasConfig');

let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, config.path);
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

let upload = multer({
    storage: storage
});

module.exports = {
    // // WRITE: Creating a directory
    // // ---------------------------------------------------------------
    // createDir: function (dir_path, dir_name) {
    //     return new Promise((resolve, reject) => { // Checking if directory exists
    //         // ---------------------------------------------------------------
    //         const dirExists = (path, dir_name, cb) => {
    //             fs.readdir(path, (err, itemNames) => {
    //                 if (itemNames.includes(dir_name)) {
    //                     cb(true);
    //                     return;
    //                 }

    //                 cb(false);
    //             })
    //         }

    //         // dirExists(`${"C:/Users"}`, "Matt", (res) => console.log(res));
    //         dirExists(dir_path, dir_name, (dir_exists) => {
    //             if (!dir_exists) {
    //                 const path = `${dir_path}/${Date.now()}-${dir_name}`
    //                 fs.mkdirSync(path, {
    //                     recursive: true
    //                 }, (err) => {
    //                     if (err) throw err;
    //                 })
    //                 resolve(path);
    //             } else {
    //                 resolve(false);
    //             }

    //         })
    //     })
    // },
    // // WRITE: Removing a directory recursively
    // // ---------------------------------------------------------------
    // removeDir: function (dir_path) {
    //     return new Promise((resolve, reject) => {
    //         fs.rmdirSync(dir_path, {
    //             recursive: true
    //         }, (err) => {
    //             if (err) resolve(false);
    //         })
    //         resolve(true);

    //     })
    // },
    // // WRITE: Moving a file
    // // ---------------------------------------------------------------
    // moveFile: function (filename, oldFilePath, newFolderPath) {
    //     let newFilePath = `${newFolderPath}/${filename}`;

    //     fs.rename(oldFilePath, newFilePath, function (err) {
    //         if (err) throw err;
    //     });
    // },
    // WRITE: Renaming a file
    // ---------------------------------------------------------------
    renameFile: function (old_filename, oldFilePath, new_filename, cb) {

        const newFilePath = oldFilePath.replace(old_filename, new_filename);
        fs.rename(oldFilePath, newFilePath, function (err) {
            if (err) throw err;
            cb()
        });
    },
    // WRITE: Deleting a file
    // ---------------------------------------------------------------
    deleteFile: function (path) {
        return new Promise((resolve, reject) => {
            const isDir = fs.lstatSync(path).isDirectory();
            if(isDir) {
                fs.rmdirSync(path);
                resolve({});
            } 
            else {
                fs.unlink(path, function (err) {
                    if (err) resolve(null);
                    // if no error, file has been deleted successfully
                    else resolve({});
                });
            }
        })
    },
    // WRITE: Uploading a file to directory
    // ---------------------------------------------------------------
    // https://codeforgeek.com/multiple-file-upload-node-js/
    // https://stackoverflow.com/questions/38458570/multer-uploading-array-of-files-fail/38476327
    // https://code.tutsplus.com/tutorials/file-upload-with-multer-in-node--cms-32088
    // https://medium.com/@bmshamsnahid/nodejs-file-upload-using-multer-3a904516f6d2
    // https://stackoverflow.com/questions/51566797/accessing-upload-data-in-react-from-multer-node-server
    uploadFile: function (req, res) {
        new Promise((resolve, reject) => {
            const FOLDER_PATH = config.path;
            const createdAt = Date.now()
            storage = multer.diskStorage({
                destination: function (req, file, callback) {
                    callback(null, FOLDER_PATH);
                },
                filename: function (req, file, callback) {
                    callback(null, `${createdAt}-${file.originalname}`);
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
                    name: `${createdAt}-${req.file.originalname}`,
                    // PATH TO FILE ON SERVER
                    path: `${FOLDER_PATH}/${createdAt}-${req.file.originalname}`,
                    created: createdAt
                });
            });
        })
    },
    // TODO - NOT USED (SHOULD BE CALLED EVERYTIME UPLOADING TO NAS)
    // READ: Get disk space 
    getDiskSpace: function (cb) {
        return checkDiskSpace(config.path).then((diskSpace) => {
            cb(diskSpace);
        });
    }

}