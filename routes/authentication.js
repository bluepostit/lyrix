const express = require('express')
const router = express.Router()
const passport = require('passport')

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

module.exports = router
