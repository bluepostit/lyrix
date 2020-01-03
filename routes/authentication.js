const express = require('express')
const router = express.Router()
const passport = require('passport')
const objection = require('objection')

const { User } = require('../models')

const signUpValidation = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.json({
      status: 403,
      error: 'You are already logged in',
      message: 'You are already logged in'
    })
  }

  const body = req.body
  if (!body.email || !body.password || !body.password2) {
    return res.json({
      status: 400,
      error: 'Something went wrong',
      message: 'Please fill in all fields'
    })
  }

  const email = req.body.email.trim()
  const pw1 = req.body.password.trim()
  const pw2 = req.body.password2.trim()
  if (pw1 !== pw2) {
    return res.json({
      status: 400,
      error: 'Passwords do not match',
      message: 'Please ensure both passwords match'
    })
  }

  if (!email || !pw1 || !pw2) {
    return res.json({
      status: 400,
      error: 'Email and password cannot be empty',
      message: 'Fields cannot be empty'
    })
  }

  const pwMinLength = User.jsonSchema.properties.password.minLength
  if (pw1.length < pwMinLength) {
    return res.json({
      status: 400,
      error: 'Password too short',
      message: 'Password is too short. ' +
        `It must be at least ${pwMinLength} characters long`
    })
  }
  next()
}

const buildSignUpValidationErrorMessage = (error) => {
  const data = error.data
  let message = ''
  if (data.email) {
    message += 'Please check email address.'
    data.email.forEach((err) => {
      if (err.keyword === 'required') {
        message += ' Cannot be empty.'
      } else if (err.keyword === 'format') {
        message += 'Must be a vaild email address'
      }
    })
    return message
  }
}

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    // console.log(user, err, info)
    if (!user) {
      console.log('no user found or incorrect credentials')
      return res.json({
        redirect: '/user/login',
        status: 401,
        error: 'not found',
        message: 'Please check your user name and password'
      })
    }
    if (err) {
      console.log('error authenticating user')
      console.log(err)
      return next(err)
    }
    req.logIn(user, async (err) => {
      if (err) {
        console.log('error logging in user')
        console.log(err)
        return res.json({
          status: 500,
          error: "couldn't log in",
          message: 'There was a problem logging you in'
        })
      }
      return res.json({
        status: 200,
        user: {
          email: user.email,
          songLists: await user.$relatedQuery('songLists')
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
        status: 200,
        message: 'You have successfully signed up'
      })
    })
  } catch (error) {
    if (error instanceof objection.ValidationError) {
      return res.json({
        status: 400,
        error: 'Invalid input',
        message: buildSignUpValidationErrorMessage(error)
      })
    }
    if (error.constraint === 'users_email_unique') {
      return res.json({
        status: 400,
        error: 'Email already exists',
        message: 'An account already exists with that email address'
      })
    }

    // Something else went wrong.
    console.log(error)
    return res.json({
      status: 500,
      error: 'Server error',
      message: 'Something went wrong'
    })
  }
})

module.exports = router
