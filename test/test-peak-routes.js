const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, runServer, closeServer } = require('../server');

const should = chai.should();
chai.use(chaiHttp);

describe('peak routes', function () {
  before(() => {
    console.log('before');
    return runServer('postgresql://localhost/my-14ers-test');
  });

  after(() => {
    return closeServer();
  });

  describe('GET request to /test', function () {
    it('should respond with 404 Not Found', function () {
      return chai.request(app)
        .get('/test')
        .catch((err) => {
          err.should.have.status(404);
          err.response.body.message.should.equal('404 Not Found');
          return Promise.resolve();
        });
    });
  });

  describe('GET request to /users/:userId/peaks', function () {
    it('should return user peaks', function () {
      return chai.request(app)
        .get('/users/1/peaks')
        .end((req, res) => {
          console.log(res);
        });
    });
  });
});
