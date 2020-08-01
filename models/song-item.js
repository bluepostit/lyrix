'use strict'

const { Model } = require('objection')
const knex = require('../db/knex')

const Song = require('./song')
const SongItemType = require('./song-item-type')
const User = require('./user')

Model.knex(knex)

module.exports = class SongItem extends Model {
  static get tableName () {
    return 'song_items'
  }

  static get relationMappings () {
    return {
      song: {
        relation: Model.BelongsToOneRelation,
        modelClass: Song,
        join: {
          from: 'song_items.song_id',
          to: 'songs.id'
        }
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'song_items.user_id',
          to: 'users.id'
        }
      },
      songItemType: {
        relation: Model.BelongsToOneRelation,
        modelClass: SongItemType,
        join: {
          from: 'song_items.song_item_type_id',
          to: 'song_item_types.id'
        }
      }
    }
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['title', 'userId', 'songId', 'songItemTypeId', 'text'],
      properties: {
        id: { type: 'integer' },
        title: { type: 'string', minLength: 5, maxLength: 255 },
        userId: { type: 'integer' },
        songId: { type: 'integer' },
        songItemTypeId: { type: 'integer' },
        text: { type: 'string', minLength: 5, maxLength: 2000 }
      }
    }
  }
}
