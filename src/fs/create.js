import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const create = async () => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const pathToFile = path.join(__dirname, "files", "fresh.txt");
    const data = "I am freash and young";

    validatePathToFile(pathToFile);

    fs.writeFile(pathToFile, data, (error) => {
        if (error) {
            throw new Error(error);
        }
    });
};

const validatePathToFile = async(path) => {
    fs.access(path, fs.constants.F_OK, (error) => {
        if (!error) {
            throw new Error(`FS operation failed`);
        }
    });
}

await create();