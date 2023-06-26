import fs from "fs";
import path from "path";
import util from "util";
import { createHash } from 'node:crypto';
import { PathService } from "./path.service.js";


export class HashService{
    constructor() {
        this.pathService = new PathService();
        this.readFileAsync = util.promisify(fs.readFile);
    }

    async calculateHash(pathToFile) {
        let pathToRead;
        try { 
            pathToRead = path.join(process.env.FILEMANAGERPATH, pathToFile);
    
            await this.pathService.validatePath(pathToRead);
    
            await this.readFileAsync(pathToRead, 'utf8', (error, data) => {
                const hash = createHash('sha256')
                    .update(data)
                    .digest('hex');
                    console.log(hash.toUpperCase());
            })
        } catch(error) {
            console.log(`File Manager wasn't able to calculate hash for file ${pathToRead}`);
        }
    }
    
}
