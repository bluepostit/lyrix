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

const toKebabCase = (phrase) => {
  const words = phrase.split(/\s+/)
  return words.join('-')
}

/**
 * Build an 'index' object for the given directory.
 * Requires all modules in the given directory, and
 * adds them to an object, which is returned.
 * Uses lazy loading to ensure that a child module is
 * loaded only when needed, in order to conserve resources.
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
    // Lazy loading of the child module
    Object.defineProperty(moduleIndex, className, {
      enumerable: true,
      get () {
        return require(modulePath)
      }
    })
  })
  return moduleIndex
}

// https://www.tomas-dvorak.cz/posts/nodejs-request-without-dependencies/
const getContent = (url) => {
  let recursedTimes = 0
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? require('https') : require('http')
    const request = lib.get(url, (response) => {
      const statusCode = response.statusCode
      if (statusCode === 301 || statusCode === 302) {
        recursedTimes += 1
        if (recursedTimes <= 5) {
          console.log('redirecting...')
          resolve(getContent(response.headers.location))
        } else {
          reject(new Error(`Too many redirects. Location: ${response.headers.location}`))
        }
      } else if (statusCode < 200 || statusCode > 299) {
        reject(new Error(`Failed to load content. Status code: ${statusCode}`))
      }
      const body = []
      response.on('data', (chunk) => body.push(chunk))
      response.on('end', () => resolve(body.join('')))
    })
    request.on('error', (err) => reject(err))
  })
}

module.exports = {
  buildModuleIndex,
  getContent,
  toCamelCase,
  toKebabCase,
  toSnakeCase
}
