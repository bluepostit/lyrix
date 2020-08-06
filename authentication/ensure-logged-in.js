const debug = require('debug')('lyrix:auth')
const { StatusCodes } = require("../routes/common")

module.exports = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  debug('Unauthorized: must sign in')
  res.json({
    status: StatusCodes.UNAUTHORIZED,
    error: 'You must log in to access this'
  })
}
