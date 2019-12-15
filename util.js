const path = require('path')
const glob = require('glob')

const toSnakeCase = (camel) => {
  const re = /([a-z])([A-Z])/g
  return camel.replace(re, '$1-$2').toLowerCase()
}

const toCamelCase = (snake) => {
  const re = /(^\w)|(([a-z])-([a-z]))/g
  return snake.replace(re,
    (match, p1, p2, p3, p4, offset, string) => {
      if (p1) {
        return p1.toUpperCase()
      }
      return p3 + p4.toUpperCase()
    }
  )
}

/**
 * Build an 'index' object for the given directory.
 * Requires all modules in the given directory, and
 * adds them to an object, which is returned.
 */
const buildModuleIndex = (directory) => {
  const moduleIndex = {}
  const matches = glob.sync('*.js', {
    cwd: directory
  })
  matches.splice(matches.indexOf('index.js'), 1)
  matches.forEach((match) => {
    const fileName = match.replace('.js', '')
    const className = toCamelCase(fileName)
    const modulePath = path.join(directory, fileName)
    Object.defineProperty(moduleIndex, className, {
      enumerable: true,
      get () {
        return require(modulePath)
      }
    })
    // moduleIndex[className] = require(modulePath)
  })
  return moduleIndex
}

module.exports = {
  buildModuleIndex,
  toCamelCase,
  toSnakeCase
}
