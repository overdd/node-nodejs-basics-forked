import chai from 'chai';
import chaiHttp from 'chai-http';
import { v4 as uuidv4 } from 'uuid';
import { Server } from './../server';
import { CONSTANTS } from './../data/constants';
import dotenv from 'dotenv';

dotenv.config();
chai.use(chaiHttp);
const { expect, request } = chai;
const port = Number(process.env.TESTING_PORT) || 3001;


describe('Server unit tests', () => {
    let server: Server;
    let userId: string;

    before("Generate test data", async () => {
        server = new Server(port);
        await server.start();

        request(`http://localhost:${port}`)
        .post('/api/users')
        .send({
            username: 'unit-test',
            age: 99,
            hobbies: ['testing', 'testing', 'testing'],
        })        
        .end((err, res) => {
            userId = res.body.id;
            expect(err).to.be.null;
            expect(res).to.have.status(201);
            expect(res.body).to.have.property('id');
        });
        
    })

    after("Shut down the server", async()=> {
        await server.stop();
    })

    describe('GET /api/users', () => {
    it('should return a list of users', done => {
        request(`http://localhost:${port}`)
        .get('/api/users')
        .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.be.a('array');
            done();
        });
    });
    });

    describe('GET /api/users/{id}', () => {
    it('should return a user if the id is valid', done => {
        const id = userId;
        request(`http://localhost:${port}`)
        .get(`/api/users/${id}`)
        .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('id');
            done();
        });
    });

    it('should return 400 code if the id is invalid', done => {
        request(`http://localhost:${port}`)
          .get('/api/users/wrond-id')
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body.message).to.equal(CONSTANTS.messages.invalidUid);
            done();
          });
      });
  
      it('should return 404 code if the user does not exist', done => {
        const uuidNeverExisted = uuidv4();
        request(`http://localhost:${port}`)
          .get(`/api/users/${uuidNeverExisted}`)
          .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body.message).to.equal(CONSTANTS.messages.userNotFound);
            done();
          });
      });
    });

    describe('POST /api/users', () => {
    it('should create a new user', done => {
        request(`http://localhost:${port}`)
        .post('/api/users')
        .send({
            username: 'Mogi',
            age: 45,
            hobbies: ['screaming', 'para!'],
        })
        .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(201);
            expect(res.body).to.have.property('id');
            done();
        });
    });
    it('should return 400 code if the username is missing', done => {
        request(`http://localhost:${port}`)
          .post('/api/users')
          .send({
            age: 20,
            hobbies: ['testing'],
          })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body.message).to.equal(`${CONSTANTS.messages.missingFieldsInRequest}username`);
            done();
          });
      });
      it('should return 400 code if the age is missing', done => {
        request(`http://localhost:${port}`)
          .post('/api/users')
          .send({
            username: 'Britne',
            hobbies: ['testing'],
          })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body.message).to.equal(`${CONSTANTS.messages.missingFieldsInRequest}age`);
            done();
          });
      });
      it('should return 400 code if the hobbies are missing', done => {
        request(`http://localhost:${port}`)
          .post('/api/users')
          .send({
            username: 'Britne',
            age: 22,
          })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body.message).to.equal(`${CONSTANTS.messages.missingFieldsInRequest}hobbies`);
            done();
          });
      });
      it('should return 400 code if all field are missing', done => {
        request(`http://localhost:${port}`)
          .post('/api/users')
          .send({
          })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body.message).to.equal(`${CONSTANTS.messages.missingFieldsInRequest}username,age,hobbies`);
            done();
          });
      });
    });

    describe('PUT /api/users/{id}', () => {
    const updatedUsername = 'Tadeusz';
    const updatedAge = 44;
    const updatedHobbies = ['fighting for freedom', 'rebelling'];

    it('should update a user if the id is valid', done => {
        const id = userId;
        request(`http://localhost:${port}`)
        .put(`/api/users/${id}`)
        .send({
            username: updatedUsername,
            age: updatedAge,
            hobbies: updatedHobbies,
        })
        .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body.id).to.equal(userId);
            expect(res.body.username).to.equal(updatedUsername);
            expect(res.body.age).to.equal(updatedAge);
            expect(res.body.hobbies.toString()).to.equal(updatedHobbies.toString());
            done();
        });
    });
    it('should return 400 code if the id is invalid', done => {
        request(`http://localhost:${port}`)
          .put('/api/users/wrond-id')
          .send({
            username: updatedUsername,
            age: updatedAge,
            hobbies: updatedHobbies,
          })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body.message).to.equal(CONSTANTS.messages.invalidUid);
            done();
          });
      });
  
      it('should return 404 code if the user does not exist', done => {
        const uuidNeverExisted = uuidv4();
        request(`http://localhost:${port}`)
          .put(`/api/users/${uuidNeverExisted}`)
          .send({
            username: updatedUsername,
            age: updatedAge,
            hobbies: updatedHobbies,
          })
          .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body.message).to.equal(CONSTANTS.messages.userNotFound);
            done();
          });
      });
    });

    describe('DELETE /api/users/{id}', () => {
    it('should delete a user if the id is valid', done => {
        const id = userId;
        request(`http://localhost:${port}`)
        .delete(`/api/users/${id}`)
        .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(204);
            done();
        });
    });
    it('should return 400 code if the id is invalid', done => {
        request(`http://localhost:${port}`)
          .delete('/api/users/wrond-id')
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body.message).to.equal(CONSTANTS.messages.invalidUid);
            done();
          });
      });
  
      it('should return 404 code if the user does not exist', done => {
        const uuidNeverExisted = uuidv4();
        request(`http://localhost:${port}`)
          .delete(`/api/users/${uuidNeverExisted}`)
          .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body.message).to.equal(CONSTANTS.messages.userNotFound);
            done();
          });
      });

      it('should return 404 code when trying to GET deleted user', done => {
        const id = userId;
        request(`http://localhost:${port}`)
        .get(`/api/users/${id}`)
        .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body.message).to.equal(CONSTANTS.messages.userNotFound);
            done();
        });
    });
    });

    describe('GET /some-non/existing/resource', () => {
        it('should return 404 if the route does not exist', done => {
          request(`http://localhost:${port}`)
            .get('/some-non/existing/resource')
            .end((err, res) => {
              expect(err).to.be.null;
              expect(res).to.have.status(404);
              expect(res.body).to.deep.equal({ message: CONSTANTS.messages.pageNotFound });
              done();
            });
        });
      });
});
