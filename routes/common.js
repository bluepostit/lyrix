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

/**
 * Returns a middleware function to be used to validate the request.
 * Ensures that the request has an ID in its parameters.
 * If `entityClass` is provided (as an Objection Model class),
 * this function will check if an entity of that type, with the given id,
 * exists.
 * @param {class} entityClass
 */
const validateIdForEntity = (entityClass = null) => {
  return async (req, res, next) => {
    const id = req.params.id
    if (!id) {
      return res.json({
        status: StatusCodes.BAD_REQUEST,
        error: 'Invalid input',
        message: 'You must provide a valid id'
      })
    }
    if (entityClass) {
      const entity = await entityClass
        .query()
        .findById(id)
      if (!entity) {
        return res.json({
          status: StatusCodes.NOT_FOUND,
          error: 'Not found',
          message: 'No entity found with that id'
        })
      }
      req.entity = entity
    }
    next()
  }
}

const validateDataForEntity = (entityClass) => {
  return async (req, res, next) => {
    try {
      // Trigger model class's validation rules
      await entityClass.fromJson(req.body)
      await next()
    } catch (e) {
      return res.json({
        status: StatusCodes.BAD_REQUEST,
        error: 'Invalid input',
        message: e.message
      })
    }
  }
}


module.exports = {
  StatusCodes,
  ensureAdmin,
  checkIsAdmin,
  validateIdForEntity,
  validateDataForEntity
}
