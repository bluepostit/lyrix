'use strict'

const { Model } = require('objection')
const knex = require('../db/knex')

const Artist = require('./artist')

Model.knex(knex)

module.exports = class Song extends Model {
  static get tableName () {
    return 'songs'
  }

  static relationMappings = {
    artist: {
      relation: Model.BelongsToOneRelation,
      modelClass: Artist,
      join: {
        from: 'songs.artistId',
        to: 'artists.id'
      }
    }
  }
}
