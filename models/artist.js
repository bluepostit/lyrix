'use strict'

const { Model } = require('objection')
const knex = require('../db/knex')

Model.knex(knex)

module.exports = class Artist extends Model {
  static get tableName () {
    return 'artists'
  }

  static get relationMappings () {
    const Song = require('./song')

    return {
      songs: {
        relation: Model.HasManyRelation,
        modelClass: Song,
        join: {
          from: 'artists.id',
          to: 'songs.artist_id'
        }
      }
    }
  }

  static get jsonSchema() {
    return {
      $schema: 'http://json-schema.org/schema#',
      type: 'object',
      required: ['name'],

      properties: {
        name: {
          type: 'string',
          minLength: 1,
          maxLength: 30
        }
      }
    }
  }
}
