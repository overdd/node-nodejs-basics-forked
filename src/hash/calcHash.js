import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'node:crypto';

const calculateHash = async () => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const pathToFile = path.join(__dirname, "files", "fileToCalculateHashFor.txt");

    validatePathToFile(pathToFile);

    fs.readFile(pathToFile, 'utf8', (error, data) => {
        if (error) {
            throw new Error(error);
        }
        const hash = createHash('sha256')
        .update(data)
        .digest('hex');
    console.log(hash.toUpperCase());
    })

};

const validatePathToFile = async(path) => {
    fs.access(path, fs.constants.F_OK, (error) => {
        if (error) {
            throw new Error(`FS operation failed`);
        }
    });
}

await calculateHash();