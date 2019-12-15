const env = process.env.NODE_ENV || 'development'
const envConfig = require('./config')[env]

module.exports = envConfig
