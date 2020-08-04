const {
  DBError,
  ConstraintViolationError,
  UniqueViolationError,
  NotNullViolationError,
  ForeignKeyViolationError,
  ValidationError
} = require('objection')
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
    || err.type === ConstraintViolationError) {
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
    // console.log(err)

    const status = getStatus(err)
    // console.log(`status: ${status}`)

    if (err instanceof ValidationError) {
      err.userMessage = err.message
    }

    res.json({
      error: err.userError || 'Error',
      message: err.userMessage || `Problem processing ${entityName} request`,
      status
    })
  })
}

module.exports = { errorHandler }
