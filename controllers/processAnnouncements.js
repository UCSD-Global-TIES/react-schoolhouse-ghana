
import address from "ip";

const API_PORT = process.env.PORT || 3001;

export const processAnnouncements = (announcements) => announcements
    .map(({
        content,
        
        files,
        _id,
        authorName,
        title,
        createdAt,
        updatedAt
    }) => ({
        content,
        
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