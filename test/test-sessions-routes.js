const chai = require('chai');
const chaiHttp = require('chai-http');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./../config/config');
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
        .then(() =>
          should.fail(null, null, 'Request should not succeed'))
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
        .then(() =>
          should.fail(null, null, 'Request should not succeed'))
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
        .then(() =>
          should.fail(null, null, 'Request should not succeed'))
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
        .then(() =>
          should.fail(null, null, 'Request should not succeed'))
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

  describe.only('POST requests to /login', function () {
    it('should fail with no credentials ', function () {
      const emptyUser =
        {
          email: '',
          password: ''
        };

      return chai.request(app)
        .post('/login')
        .send(emptyUser)
        .then(() =>
          should.fail(null, null, 'Request should not succeed'))
        .catch((err) => {
          err.response.should.have.status(400);
          err.response.text.should.equal('Bad Request');
        });
    });

    it('should fail with incorrect email', () => {
      const wrongEmail =
        {
          email: 'wrong@test.com',
          password: testUsers[0].password
        };

      return chai.request(app)
        .post('/login')
        .send(wrongEmail)
        .then(() =>
          should.fail(null, null, 'Request should not succeed'))
        .catch((err) => {
          err.response.should.have.status(401);
          err.response.text.should.equal('Unauthorized');
        });
    });

    it('should fail with incorrect password', () => {
      const wrongPW =
        {
          email: testUsers[0].email,
          password: 'wrongPassword'
        };

      return chai.request(app)
        .post('/login')
        .send(wrongPW)
        .then(() =>
          should.fail(null, null, 'Request should not succeed'))
        .catch((err) => {
          err.response.should.have.status(401);
          err.response.text.should.equal('Unauthorized');
        });
    });

    it('should return a valid auth token on successful login', () => {
      const existingUser =
        {
          email: testUsers[0].email,
          password: testUsers[0].password
        };

      return chai.request(app)
        .post('/login')
        .send(existingUser)
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          const token = res.body.authToken;
          token.should.be.a('string');
          const payload = jwt.verify(token, JWT_SECRET, {
            algorithm: ['HS256']
          });
          payload.email.should.equal(existingUser.email);
        });
    });
  });
});
