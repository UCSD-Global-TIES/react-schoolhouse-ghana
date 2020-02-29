const config = require("./nasConfig");
const fileDb = require("./models/File")
const { deleteFile } = require("./controllers/NAS")
const fs = require("fs")
const getSize = require('get-folder-size');
const unzipper = require("unzipper");
const find = require("find");

// import socket from server.js
module.exports = function (server, client, uploader) {

    // Track the number of connections to the server
    // let connections = 0;
    let users = 0;

    // // The socket is attached to the user that 
    // console.log(`A device has connected to the server: ${++connections} connection(s)`);

    // Emit on the channel 'chat message' the payload msg
    client.on('authentication', function (msg) {
        console.log(msg);
        console.log(`A user has logged in: ${++users} user(s)`);

    })

    // client.on('disconnect', function () {
    //     console.log(`A user has disconnected from the server: ${--connections} connection(s)`);
    // });

    client.on('documents-changed', function (type) {
        server.emit(`refresh-${type}`)
    })

    // Do something when a file is saved:
    uploader.on("progress", function (event) {
        const { name, size, bytesLoaded, base } = event.file;
        const type = name.split(".")[name.split(".").length - 1];
        const percent = ((bytesLoaded / size) * 100).toFixed(2);
        const filename = decodeURI(`${base}.${type}`);

        const fileData = {
            name: filename,
            bytesLoaded,
            size,
            percent,
            type,
            status: "Pending"


        }

        server.emit("download-progress", fileData)
    });

    // Do something when a file is saved:
    uploader.on("saved", function (event) {
        const { name, size, bytesLoaded, success, base, pathName, meta } = event.file;
        const type = name.split(".")[name.split(".").length - 1];
        const percent = ((bytesLoaded / size) * 100).toFixed(2);
        const filename = decodeURI(`${base}.${type}`);

        const createFileDocument = (path, absolutePath, size) => {
            fileDb.findOne({ filename })
                .then((result) => {
                    if (!result) {
                        fileDb
                            .create(
                                {
                                    nickname: decodeURI(base),
                                    type,
                                    path,
                                    filename,
                                    absolutePath,
                                    size
                                }
                            )
                            .then(() => {
                                const fileData = {
                                    name: filename,
                                    bytesLoaded,
                                    size,
                                    percent,
                                    type,
                                    status: "Complete"

                                }
                                server.emit("download-end", fileData)
                                server.emit('refresh-files', {})
                            })
                    }
                })
        }

        if (success) {
            // CHECK IF WEBZIP FILE
            // Assuming downloaded with download-server
            // filename is URI encoded
            if (type === "webzip") {

                // Unzip webpage folder, locate path to index.html
                // -------------------------------------------------------------------------------------

                // 1. .webzip -> .zip
                const zipPath = pathName.replace("webzip", "zip")
                const folderPath = `${config.path}/${base}`
                let indexPath = "";
                fs.renameSync(pathName, zipPath);

                // 2. Unzip to storage directory
                fs.createReadStream(zipPath)
                    .pipe(unzipper.Extract({ path: folderPath }))
                    .on("finish", () => {

                        // 3. Locate path to index.html within hostname folder
                        // Extract hostname from filename
                        let hostname = base.split("(")[base.split("(").length - 1];
                        hostname = hostname.split(")")[0];
                        find.file(`${folderPath}/${hostname}`, function (files) {
                            indexPath = files.find(filename => filename.includes("index.html"));
                            
                            // 4. Remove .zip from tmp directory
                            fs.unlink(zipPath, () => {})
                            
                            // 5. Create file document 
                            const path = `${config.publicPath}${decodeURI(indexPath).replace(config.path, "")}`;
                            const absolutePath = folderPath
                            
                            getSize(absolutePath, (err, numBytes) => {
                                if (err) { throw err; }
                               
                                const size = numBytes;
                                createFileDocument(path, folderPath, size)
                              });

                        })

                    });
            } else {
                // Move from tmp to main folder
                // DOESN'T CORRECTLY OPEN IN BROWSER
                const path = `${config.publicPath}/${decodeURI(filename)}`;
                const absolutePath = `${config.path}/${filename}`;
                fs.renameSync(pathName, absolutePath);
                createFileDocument(path, absolutePath, size)
            }

        }

    });

    // Error handler:
    uploader.on("error", function (event) {
        const { name, base, size, bytesLoaded, pathName } = event.file;
        const type = name.split(".")[name.split(".").length - 1];
        const filename = decodeURI(`${base}.${type}`);
        const percent = ((bytesLoaded / size) * 100).toFixed(2);

        const fileData = {
            name: filename,
            bytesLoaded,
            size,
            percent,
            type,
            status: "Error"
        }

        // Delete file 
        deleteFile(pathName)
            .then(() => server.emit("download-error", fileData))



    });

}