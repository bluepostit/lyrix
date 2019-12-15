const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const db = require('../models')

const findUser = (username) => {
  return db.User
    .query()
    .findOne({ email: username })
}

passport.use(new LocalStrategy(
  (username, password, callback) => {
    findUser(username)
      .then(async (err, user) => {
        if (err) {
          return callback(err)
        }

        if (!user) {
          console.log('User not found!')
          return callback(null, false)
        }

        const match = await user.checkPassword(password)
        if (match) {
          return callback(null, user)
        } else {
          return callback(null, false)
        }
      })
  }
))

passport.serializeUser = (user, callback) => {
  callback(null, user.id)
}

passport.deserializeUser = async (id, callback) => {
  const user = await db.User.findById(id)
  // if (user) {
    callback(null, user)
  // } else {

  //   return callback(`Could not deserialize user ${id}`)
  // }
}

passport.authenticationMiddleware = () => {
  require('./ensure-logged-in')
}

module.exports = (app) => {
  // Initialize Passport and restore authentication state, if any, from the
  // session.
  app.use(passport.initialize())
  app.use(passport.session())
}
