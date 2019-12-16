const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const { User } = require('../models')

const findUser = (username) => {
  return User
    .query()
    .findOne({ email: username })
}

passport.use(new LocalStrategy(
  (username, password, callback) => {
    console.log('trying to find user now')
    findUser(username)
      .then(async (user, err) => {
        if (err) {
          console.log('error finding user')
          return callback(err)
        }

        if (!user) {
          console.log('user not found!')
          return callback(null, false)
        }

        const match = await user.checkPassword(password)
        console.log('did the password match? ' + match)
        console.log(user)
        if (match) {
          return callback(null, user)
        } else {
          return callback(null, false)
        }
      })
  }
))

passport.serializeUser = (user, callback) => {
  console.log('serializeUser')
  callback(null, user.id)
}

passport.deserializeUser = async (id, callback) => {
  const user = await User.findById(id)
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
