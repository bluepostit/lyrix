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
    const SongItem = require('./song-item')

    return {
      songLists: {
        relation: Model.HasManyRelation,
        modelClass: SongList,
        join: {
          from: 'users.id',
          to: 'song_lists.user_id'
        }
      },
      songItems: {
        relation: Model.HasManyRelation,
        modelClass: SongItem,
        join: {
          from: 'users.id',
          to: 'song_items.user_id'
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
          maxLength: 255,
          format: 'email'
        },
        password: {
          type: 'string',
          minLength: 6
        },
        admin: {
          type: 'boolean'
        }
      }
    }
  }

  /**
   * Creates a new user, storing only a hashed version of the password.
   *
   * NOTE: Will sanitize `data` to include ONLY these fields:
   * - email
   * - password
   * - admin
   *
   * @param {object} data
   */
  static async createUser (data) {
    const hashedPassword = await encrypt(data.password)
    const cleanedData = {
      email: data.email,
      password: hashedPassword,
      admin: data.admin || false
    }
    if (data.id) {
      cleanedData.id = data.id
    }

    return User.query().insert(cleanedData)
  }

  async checkPassword (password) {
    const match = await bcrypt.compare(password, this.password)
    return !!match
  }
}
