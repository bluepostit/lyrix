const StatusCodes = (() => {
  return {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
  }
})()

const ensureAdmin = async (req, res, next) => {
  if (req.user.admin) {
    next()
  } else {
    res.json({
      status: StatusCodes.FORBIDDEN,
      error: 'Unauthorized',
      message: 'You are not authorized to do this action'
    })
  }
}

const checkIsAdmin = async (req, res, next) => {
  let isAdmin = false
  if (req.user) {
    isAdmin = req.user.admin
  }
  req.isAdmin = isAdmin
  next()
}

module.exports = {
  StatusCodes,
  ensureAdmin,
  checkIsAdmin
}
