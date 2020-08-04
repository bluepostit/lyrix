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
    next({
      statusCode: StatusCodes.FORBIDDEN,
      userMessage: 'You are not authorized to do this action'
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
      return next({
        statusCode: StatusCodes.BAD_REQUEST,
        userMessage: 'You must provide a valid id'
      })
    }
    if (entityClass) {
      const entity = await entityClass
        .query()
        .findById(id)
      if (!entity) {
        return next({
          statusCode: StatusCodes.NOT_FOUND,
          userMessage: 'No entity found with that id'
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
      return next(e)
    }
  }
}

const ensureOwnershipForEntity = (entityName, userField = 'user_id') => {
  return async (req, res, next) => {
    const entity = req.entity
    const entityUserId = entity[userField]
    if (!entityUserId || (req.user.id != entityUserId)) {
      return next({
        statusCode: StatusCodes.FORBIDDEN,
        userMessage: `This ${entityName} does not belong to you`
      })
    }
    next()
  }
}

const checkForDuplicatesForEntity = (
  entityClass, fields, forUser = true, userField = 'user_id') => {
    return async (req, res, next) => {
      const entity = req.entity
      const body = req.body

      const where = {}
      fields.forEach(field => where[field] = body[field])
      const query = entityClass
        .query()
        .first()
        .where(where)

      if (forUser && userField) {
        query.where({ [userField]: req.user.id })
      }
      // console.log(query.toKnexQuery().toSQL().toNative())
      const duplicate = await query
      if (duplicate) {
        return next({
          type: 'UniqueViolationError',
          userMessage: 'A similar song item already exists'
        })
      }
      next()
    }
}

module.exports = {
  StatusCodes,
  ensureAdmin,
  checkIsAdmin,
  ensureOwnershipForEntity,
  checkForDuplicatesForEntity,
  validateIdForEntity,
  validateDataForEntity
}
