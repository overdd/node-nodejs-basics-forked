import chai from 'chai';
import chaiHttp from 'chai-http';
import { Server } from './../server'; // Make sure to export your server in your server.ts file


chai.use(chaiHttp);
const { expect, request } = chai;



describe('Server unit tests', () => {
    let server: Server;
    let userId: string;

    before("Generate test data", async () => {
        server = new Server(3000);
        await server.start();

        request(`http://localhost:${3000}`)
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
        request(`http://localhost:${3000}`)
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
        request(`http://localhost:${3000}`)
        .get(`/api/users/${id}`)
        .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('id');
            done();
        });
    });
    });

    describe('POST /api/users', () => {
    it('should create a new user', done => {
        request(`http://localhost:${3000}`)
        .post('/api/users')
        .send({
            username: 'test',
            age: 20,
            hobbies: ['coding', 'music'],
        })
        .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(201);
            expect(res.body).to.have.property('id');
            done();
        });
    });
    });

    describe('PUT /api/users/{id}', () => {
    it('should update a user if the id is valid', done => {
        const id = userId;

        request(`http://localhost:${3000}`)
        .put(`/api/users/${id}`)
        .send({
            username: 'updated',
            age: 21,
            hobbies: ['gaming', 'movies'],
        })
        .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body.username).to.equal('updated');
            done();
        });
    });
    });

    describe('DELETE /api/users/{id}', () => {
    it('should delete a user if the id is valid', done => {
        const id = userId;
        request(`http://localhost:${3000}`)
        .delete(`/api/users/${id}`)
        .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(204);
            done();
        });
    });
    });

});
