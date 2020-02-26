const config = require("./nasConfig");
const fileDb = require("./models/File")

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
            const filename = `${base}.${type}`;

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
            const { name, size, bytesLoaded, success, base, pathName } = event.file;
            const type = name.split(".")[name.split(".").length - 1];
            const percent = ((bytesLoaded / size) * 100).toFixed(2);
            const filename = `${base}.${type}`

            if(success) {
                fileDb.findOne({filename})
                .then((result) => {
                    if(!result) {
                        fileDb
                        .create(
                            {
                                nickname: base,
                                type,
                                path: `${config.publicPath}/${filename}`,
                                filename,
                                absolutePath: pathName,
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

        });

        // Error handler:
        uploader.on("error", function (event) {
            const { name, base, size, bytesLoaded } = event.file;
            const type = name.split(".")[name.split(".").length - 1];
            const filename = `${base}.${type}`
            const percent = ((bytesLoaded / size) * 100).toFixed(2);

            const fileData = {
                name: filename,
                bytesLoaded,
                size, 
                percent,
                type,
                status: "Error"
            }
            server.emit("download-error", fileData)
        });

}