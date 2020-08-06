const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const { User } = require('../models')
const debug = require('debug')('lyrix:auth')

const findUser = (username) => {
  return User
    .query()
    .findOne({ email: username })
}

passport.use(new LocalStrategy(
  (username, password, callback) => {
    findUser(username)
      .then(async (user, err) => {
        if (err) {
          debug('error finding user')
          return callback(err)
        }

        if (!user) {
          debug('user not found!')
          return callback(null, false)
        }

        const match = await user.checkPassword(password)
        if (match) {
          return callback(null, user)
        } else {
          debug("password doesn't match")
          return callback(null, false)
        }
      })
  }
))

passport.serializeUser((user, callback) => {
  callback(null, user.id)
})

passport.deserializeUser(async (id, callback) => {
  const user = await User.query().findById(id)
  if (user) {
    callback(null, user)
  } else {
    debug(`Could not deserialize user #${id}`)
    return callback(new Error(`Could not deserialize user #${id}`))
  }
})

passport.authenticationMiddleware = () => {
  require('./ensure-logged-in')
}

module.exports = (app) => {
  // Initialize Passport and restore authentication state, if any, from the
  // session.
  app.use(passport.initialize())
  app.use(passport.session())
}
