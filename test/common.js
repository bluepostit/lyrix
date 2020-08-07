const debugModule = require('debug')
const nodemon = require('nodemon')

const getDebugger = (namespace = 'lyrix:test-suite') => {
  const debug = debugModule(namespace)
  if (process.env['VERBOSE']) {
    debugModule.enable(namespace)
  }
  return debug
}

module.exports = { getDebugger }
