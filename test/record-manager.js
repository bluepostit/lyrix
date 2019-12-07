const path = require('path')

const toSnakeCase = (camel) => {
  const re = /([a-z])([A-Z])/g
  return camel.replace(re, '$1-$2').toLowerCase()
}

class RecordManager {
  static async deleteAll (className) {
    const moduleName = toSnakeCase(className)
    const modelPath = path.join('..', 'models', moduleName)
    const modelClass = require(modelPath)
    // console.log(`Deleting all: ${className}`)

    await modelClass.query().delete()
  }
}

module.exports = RecordManager
