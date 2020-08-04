'use strict'

const { Model } = require('objection')
const knex = require('../db/knex')

const Song = require('./song')
const User = require('./user')

Model.knex(knex)

module.exports = class SongList extends Model {
  static get tableName () {
    return 'song_lists'
  }

  static get relationMappings () {
    const SongListSong = require('./song-list-song')
    return {
      items: {
        relation: Model.HasManyRelation,
        modelClass: SongListSong,
        join: {
          from: 'song_lists.id',
          to: 'song_list_songs.song_list_id'
        }
      },
      songs: {
        relation: Model.ManyToManyRelation,
        modelClass: Song,
        join: {
          from: 'song_lists.id',
          through: {
            modelClass: SongListSong,
            from: 'song_list_songs.song_list_id',
            to: 'song_list_songs.song_id'
          },
          to: 'songs.id'
        }
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'song_lists.user_id',
          to: 'users.id'
        }
      }
    }
  }

  static get jsonSchema() {
    return {
      $schema: 'http://json-schema.org/schema#',
      type: 'object',
      required: ['title'],

      properties: {
        name: {
          type: 'title',
          minLength: 1,
          maxLength: 30
        }
      }
    }
  }
}
