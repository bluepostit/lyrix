'use strict'

const { Model } = require('objection')
const knex = require('../db/knex')

Model.knex(knex)

module.exports = class SongItemType extends Model {
  static get tableName () {
    return 'song_item_types'
  }

  static get relationMappings() {
    const SongItem = require('./song-item')
    return {
      songItem: {
        relation: Model.HasManyRelation,
        modelClass: SongItem,
        join: {
          from: 'song_item_types.id',
          to: 'song_items.song_item_type_id'
        }
      }
    }
  }
}
