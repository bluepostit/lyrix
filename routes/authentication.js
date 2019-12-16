const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    console.log('//////////////////')
    console.log(user, err, info)
    if (!user) {
      console.log('no user found')
      return res.json({
        redirect: '/user/login',
        status: 401,
        error: 'not found',
        message: 'Please check your user name and password'
      })
    }
    if (err) {
      console.log('something went wrong authenticating user')
      console.log(err)
      return next(err)
    }
    console.log('trying to log in')
    req.logIn(user, (err) => {
      console.log('in login func')
      if (err) {
        console.log('err!')
        console.log(err)
        return res.json({
          status: 500,
          error: "couldn't log in",
          message: 'There was a problem logging you in'
        })
      }
      console.log('all logged in ok')
      return res.json({
        status: 200,
        user
      })
    })
  })(req, res, next)
})

router.get('/logout', (req, res) => {
  req.logout()
  req.rediret('/')
})

module.exports = router
