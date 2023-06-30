import { createServer, IncomingMessage, ServerResponse } from 'http';
import { v4 as uuidv4 } from 'uuid';
import { validate as uuidValidate } from 'uuid';
import * as url from 'url';
import { User } from './interface/user.interface';


const initialUser: User = {
  id: uuidv4(),
  username: 'initialUSer',
  age: 18,
  hobbies: ['guitar', 'phishing', 'gaming'],
};

const users: Record<string, User> = {};
users[initialUser.id] = initialUser;

export const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  const { pathname, query } = url.parse(req.url!, true);
  const userId = pathname.split('/')[3];
  
  if (pathname.startsWith('/api/users')) {
    switch (req.method) {
      case 'GET':
        if (userId) {
          if (!uuidValidate(userId)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid UUID' }));
          } else if (!users[userId]) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'User not found' }));
          } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(users[userId]));
          }
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(Object.values(users)));
        }
        break;
      case 'POST':
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', () => {
          const { username, age, hobbies } = JSON.parse(body);
          
          // Validate request body here
          
          const id = uuidv4();
          const newUser: User = { id, username, age, hobbies };
          
          users[id] = newUser;
          
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(newUser));
        });
        break;
      // Handle PUT and DELETE requests here
      case 'PUT':
        if (!userId || !uuidValidate(userId)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Invalid UUID' }));
          break;
        }

        if (!users[userId]) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'User not found' }));
          break;
        }

        let putBody = '';
        req.on('data', chunk => {
          putBody += chunk.toString();
        });

        req.on('end', () => {
          const updatedData = JSON.parse(putBody);
          // Validate the updatedData before applying to existing user

          users[userId] = { ...users[userId], ...updatedData };
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(users[userId]));
        });
        break;

      case 'DELETE':
        if (!userId || !uuidValidate(userId)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Invalid UUID' }));
          break;
        }

        if (!users[userId]) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'User not found' }));
          break;
        }

        delete users[userId];
        res.writeHead(204);
        res.end();
        break;
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Not Found' }));
  }
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}/`);
});
