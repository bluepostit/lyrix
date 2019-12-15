const path = require('path')
const config = require(path.join(__dirname, 'config'))

module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      database: config.database,
      user:     config.username,
      password: config.password
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: path.join(__dirname, 'db/migrations'),
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: path.join(__dirname, 'db/seeds/development')
    }
  },

  test: {
    client: 'postgresql',
    connection: {
      database: config.database,
      user:     config.username,
      password: config.password
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: path.join(__dirname, '/db/migrations'),
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: path.join(__dirname, '/db/seeds/test')
    }
  },

  production: {
    client: 'postgresql',
    connection: config.connectionUrl,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: path.join(__dirname, 'db/migrations'),
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: path.join(__dirname, 'db/seeds/production')
    }
  }
}
