const path = require('path')
const { toSnakeCase } = require('../util')

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
