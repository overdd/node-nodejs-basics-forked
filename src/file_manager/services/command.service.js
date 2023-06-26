import { commands } from "../data/constants.data.js";
import { PathService } from "./path.service.js";
import { ExitService } from "./exit.service.js";
import { FilesService } from "./files.service.js";
import { OsService } from "./os.service.js";

const pathService = new PathService();
const filesService = new FilesService();
const osService = new OsService();

export class CommandService{
    constructor() {
        this.commands = commands;
    }
    async check(command) {
        (this.commands.includes(command)) ? command : console.log(`This command not in the list of allowed commands`);
    }

    async executeCommand(userInput) {
        const inputArray = userInput.split(" ");
        const command = inputArray[0];
        const firstParameter = inputArray[1];
        const secondParameter = inputArray[2];

        await this.check(command);

        switch(command) {
            case ".exit":
                ExitService.sayBye();
                break;
            case "up":
                pathService.goUp();
                break;
            case "cd": 
                pathService.changeDirectory(firstParameter);
                break;
            case "ls":
                pathService.listDirectory();
                break;
            case "cat":
                filesService.concatenate(firstParameter);
                break;
            case "add": 
                filesService.add(firstParameter);
                break;
            case "rn":
                filesService.rename(firstParameter, secondParameter);
                break;
            case "cp":
                filesService.copy(firstParameter, secondParameter);
                break;
            case "mv":
                filesService.move(firstParameter, secondParameter);
                break;
            case "rm":
                filesService.remove(firstParameter);
                break;
            case "os":
                osService.osHandler(firstParameter);
                break;
            default: 
                console.log(`Unknown command`);
        }
 
        pathService.printCurrentPath();
    }
}

