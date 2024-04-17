const path = require('path');

module.exports = {
    // Changing the below path AFTER file creation will break ALL links 
    path: path.join(__dirname, "../schoolhouse-storage"),
    tmp: path.join(__dirname, "../schoolhouse-storage/tmp"),
    publicPath: "/"
}