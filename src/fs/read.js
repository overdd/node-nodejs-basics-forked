import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const read = async () => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const pathToRead = path.join(__dirname, "files", "fileToRead.txt");

    validatePath(pathToRead);

    fs.readFile(pathToRead, 'utf8', (error, data) => {
        if (error) {
            throw new Error(error);
        }
        console.log(data);
    })
};

const validatePath = async(path) => {
    fs.access(path, fs.constants.F_OK, (error) => {
        if (error) {
            throw new Error(`FS operation failed`);
        }
    });
}

await read();