const chai = require('chai');
const chaiHttp = require('chai-http');
const Peak = require('../models/Peak');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./../config/config');
const { app, runServer, closeServer } = require('../server');
const { testPeaks, testUsers } = require('./test-data');

const { userId } = testPeaks[0];
const peakId = testPeaks[0].uuid;

const existingUser = {
  email: testUsers[0].email,
  uuid: testUsers[0].uuid
};

const token = jwt.sign({ user: existingUser }, JWT_SECRET, {
  subject: existingUser.email,
  expiresIn: '7d',
  algorithm: 'HS256'
});

const newPeak =
  {
    peakName: 'Mt. Antero',
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
    it('should fail without auth token', function () {
      return chai.request(app)
        .get(`/users/${userId}/peaks`)
        .then(() =>
          should.fail(null, null, 'Request should not succeed'))
        .catch((err) => {
          err.response.should.have.status(401);
          err.response.text.should.equal('Unauthorized');
        });
    });

    it('should return user peaks with valid auth token', function () {
      return chai.request(app)
        .get(`/users/${userId}/peaks`)
        .set('authorization', `Bearer ${token}`)
        .then((res) => {
          const userPeaks = testPeaks.filter(peak => peak.userId === userId);
          res.body[0].uuid.should.equal(userPeaks[0].uuid);
          res.body[1].uuid.should.equal(userPeaks[1].uuid);
          res.body[0].uuid.should.not.equal(testPeaks[2].uuid);
          res.body[1].uuid.should.not.equal(testPeaks[2].uuid);

          return Promise.resolve();
        });
    });
  });

  describe('POST request to /users/:userId/peaks', function () {
    it('should fail without auth token', function () {
      return chai.request(app)
        .post(`/users/${userId}/peaks`)
        .send(newPeak)
        .then(() =>
          should.fail(null, null, 'Request should not succeed'))
        .catch((err) => {
          err.response.should.have.status(401);
          err.response.text.should.equal('Unauthorized');
        });
    });

    it('should add a new peak with valid auth token', function () {
      return chai.request(app)
        .post(`/users/${userId}/peaks`)
        .set('authorization', `Bearer ${token}`)
        .send(newPeak)
        .then((res) => {
          res.should.have.status(201);
          res.body.peakName.should.equal(newPeak.peakName);
          res.body.dateClimbed.should.equal(newPeak.dateClimbed);
          return Promise.resolve();
        });
    });
  });

  describe('DELETE request to /users/:userId/:peakId', function () {
    it('should fail without auth token', function () {
      return chai.request(app)
        .delete(`/users/${userId}/${peakId}`)
        .then(() =>
          should.fail(null, null, 'Request should not succeed'))
        .catch((err) => {
          err.response.should.have.status(401);
          err.response.text.should.equal('Unauthorized');
        });
    });

    it('should remove a peak with valid auth token', function () {
      return chai.request(app)
        .delete(`/users/${userId}/${peakId}`)
        .set('authorization', `Bearer ${token}`)
        .then((res) => {
          res.should.have.status(200);
          res.body.message.should.equal('peak deleted');
          return Peak
            .query()
            .skipUndefined()
            .where('userId', userId)
            .then((peaks) => {
              const ids = peaks.map(peak => peak.uuid);
              ids.should.not.include(peakId);
              return Promise.resolve();
            });
        });
    });
  });
});
