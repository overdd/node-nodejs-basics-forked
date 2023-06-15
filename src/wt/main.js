import os from "node:os";
import path from "path";
import { fileURLToPath } from "url";
import { Worker } from "node:worker_threads";

const performCalculations = async () => {
    const resultArray = [];
    const cores = os.cpus();
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const pathToWorker = path.join(__dirname, "worker.js");

    const runWorker = (workerData) => {
        return new Promise((resolve, reject) => {
            const worker = new Worker(pathToWorker, { workerData });
            worker.on("message", result => {
                resolve({
                    "status": "resolved",
                    "data": result
                });
            });
            worker.on("error", result => {
                resolve({
                    "status": "resolved",
                    "data": null
                });
            });
            worker.on("exit", (code) => {
                if (code !== 0)
                  reject(new Error(`Worker stopped with exit code ${code}`));
              });
        });
    };

    for (let i = 0; i < cores.length; i++){
        resultArray[i] = await runWorker(i + 10);
    }

    console.log(resultArray);
};

await performCalculations();