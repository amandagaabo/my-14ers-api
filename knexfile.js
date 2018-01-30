module.exports = {
  development: {
    client: 'postgresql',
    useNullAsDefault: true,
    connection: {
      database: 'my-14ers-dev'
    },
    migrations: {
      directory: './migrations',
      tableName: 'migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my-14ers-production'
    },
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
