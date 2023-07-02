import { createServer, IncomingMessage, ServerResponse } from 'http';
import { v4 as uuidv4 } from 'uuid';
import { validate as uuidValidate } from 'uuid';
import * as url from 'url';
import { User } from './interface/user.interface';
import { CONSTANTS } from './data/constants';

export class Server {
  private server;
  private port: number;
  private users: Record<string, User> = {};

  constructor(port = 3000) {
    this.port = port;
    this.server = createServer(this.requestHandler.bind(this));
    this.init();
  }

  private init() {
    const initialUser: User = {
      id: uuidv4(),
      username: 'Kastus',
      age: 20,
      hobbies: ['braid turning'],
    };
    this.users[initialUser.id] = initialUser;
  }

  private requestHandler(req: IncomingMessage, res: ServerResponse) {
    const { pathname, query } = url.parse(req.url!, true);
    const userId = pathname.split('/')[3];
    
    if (pathname.startsWith('/api/users')) {
      switch (req.method) {
        case 'GET':
          if (userId) {
            if (!uuidValidate(userId)) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: CONSTANTS.messages.invalidUid }));
            } else if (!this.users[userId]) {
              res.writeHead(404, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: CONSTANTS.messages.userNotFound }));
            } else {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(this.users[userId]));
            }
          } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(Object.values(this.users)));
          }
          break;
        case 'POST':
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', () => {
            const { username, age, hobbies } = JSON.parse(body);
            if(!username || !age || !hobbies) {
              const missingFields = [];
              !username ? missingFields.push('username') : username;
              !age ? missingFields.push('age') : age;
              !hobbies ? missingFields.push('hobbies') : hobbies;
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: `${CONSTANTS.messages.missingFieldsInRequest}${missingFields}` }));
              return;
          }        
            const id = uuidv4();
            const newUser: User = { id, username, age, hobbies };
            this.users[id] = newUser;
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newUser));
          });
          break;

        case 'PUT':
          if (!userId || !uuidValidate(userId)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: CONSTANTS.messages.invalidUid }));
            break;
          }
  
          if (!this.users[userId]) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: CONSTANTS.messages.userNotFound }));
            break;
          }
  
          let putBody = '';
          req.on('data', chunk => {
            putBody += chunk.toString();
          });
  
          req.on('end', () => {
            const updatedData = JSON.parse(putBody);
            this.users[userId] = { ...this.users[userId], ...updatedData };
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(this.users[userId]));
          });
          break;
  
        case 'DELETE':
          if (!userId || !uuidValidate(userId)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: CONSTANTS.messages.invalidUid }));
            break;
          }
  
          if (!this.users[userId]) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: CONSTANTS.messages.userNotFound }));
            break;
          }
  
          delete this.users[userId];
          res.writeHead(204);
          res.end();
          break;
      }
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: CONSTANTS.messages.pageNotFound }));
    }
  }

  public async start() {
    this.server.listen(this.port, () => {
      console.log(`Server running at http://127.0.0.1:${this.port}/`);
    });
  }

  public async stop() {
    this.server.close(() => {
      console.log(`Server on port ${this.port} stopped`);
    });
  }

}
