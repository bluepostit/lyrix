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
    const SongList = require('./song-list')
    const SongItem = require('./song-item')
    return {
      artist: {
        relation: Model.BelongsToOneRelation,
        modelClass: Artist,
        join: {
          from: 'songs.artist_id',
          to: 'artists.id'
        }
      },
      songLists: {
        relation: Model.ManyToManyRelation,
        modelClass: SongList,
        join: {
          from: 'songs.id',
          through: {
            from: 'song_list_songs.song_list_id',
            to: 'song_list_songs.song_id'
          },
          to: 'song_lists.id'
        }
      },
      songItems: {
        relation: Model.HasManyRelation,
        modelClass: SongItem,
        join: {
          from: 'songs.id',
          to: 'song_items.song_id'
        }
      }
    }
  }

  static get modifiers() {
    return {
      onlyId(builder) {
        const { ref } = Song;
        builder.select(ref('id'))
      }
    }
  }
}
