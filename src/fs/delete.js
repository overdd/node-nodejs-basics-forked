import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const remove = async () => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const pathToRemove = path.join(__dirname, "files", "fileToRemove.txt");
    
    validatePathToFile(pathToRemove);
    
    fs.unlink(pathToRemove, (error) => {
        if (error) {
            throw new Error (error);
        };
    })
};

const validatePathToFile = async(path) => {
    fs.access(path, fs.constants.F_OK, (error) => {
        if (error) {
            throw new Error(`FS operation failed`);
        }
    });
}

await remove();