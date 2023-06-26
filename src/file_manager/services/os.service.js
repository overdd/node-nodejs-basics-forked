import os from "node:os";

export class OsService{
    constructor() {}
    osHandler(parameter) {
        switch(parameter) {
            case "--EOL":
                this.getEol();
                break;
            case "--cpus":
                this.getCpus();
                break;
            case "--username":
                this.getOsUsername();
                break;
            case "--architecture":
                this.getCpuArchitecture();
                break;
            default: 
                console.log(`Unknown OS command`);
        }
    }

    getEol() {
        console.log(JSON.stringify(os.EOL));
    };

    getCpus() {
        const cores = os.cpus();
        console.log(`System has ${cores.length} ${cores[0].model} CPUs with MAX speed = ${cores[0].speed}GHz`);
    };

    getOsUsername() {
        console.log(process.env.USERNAME);
    };

    getCpuArchitecture() {
        console.log(process.env.PROCESSOR_ARCHITECTURE)
    };

}
