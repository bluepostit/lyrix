const express = require('express')
const router = express.Router()
const passport = require('passport')
const objection = require('objection')
const debug = require('debug')('lyrix:route:auth')

const { User } = require('../models')
const { StatusCodes } = require('./common')
const { errorHandler } = require('../helpers/errors')

const signUpValidation = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next({
      statusCode: StatusCodes.FORBIDDEN,
      userMessage: 'You are already logged in'
    })
  }

  const body = req.body
  if (!body.email || !body.password || !body.password2) {
    return next({
      statusCode: StatusCodes.BAD_REQUEST,
      userMessage: 'Please fill in all fields'
    })
  }

  const email = req.body.email.trim()
  const pw1 = req.body.password.trim()
  const pw2 = req.body.password2.trim()
  if (pw1 !== pw2) {
    return next({
      statusCode: StatusCodes.BAD_REQUEST,
      userMessage: 'Please ensure both passwords match'
    })
  }

  if (!email || !pw1 || !pw2) {
    return next({
      statusCode: StatusCodes.BAD_REQUEST,
      userMessage: 'Please fill in all fields'
    })
  }

  const pwMinLength = User.jsonSchema.properties.password.minLength
  if (pw1.length < pwMinLength) {
    return next({
      statusCode: StatusCodes.BAD_REQUEST,
      userMessage: 'Password is too short. ' +
        `It must be at least ${pwMinLength} characters long`
    })
  }
  next()
}

// const buildSignUpValidationErrorMessage = (error) => {
//   const data = error.data
//   let message = ''
//   if (data.email) {
//     message += 'Please check email address.'
//     data.email.forEach((err) => {
//       if (err.keyword === 'required') {
//         message += ' Cannot be empty.'
//       } else if (err.keyword === 'format') {
//         message += 'Must be a vaild email address'
//       }
//     })
//     return message
//   }
// }

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (!user) {
      return next({
        statusCode: StatusCodes.UNAUTHORIZED,
        userMessage: 'Please check your email and password'
      })
    }
    if (err) {
      debug('error authenticating user: %O', err)
      return next(err)
    }
    req.logIn(user, async (err) => {
      if (err) {
        debug('error signing user in: %O', err)
        return next({
          userMessage: 'There was a problem logging you in'
        })
      }
      return res.json({
        status: StatusCodes.OK,
        user: {
          email: user.email,
        }
      })
    })
  })(req, res, next)
})

router.get('/logout', (req, res) => {
  req.logout()
  req.redirect('/')
})

router.post('/sign-up', signUpValidation, async (req, res, next) => {
  try {
    const user = await User.createUser({
      email: req.body.email,
      password: req.body.password
    })
    req.login(user, (err) => {
      if (err) {
        return next(err)
      }
      return res.json({
        status: StatusCodes.OK,
        message: 'You have successfully signed up'
      })
    })
  } catch (error) {
    if (error instanceof objection.ValidationError) {
      debug('invalid input: %O', error)
      return next(error)
    }
    if (error.constraint === 'users_email_unique') {
      debug('email already exists: "%s"', req.body.email)
      error.userMessage = 'An account already exists with that email address'
      return next(error)
    }

    // Something else went wrong.
    debug('something went wrong: %O', error)
    return next("We couldn't complete your sign-up")
  }
})

router.get('/status', async (req, res, next) => {
  res.json({
    status: StatusCodes.OK,
    authenticated: req.isAuthenticated(),
    admin: req.user ? req.user.admin : false
  })
})

router.use(errorHandler())

module.exports = router
