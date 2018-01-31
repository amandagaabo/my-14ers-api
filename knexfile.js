module.exports = {
  development: {
    client: 'pg',
    useNullAsDefault: true,
    connection: 'postgres://localhost/my-14ers-dev',
    seeds: {
      directory: './seeds/test/'
    },
    migrations: {
      directory: './migrations',
      tableName: 'migrations'
    }
  },

  test: {
    client: 'pg',
    connection: 'postgres://localhost/my-14ers-test',
    seeds: {
      directory: './seeds/test/'
    },
    migrations: {
      directory: './migrations',
      tableName: 'migrations'
    }
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
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
