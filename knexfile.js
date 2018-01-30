const { DATABASE_URL } = require('./config');

module.exports = {
  development: {
    client: 'postgresql',
    useNullAsDefault: true,
    connection: DATABASE_URL,
    migrations: {
      directory: './migrations',
      tableName: 'migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './migrations',
      tableName: 'migrations'
    }
  }
};
