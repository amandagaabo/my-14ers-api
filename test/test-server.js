const chai = require('chai');
const chaiHttp = require('chai-http');
const User = require('../models/User');
const { app, runServer, closeServer } = require('../server');

const should = chai.should();
chai.use(chaiHttp);

describe('peak routes', function () {
  before(() => {
    console.log('before running')
    return runServer('postgresql://localhost/my-14ers-test')
      .then(() => {
        return User
          .query()
          .insert({
            email: 'amanda@test.com',
            password: 'password123',

            // peaks: [{
            //   imgSrc: 'https://res.cloudinary.com/amhprojects/image/upload/v1514516749/14ers/mt_elbert.jpg',
            //   peakName: 'Mt. Elbert',
            //   range: 'Sawatch Range',
            //   rank: 1,
            //   elevation: 14433,
            //   towns: 'Leadville, Twin Lakes, Aspen',
            //   latitude: 39.117777777777775,
            //   longitude: -106.44472222222223,
            //   dateClimbed: '07-07-2017',
            //   notes: 'it was fun'
            // },
            // {
            //   imgSrc: 'https://res.cloudinary.com/amhprojects/image/upload/v1514516746/14ers/blanca.jpg',
            //   peakName: 'Blanca Peak',
            //   range: 'Sangre de Cristo',
            //   rank: 4,
            //   elevation: 14345,
            //   towns: 'Fort Garland, Blanca, Alamosa',
            //   latitude: 37.577222222222225,
            //   longitude: -105.48527777777778,
            //   dateClimbed: '10-15-2016',
            //   notes: 'very cold'
            // }]
          });
      });
  });

  // beforeEach(() => {
  //   return User.hashPassword(password)
  //     .then((password) => {
  //       return User.create({
  //         email,
  //         password,
  //         firstName,
  //         lastName
  //       })
  //         .then((res) => {
  //           // save id for token and grocery seeding
  //           return userID = res.id;
  //         })
  //         .then((userID) => {
  //           token = createToken(userID);
  //           const seedData = generateSeedData(userID);
  //           return Grocery.insertMany(seedData);
  //         })
  //         .then((groceries) => {
  //           // save groceries for access in update test
  //           groceriesInDB = groceries;
  //         });
  //     });
  // });
  //
  // afterEach(() => {
  //   return clearDB();
  // });

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
        .get('/users/123/peaks')
        .end((req, res) => {
          console.log(req);
          console.log(res);
        });
    });
  });
});
