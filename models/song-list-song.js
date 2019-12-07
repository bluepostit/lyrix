'use strict'

const { Model } = require('objection')
const knex = require('../db/knex')

const Song = require('./song')
const SongList = require('./song-list')

Model.knex(knex)

module.exports = class SongListSong extends Model {
  static get tableName () {
    return 'song_list_songs'
  }

  static get relationMappings () {
    return {
      song: {
        relation: Model.BelongsToOneRelation,
        modelClass: Song,
        join: {
          from: 'song_list_songs.song_id',
          to: 'songs.id'
        }
      },
      songList: {
        relation: Model.BelongsToOneRelation,
        modelClass: SongList,
        join: {
          from: 'song_list_songs.song_list_id',
          to: 'song_lists.id'
        }
      }
    }
  }
}
