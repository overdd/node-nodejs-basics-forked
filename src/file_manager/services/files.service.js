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

    async add(pathToFile) {
        let pathToWrite;
        let data="";
        try { 
            pathToWrite = path.join(process.env.FILEMANAGERPATH, pathToFile);
       
            fs.writeFile(pathToWrite, data, (error) => {
                if (error) {
                    throw new Error(error);
                }
            });
        } catch(error) {
            console.log(`File Manager wasn't able to create a new file ${pathToWrite}`);
        }
    }

    async rename(oldName, newName) {
        const pathBeforeRename = path.join(process.env.FILEMANAGERPATH, oldName);
        const pathAfterRename = path.join(process.env.FILEMANAGERPATH, newName);

        try { 
            this.pathService.validatePath(pathBeforeRename);

            fs.rename(pathBeforeRename, pathAfterRename, (error) => {
                if (error) {
                    throw new Error(error);
                }
            });
        } catch(error) {
            console.log(`File Manager wasn't able to rename file ${pathBeforeRename} info ${pathAfterRename}`);
        }
    }

    async copy(file, destination) {
        try { 
            const pathToCopy = path.join(process.env.FILEMANAGERPATH, file);
            const pathToWrite = path.join(process.env.FILEMANAGERPATH, destination, file);
    
            this.pathService.validatePath(pathToCopy);
        
            const readStream = fs.createReadStream(pathToCopy);
            const writeStream = fs.createWriteStream(pathToWrite);

            readStream.pipe(writeStream);        
        } catch(error) {
            console.log(`File Manager wasn't able to copy file ${file} info ${destination}`);
        }
    }
    
}
