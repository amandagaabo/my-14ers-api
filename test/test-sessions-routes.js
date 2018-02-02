const chai = require('chai');
const chaiHttp = require('chai-http');
const User = require('../models/User');
const { app, runServer, closeServer } = require('../server');
const { testUsers } = require('./test-data');

const should = chai.should();
chai.use(chaiHttp);

describe.only('Sessions Routes', function () {
  before(() => {
    return runServer();
  });

  after(() => {
    return closeServer();
  });

  describe('POST requests to /sign-up', function () {
    it('should fail with missing field', function () {
      const missingPW =
        {
          email: 'amanda@test.com',
        };

      return chai.request(app)
        .post('/sign-up')
        .send(missingPW)
        .catch((err) => {
          err.should.have.status(422);
          err.response.body.message.should.equal('Missing field');
        });
    });

    it('should fail if fields have whitespace', function () {
      const whitspaceUser =
        {
          email: '  amanda@test.com',
          password: 'Password123'
        };

      return chai.request(app)
        .post('/sign-up')
        .send(whitspaceUser)
        .catch((err) => {
          err.should.have.status(422);
          err.response.body.message.should.equal('Cannot start or end with whitespace');
        });
    });

    it('should fail if password is too short', function () {
      const shortPW =
        {
          email: 'amanda@test.com',
          password: '1'
        };

      return chai.request(app)
        .post('/sign-up')
        .send(shortPW)
        .catch((err) => {
          err.should.have.status(422);
          err.response.body.message.should.equal('Must be at least 8 characters long');
        });
    });

    it('should fail with email that is already in use', function () {
      const existingUser =
        {
          email: testUsers[0].email,
          password: testUsers[0].password
        };

      return chai.request(app)
        .post('/sign-up')
        .send(existingUser)
        .catch((err) => {
          err.should.have.status(422);
          err.response.body.message.should.equal('Email already taken');
        });
    });

    it('should create new user on successful submit', function () {
      const newUser =
        {
          email: 'jane@test.com',
          password: 'fakePassword1'
        };

      return chai.request(app)
        .post('/sign-up')
        .send(newUser)
        .then((res) => {
          res.should.have.status(201);
          res.body.should.be.an('object');
          res.body.should.include.keys(
            'email', 'uuid'
          );
          res.body.email.should.equal(newUser.email);
          return User
            .query()
            .skipUndefined()
            .where('email', newUser.email);
        })
        .then((user) => {
          user[0].email.should.equal(newUser.email);
          user[0].uuid.should.not.be.null;
          // password should be hashed so it should not equal the submitted password
          user[0].password.should.not.equal(newUser.password);
        });
    });
  });

  // describe('POST requests to /login', function () {
  //   it('should fail with no credentials ', function () {
  //     return chai.request(app)
  //       .post('/login')
  //       .send({ email: '', password: '' })
  //       .then(() => {
  //         should.fail(null, null, 'Request should not succeed');
  //       })
  //       .catch((err) => {
  //         if (err instanceof chai.AssertionError) {
  //           throw err;
  //         }
  //         const res = err.response;
  //         res.should.have.status(400);
  //       });
  //   });
  // });
});
