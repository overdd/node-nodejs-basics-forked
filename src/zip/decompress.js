import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import zlib from "zlib";

const decompress = async () => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const pathToFile = path.join(__dirname, "files", "fileToCompress.txt");
    const pathToArchive = path.join(__dirname, "files", "archive.gz");

    validatePathToArchive(pathToArchive);
    validatePathToFile(pathToFile);

    const readableStream = fs.createReadStream(pathToArchive);
    const writetableStream = fs.createWriteStream(pathToFile);
    const gzip = zlib.createUnzip();

    readableStream.pipe(gzip).pipe(writetableStream);
};

const validatePathToFile = async(path) => {
    fs.access(path, fs.constants.F_OK, (error) => {
        if (error) {
            throw new Error(`File doesn't exist`);
        }
    });
}

const validatePathToArchive = async(path) => {
    fs.access(path, fs.constants.F_OK, (error) => {
        if (error) {
            throw new Error(`Archive wasn't found`);
        }
    });
}

await decompress();