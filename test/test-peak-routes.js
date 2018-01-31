const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, runServer, closeServer } = require('../server');
const { testPeaks } = require('./test-data');

const { userId } = testPeaks[0];

const newPeak =
  {
    peak_name: 'Mt. Antero',
    dateClimbed: '2018-01-30T06:00:00.000Z',
    notes: 'yay hiking!',
    imgSrc: 'https://res.cloudinary.com/amhprojects/image/upload/v1514516745/14ers/antero.jpg',
    range: 'Sawatch Range',
    rank: 10,
    elevation: '14269',
    latitude: '38.67388889',
    longitude: '-106.24611111'
  };

const should = chai.should();
chai.use(chaiHttp);

describe('peak routes', function () {
  before(() => {
    return runServer();
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
        .get(`/users/${userId}/peaks`)
        .then((res) => {
          const userPeaks = testPeaks.filter(peak => peak.userId === userId);
          res.text.should.contain(userPeaks[0].uuid);
          res.text.should.contain(userPeaks[1].uuid);
          res.text.should.not.contain(testPeaks[2].uuid);
        });
    });
  });

  describe('POST request to /users/:userId/peaks', function () {
    it('should add a new peak', function () {
      return chai.request(app)
        .post(`/users/${userId}/peaks`)
        .send(newPeak)
        .then((res) => {
          res.should.have.status(201);
          res.body.peakName.should.equal(newPeak.peak_name);
          res.body.dateClimbed.should.equal(newPeak.dateClimbed);
        });
    });
  });
});
