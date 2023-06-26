import fs from "fs";
import path from "path";
import util from "util";
import zlib from "zlib";
import { PathService } from "./path.service.js";


export class ZipService{
    constructor() {
        this.pathService = new PathService();
        this.readFileAsync = util.promisify(fs.readFile);
    }

    async compress(pathToFile) {
        let pathToRead;
        let pathToArchive;
        try { 
            pathToRead = path.join(process.env.FILEMANAGERPATH, pathToFile);
            pathToArchive = path.join(process.env.FILEMANAGERPATH, `${pathToFile}.gzip`);
    
            await this.pathService.validatePath(pathToRead);
    
            const readableStream = fs.createReadStream(pathToRead);
            const writetableStream = fs.createWriteStream(pathToArchive);
            const gzip = await zlib.BrotliCompress();
            await readableStream.pipe(gzip).pipe(writetableStream);
        } catch(error) {
            console.log(`File Manager wasn't able to compress ${pathToRead}`);
        }
    }

    async decompress(pathToFile) {
        let pathToWrite;
        let pathToArchive;
        try { 
            pathToArchive = path.join(process.env.FILEMANAGERPATH, pathToFile);
            pathToWrite = path.join(pathToArchive.slice(0, -5));
    
            await this.pathService.validatePath(pathToArchive);
            if (!this.pathService.checkFileExtension(pathToArchive)) {
                throw new Error(`This file is not GZIP archive!`);
            }

            const readableStream = fs.createReadStream(pathToArchive);
            const writetableStream = fs.createWriteStream(pathToWrite);
            const gzip = await zlib.BrotliDecompress();
            await readableStream.pipe(gzip).pipe(writetableStream);
        } catch(error) {
            console.log(`File Manager wasn't able to decompress ${pathToArchive}. ${error}`);
        }
    }

    
    
}
