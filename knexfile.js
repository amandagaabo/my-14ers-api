const Knex = require('knex');

exports.knex = Knex({
  client: 'pg',
  useNullAsDefault: true,
  connection: {
    filename: 'my-14ers.db'
  }
});
