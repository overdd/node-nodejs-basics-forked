import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const list = async () => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const pathToFolder = path.join(__dirname, "files"); 

    validatePathToFolder(pathToFolder);

    fs.readdir(pathToFolder, (error, files) => {
        if (error) {
            throw new Error(error);
        }
        console.log(files);
    });
};

const validatePathToFolder = async(path) => {
    fs.access(path, fs.constants.F_OK, (error) => {
        if (error) {
            throw new Error(`FS operation failed`);
        }
    });
}

await list();