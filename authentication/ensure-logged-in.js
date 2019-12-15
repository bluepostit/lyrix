module.exports = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  console.log('not logged in! redirecting now')
  res.json({
    status: 401,
    error: 'You must log in to access this'
  })
}
