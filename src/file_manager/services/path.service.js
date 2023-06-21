import fs from "fs";
import path from "path";
import { promisify } from "node:util";

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
            const updatedPath = path.join(__dirname, "./");
            this.validatePath(updatedPath);
            process.env.FILEMANAGERPATH = updatedPath;
        } catch(error) {
            console.log(`File Manager wasn"t able to go UP: ${error}`);
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
            console.log(`File Manager wasn"t able to change directory to ${directory}: ${error}`);
        }
    }


async listDirectory() {
    const filesAndDirectories = fs.readdirSync(process.env.FILEMANAGERPATH);
    const data = [["(index)", "Name", "Type"]];
    const maxColumnsLengths = [data[0][0].length, data[0][1].length, data[0][2].length];

    await this.sortFilesAndDirectories(filesAndDirectories);

    filesAndDirectories.forEach((file, index) => {
      const filePath = path.join(process.env.FILEMANAGERPATH, file);
      const fileStat = fs.statSync(filePath);
      const fileType = fileStat.isDirectory() ? `directory` : `file`;
      data.push([String(index), file.toString(), fileType.toString()]);
  
      maxColumnsLengths[0] = Math.max(maxColumnsLengths[0], String(index + 1).length);
      maxColumnsLengths[1] = Math.max(maxColumnsLengths[1], file.length);
      maxColumnsLengths[2] = Math.max(maxColumnsLengths[2], fileType.length);
    });
  
    const tableWidth = maxColumnsLengths.reduce((sum, length) => sum + length, 8);
    const horizontalBoarderLine = "─".repeat(tableWidth);
  
    let output = "";
    output += `┌${horizontalBoarderLine}┐\n`; 
  
    data.forEach((row, rowIndex) => {
      output += "│ ";
      row.forEach((cell, columnIndex) => {
        output += cell.toString().padEnd(maxColumnsLengths[columnIndex]);
        if (columnIndex < row.length - 1) {
          output += " │ ";
        }
      });
      output += " │\n";
  
      if (rowIndex === 0) {
        output += `├${horizontalBoarderLine}┤\n`; 
      }
    });
  
    output += `└${horizontalBoarderLine}┘`;
    console.log(output);
  }
  

      
    async validatePath(path) {
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

    async sortFilesAndDirectories(filesAndDirectories) {
        await filesAndDirectories.sort((a, b) => {
            let pathA = path.join(process.env.FILEMANAGERPATH, a);
            let pathB = path.join(process.env.FILEMANAGERPATH, b);
          
            let isADirectory = fs.statSync(pathA).isDirectory();
            let isBDirectory = fs.statSync(pathB).isDirectory();
          
            if (isADirectory && !isBDirectory) {
              return -1;
            }
          
            if (!isADirectory && isBDirectory) {
              return 1;
            }
          
            return a.localeCompare(b);
          });
    }
}

