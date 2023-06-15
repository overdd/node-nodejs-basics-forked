import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const write = async () => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const pathToWrite = path.join(__dirname, "files", "fileToWrite.txt");

    validatePathToFile(pathToWrite);

    const writableStream = fs.createWriteStream(pathToWrite);
    process.stdin.pipe(writableStream); // run the script and type data in console - it'll appear in fileToWrite.txt
};

const validatePathToFile = async(path) => {
    fs.access(path, fs.constants.F_OK, (error) => {
        if (error) {
            throw new Error(`FS operation failed`);
        }
    });
}

await write();