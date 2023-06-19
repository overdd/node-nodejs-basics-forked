import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export class PathService{
    constructor() {
        process.env.FILEMANAGERPATH = process.env.HOME;
    }

    printCurrentPath() {
        console.log(`You are currently in ${process.env.FILEMANAGERPATH}`);
    } 

    goUp() {
        try { 
            const __dirname = path.dirname(process.env.FILEMANAGERPATH);
            this.validatePath(__dirname);
            const updatedPath = path.join(__dirname, './');
            this.validatePath(updatedPath);
            process.env.FILEMANAGERPATH = updatedPath;
        } catch(error) {
            console.log(`File Manager wasn't able to go UP: ${error}`);
        }
    }


    validatePath = async(path) => {
    fs.access(path, fs.constants.F_OK, (error) => {
        if (error) {
            throw new Error(`FS operation failed`);
        }
    });
}

}

