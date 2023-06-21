import fs from "fs";
import path from "path";
import util from "util";
import { PathService } from "./path.service.js";


export class FilesService{
    constructor() {
        this.pathService = new PathService();
        this.readFileAsync = util.promisify(fs.readFile);
    }

    async concatenate(pathToFile) {
        let pathToRead;
        try { 
            pathToRead = path.join(process.env.FILEMANAGERPATH, pathToFile);
    
            await this.pathService.validatePath(pathToRead);
    
            await this.readFileAsync(pathToRead, 'utf8', (error, data) => {
                error ? console.log(`Error while reading the file ${pathToRead}: ${error}`) : console.log(data);
            })
        } catch(error) {
            console.log(`File Manager wasn't able to read file ${pathToRead}`);
        }
    }
}
