import { Server } from './server';
import os from 'os';
import cluster from 'cluster';
import dotenv from 'dotenv';
dotenv.config();

const port = Number(process.env.PORT) || 3000;
const server = new Server(port);
server.start();