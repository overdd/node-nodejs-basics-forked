import { Server } from './server';
import os from 'os';
import cluster from 'cluster';
import dotenv from 'dotenv';
dotenv.config();


if (cluster.isPrimary) {
    const cpuCount = os.cpus().length;

    for (let i = 0; i < cpuCount; i++) {
        console.log(`Server #${i} of ${cpuCount} is starting, port will be assigned soon.`);
        cluster.fork();
    }
} else {
    const server = new Server(Number(process.env.PORT) + cluster.worker.id);
    server.start();
}