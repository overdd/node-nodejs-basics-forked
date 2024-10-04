import path from "path";
import { fileURLToPath } from "url";
import cp from "child_process";

const args = process.argv;

const spawnChildProcess = (args) => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const pathToScript = path.join(__dirname, "files", "script.js");
    const childProcess = cp.spawn(`node ${pathToScript}`, args, {shell: true});

    process.stdin.pipe(childProcess.stdin);
    childProcess.stdout.pipe(process.stdout);
};

spawnChildProcess(args);