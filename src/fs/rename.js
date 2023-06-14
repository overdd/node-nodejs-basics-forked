import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const rename = async () => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const pathBeforeRename = path.join(__dirname, "files", "wrongFilename.txt");
    const pathAfterRename = path.join(__dirname, "files", "properFilename.md");
    
    validateBeforeRename(pathBeforeRename);
    validateAfterRename(pathAfterRename);

    fs.rename(pathBeforeRename, pathAfterRename, (error) => {
        if (error) {
            throw new Error(error);
        }
    })
};

const validateBeforeRename = async(path) => {
    fs.access(path, fs.constants.F_OK, (error) => {
        if (error) {
            throw new Error(`FS operation failed`);
        }
    });
}

const validateAfterRename = async(path) => {
    fs.access(path, fs.constants.F_OK, (error) => {
        if (!error) {
            throw new Error(`FS operation failed`);
        }
    });
}

await rename();