const path = require('path')

class RecordManager {
  static async deleteAll (className) {
    const modelPath = path.join('..', 'models', className.toLowerCase())
    const modelClass = require(modelPath)

    await modelClass.query().delete()
  }
}

module.exports = RecordManager
