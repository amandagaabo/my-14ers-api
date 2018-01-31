const { testUsers, testPeaks } = require('../../test/test-data');

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users').del().then(function () {
    // insert seed users
    return knex('users').insert(testUsers);
  }).then(function () {
    return knex('peaks').del().then(function () {
      return knex('peaks').insert(testPeaks);
    });
  });
};
