import { commands } from "../data/constants.data.js";
import { PathService } from "./path.service.js";
import { ExitService } from "./exit.service.js";

const pathService = new PathService();

export class CommandService{
    constructor() {
        this.commands = commands;
    }
    async check(command) {
        (command in this.commands) ? command : console.log(`I don't know that command`)
    }

    async executeCommand(command) {
        await this.check(command);

        switch(command) {
            case ".exit":
                ExitService.sayBye();
                break;
            case "up":
                pathService.goUp();
                break;
            default: 
                console.log(`Unknown command`);
        }
 
        pathService.printCurrentPath();
    }
}

