const chai = require('chai');
const chaiHttp = require('chai-http');
const { app } = require('../server');

const should = chai.should();
chai.use(chaiHttp);

describe('/ route', function() {
  it('should tbd', function() {
    return chai.request(app)
      .get('/')
      .then(function(res) {

      });
  });
});
