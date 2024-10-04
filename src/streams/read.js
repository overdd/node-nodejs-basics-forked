import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const read = async () => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const pathToRead = path.join(__dirname, "files", "fileToRead.txt");
    
    validatePathToFile(pathToRead);

    const readableStream = fs.createReadStream(pathToRead);
    readableStream.pipe(process.stdout);
};

const validatePathToFile = async(path) => {
    fs.access(path, fs.constants.F_OK, (error) => {
        if (error) {
            throw new Error(`FS operation failed`);
        }
    });
}

await read();