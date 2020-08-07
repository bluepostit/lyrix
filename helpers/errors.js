const {
  DBError,
  ConstraintViolationError,
  UniqueViolationError,
  NotNullViolationError,
  ForeignKeyViolationError,
  ValidationError
} = require('objection')
const debug = require('debug')('lyrix:err')
const { StatusCodes } = require('../routes/common')

const getStatus = (err) => {
  if (err.statusCode) {
    return err.statusCode
  }
  if (err instanceof ForeignKeyViolationError
    || err.type === 'ForeignKeyViolationError') {
    return StatusCodes.BAD_REQUEST
  }
  if (err instanceof ConstraintViolationError
    || err.type === 'ConstraintViolationError') {
      return StatusCodes.BAD_REQUEST
  }
  if (err instanceof UniqueViolationError
    || err.type === 'UniqueViolationError') {
      return StatusCodes.BAD_REQUEST
  }
  return StatusCodes.INTERNAL_SERVER_ERROR
}

const errorHandler = (entityName) => {
  return (async (err, req, res, next) => {
    // console.log(`hit error handler for ${entityName}`)

    const status = getStatus(err)
    // console.log(`status: ${status}`)

    if (err instanceof ValidationError) {
      err.userMessage = err.message
    }

    const error = {
      error: err.userMessage || `Problem processing ${entityName} request`,
      status
    }
    error.redirect = err.redirect
    debug(error)
    debug('original error: %O', err)
    res.json(error)
  })
}

module.exports = { errorHandler }
