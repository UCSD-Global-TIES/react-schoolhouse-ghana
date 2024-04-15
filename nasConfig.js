import path from 'path';

const storagePath = path.join(__dirname, "../schoolhouse-storage");
const tmpPath = path.join(storagePath, "tmp"); // Use the previously defined storagePath for clarity

export default {
    storagePath,
    tmpPath,
    publicPath: "/"
};
