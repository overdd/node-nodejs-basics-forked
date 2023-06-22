import { commands } from "../data/constants.data.js";
import { PathService } from "./path.service.js";
import { ExitService } from "./exit.service.js";
import { FilesService } from "./files.service.js";

const pathService = new PathService();
const filesService = new FilesService();

export class CommandService{
    constructor() {
        this.commands = commands;
    }
    async check(command) {
        (command in this.commands) ? command : console.log(`I don't know that command`)
    }

    async executeCommand(userInput) {
        const inputArray = userInput.split(" ");
        const command = inputArray[0];
        const parameter = inputArray[1];

        await this.check(command);

        switch(command) {
            case ".exit":
                ExitService.sayBye();
                break;
            case "up":
                pathService.goUp();
                break;
            case "cd": 
                pathService.changeDirectory(parameter);
                break;
            case "ls":
                pathService.listDirectory();
                break;
            case "cat":
                filesService.concatenate(parameter);
                break;
            case "add": 
                filesService.add(parameter);
                break;
            default: 
                console.log(`Unknown command`);
        }
 
        pathService.printCurrentPath();
    }
}

