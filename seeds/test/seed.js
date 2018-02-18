const { runServer, closeServer } = require('./../../server');
const User = require('./../../models/User');
const Peak = require('./../../models/Peak');

const { testUsers, testPeaks } = require('../../test/test-data');

exports.seed = function () {
  // start server so models are bound to a knex instance
  return runServer()
    .then(() => {
      // delete all users from users table
      return User.query().delete();
    })
    .then(() => {
      // delete all peaks from peaks table
      return Peak.query().delete();
    })
    .then(() => {
      // insert test users
      return User.query().insert(testUsers);
    })
    .then(() => {
      // insert test peaks
      return Peak.query().insert(testPeaks);
    })
    .then(() => {
      return closeServer();
    });
}; 
