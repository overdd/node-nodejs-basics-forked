import fs from 'fs';
import path from 'path';
import { promisify } from 'node:util';

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

    async changeDirectory(directory) {
        try {
            const __dirname = path.dirname(process.env.FILEMANAGERPATH);
            await this.validatePath(__dirname);
            let updatedPath;
            await this.isPathAbsolute(directory) 
                ? updatedPath = path.join(directory)
                    : updatedPath = path.join(process.env.FILEMANAGERPATH, directory);
            console.log(updatedPath);
            await this.validatePath(updatedPath);
            process.env.FILEMANAGERPATH = updatedPath;
        } catch(error) {
            console.log(`File Manager wasn't able to change directory to ${directory}: ${error}`);
        }
    }
   
    validatePath = async (path) => {
        const promisifiedAccess = promisify(fs.access);
        try {
            await promisifiedAccess(path, fs.constants.F_OK);
        } catch (error) {
            throw new Error(`FS operation failed`);
        }
    };

    async isPathAbsolute(directory) {
        const folderRegex = /^[A-Z]:\.*/;
        if (folderRegex.test(directory)) {
            return true;
        } else {
            return false;
        }
    }
}

