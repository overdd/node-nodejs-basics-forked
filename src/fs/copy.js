import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const copy = async () => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const pathToRead = path.join(__dirname, "files");
    const pathToWrite = path.join(__dirname, "files_copy");

    validatePathToRead(pathToRead);
    validatePathToWrite(pathToWrite);

    fs.readdir(pathToRead, (error, files) => {
        if (error) {
            throw new Error(error);
        };

        fs.mkdir(pathToWrite, (error) => {
            if (error) {
                throw new Error(error);
            };
            for (const file of files) {
                let fullPathToRead = path.join(pathToRead, file);
                let fullPathToWrite = path.join(pathToWrite, file);
                fs.copyFile(fullPathToRead, fullPathToWrite, (error) => {
                    if (error) {
                        throw new Error(error);
                    };
                })
            }
        });
        console.log(files);
    });

};

const validatePathToRead = async(path) => {
    fs.access(path, fs.constants.F_OK, (error) => {
        if (error) {
            throw new Error(`FS operation failed`);
        }
    });
}

const validatePathToWrite = async(path) => {
    fs.access(path, fs.constants.F_OK, (error) => {
        if (!error) {
            throw new Error(`FS operation failed`);
        }
    });
}

await copy();