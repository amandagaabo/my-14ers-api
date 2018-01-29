const chai = require('chai');
const chaiHttp = require('chai-http');
const { app } = require('../server');

const should = chai.should();
chai.use(chaiHttp);

describe('/test route', function () {
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
