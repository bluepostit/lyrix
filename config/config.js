require('dotenv').config()
module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: '127.0.0.1',
    dialect: 'postgres',
    sessionSecret: process.env.SESSION_SECRET
  },
  test: {
    username: process.env.DB_TEST_USERNAME,
    password: process.env.DB_TEST_PASSWORD,
    database: process.env.DB_TEST_NAME,
    host: '127.0.0.1',
    dialect: 'postgres',
    logging: false,
    sessionSecret: process.env.SESSION_SECRET
  },
  production: {
    connectionUrl: process.env.DB_URL,
    dialect: 'postgres',
    sessionSecret: process.env.SESSION_SECRET
  }
}
