const session = require('express-session')
const redis = require('redis')
const connectRedis = require('connect-redis')
const RedisStore = connectRedis(session)

module.exports = {
  init: (app, config) => {
    const redisClient = redis.createClient()
    redisClient.on('error', (err) => {
      console.log('Redis error: ', err)
    })

    // Session
    app.use(session({
      name: '_lyrix',
      secret: config.sessionSecret,
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },
      store: new RedisStore({
        host: 'localhost',
        port: 6379,
        client: redisClient,
        ttl: 86400
      })
    }))
  }
}
