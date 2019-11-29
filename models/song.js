'use strict'

const { Model } = require('objection')
const knex = require('../db/knex')

const Artist = require('./artist')

Model.knex(knex)

module.exports = class Song extends Model {
  static get tableName () {
    return 'songs'
  }

  static get relationMappings () {
    return {
      artist: {
        relation: Model.BelongsToOneRelation,
        modelClass: Artist,
        join: {
          from: 'songs.artist_id',
          to: 'artists.id'
        }
      }
    }
  }
}
