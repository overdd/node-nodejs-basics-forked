import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import zlib from "zlib";

const compress = async () => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const pathToFile = path.join(__dirname, "files", "fileToCompress.txt");
    const pathToArchive = path.join(__dirname, "files", "archive.gz");
    
    validatePathToFile(pathToFile);
    validatePathToArchive(pathToArchive);

    const readableStream = fs.createReadStream(pathToFile);
    const writetableStream = fs.createWriteStream(pathToArchive);
    const gzip = zlib.createGzip();

    readableStream.pipe(gzip).pipe(writetableStream);
};

const validatePathToFile = async(path) => {
    fs.access(path, fs.constants.F_OK, (error) => {
        if (error) {
            throw new Error(`File wasn't found`);
        }
    });
}

const validatePathToArchive = async(path) => {
    fs.access(path, fs.constants.F_OK, (error) => {
        if (!error) {
            throw new Error(`Archive already exists`);
        }
    });
}

await compress();