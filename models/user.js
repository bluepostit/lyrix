'use strict'

const { Model } = require('objection')
const bcrypt = require('bcrypt')
const knex = require('../db/knex')

const SALT_ROUNDS = 10

Model.knex(knex)

const encrypt = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS)
}

module.exports = class User extends Model {
  static get tableName () {
    return 'users'
  }

  static get relationMappings () {
    const SongList = require('./song-list')
    return {
      songLists: {
        relation: Model.HasManyRelation,
        modelClass: SongList,
        join: {
          from: 'users.id',
          to: 'song_lists.user_id'
        }
      }
    }
  }

  static get jsonSchema () {
    return {
      $schema: 'http://json-schema.org/schema#',
      type: 'object',
      required: ['email', 'password'],

      properties: {
        email: {
          type: 'string',
          minLength: 6,
          maxLength: 24,
          format: 'email'
        },
        password: {
          type: 'string',
          minLength: 12
        }
      }
    }
  }

  static async createUser (dataObject) {
    const hash = await encrypt(dataObject.password)
    return User.query().insert({
      email: dataObject.email,
      password: hash
    })
  }

  async checkPassword (password) {
    const match = await bcrypt.compare(password, this.password)
    return !!match
  }
}
