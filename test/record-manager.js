const path = require('path')
const { toSnakeCase } = require('../util')

const MODEL_CLASSES_IN_DELETE_ORDER =
  ['SongItem', 'SongItemType', 'SongListSong', 'SongList', 'User', 'Song', 'Artist']

const deleteAllForClassName = async (className) => {
  const moduleName = toSnakeCase(className)
  const modelPath = path.join('..', 'models', moduleName)
  const modelClass = require(modelPath)
  // console.log(`Deleting all: ${className}`)

  await modelClass.query().delete()
}

class RecordManager {
  static async deleteAll (className = null) {
    if (className) {
      await deleteAllForClassName(className)
      return
    }

    for (let i = 0; i < MODEL_CLASSES_IN_DELETE_ORDER.length; i++) {
      await deleteAllForClassName(MODEL_CLASSES_IN_DELETE_ORDER[i])
    }
  }
}

module.exports = RecordManager
