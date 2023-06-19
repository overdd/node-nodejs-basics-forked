import readline from "node:readline";
import { stdin as input, stdout as output } from 'node:process';
import { StartUpService } from "./services/startup.service.js";
import { ExitService } from "./services/exit.service.js";
import { CommandService } from "./services/command.service.js";


const commandService = new CommandService();

const main = () => {
    const rl = readline.createInterface({ input, output });

    StartUpService.sayHello();

    rl.on("line", async (data) => {
        await commandService.executeCommand(data);
    })

    rl.on("SIGINT", () => {
        ExitService.sayBye();
    }) 

};

main();