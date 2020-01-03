const session = require('express-session')
const redis = require('redis')
const connectRedis = require('connect-redis')
const RedisStore = connectRedis(session)

const createRedisClient = () => {
  let client = null

  const redisUrl = process.env.REDIS_URL
  if (redisUrl) {
    client = redis.createClient(redisUrl)
  } else {
    client = redis.createClient()
  }
  client.on('error', (err) => {
    console.log('Redis error: ', err)
  })
  return client
}

module.exports = {
  init: (app, config) => {
    const redisClient = createRedisClient()

    // Session
    app.use(session({
      name: '_lyrix',
      secret: config.sessionSecret,
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },
      store: new RedisStore({
        client: redisClient,
        ttl: 86400
      })
    }))
  }
}
