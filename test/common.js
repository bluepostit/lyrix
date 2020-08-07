const debugModule = require('debug')
const nodemon = require('nodemon')

/**
 * Gets a debugger instance for debug logging.
 * If the environment variable `VERBOSE` is set with a truthy value,
 * the new debugger namespace will be enabled along with all currently
 * enabled namespaces.
 *
 * @param {string} namespace the namespace to use for debugging
 * @see https://github.com/visionmedia/debug
 */
const getDebugger = (namespace = 'lyrix:test-suite') => {
  const debug = debugModule(namespace)
  if (process.env['VERBOSE']) {
    const namespaces = debugModule.disable()
    if (namespaces) {
      debugModule.enable(`${namespaces},${namespace}`)
    } else {
      debugModule.enable(namespace)
    }
  }
  return debug
}

module.exports = { getDebugger }
