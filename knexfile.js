const knex = require('knex')({
  client: 'pg',
  useNullAsDefault: true,
  connection: {
    host: 'localhost'
  }
});

module.exports = knex;
