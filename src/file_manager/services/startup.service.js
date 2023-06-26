import { PathService } from "./path.service.js";

const pathService = new PathService();

export class StartUpService{
    constructor() {}
    static sayHello() {
    
        let welcomeOutput = "";
        for (const argument of process.argv) {
      
            if (argument.includes("--username")) {
                process.env.FILEMANAGERUSERNAME = argument.slice(argument.indexOf("=")+1 );
                welcomeOutput = `Welcome to File Manager, ${process.env.FILEMANAGERUSERNAME}!`;
                console.log(welcomeOutput);
                pathService.printCurrentPath();
                break;
            } 
         } 
        if (welcomeOutput === "") {
            console.log("No username provided. Working in incognito mode.");
            pathService.printCurrentPath();
         }

    }
}

