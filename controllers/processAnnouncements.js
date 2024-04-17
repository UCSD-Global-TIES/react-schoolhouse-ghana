const {
    address
} = require("ip");

const API_PORT = process.env.PORT || 3001;

module.exports.processAnnouncements = (announcements) => announcements
    .map(({
        content,
        private,
        files,
        _id,
        authorName,
        title,
        createdAt,
        updatedAt
    }) => ({
        content,
        private,
        files: files.map(f => ({
            ...f,
            path: `http://${address()}:${API_PORT}${f.path}`
        })),
        _id,
        authorName,
        title,
        createdAt,
        updatedAt
    }));