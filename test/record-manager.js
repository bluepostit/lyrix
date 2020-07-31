const path = require('path')
const fixtures = require('simple-knex-fixtures')
const User = require('../models/user')
const { toSnakeCase } = require('../util')
const knex = require('../db/knex')

const DEFAULT_USER_DATA = {
  email: 'bob@bob.com',
  password: '123456'
}

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

  static async loadFixture (name) {
    const dirPrefix = path.join(__dirname, 'fixtures')
    return await fixtures.loadFile(`${dirPrefix}/${name}.json`, knex)
  }

  static async insertUser(data) {
    data = data || DEFAULT_USER_DATA
    data.email = data.email || DEFAULT_USER_DATA.email
    data.password = data.password || DEFAULT_USER_DATA.password
    const user = await User.createUser(data)
    user.unencryptedPassword = data.password
    return user
  }
}

module.exports = RecordManager
