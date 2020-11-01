'use strict'

const { Model } = require('objection')
const knex = require('../db/knex')

const Song = require('./song')
const User = require('./user')

Model.knex(knex)

module.exports = class SongList extends Model {
  static get tableName() {
    return "song_lists"
  }

  static get relationMappings() {
    const SongListSong = require("./song-list-song")
    return {
      items: {
        relation: Model.HasManyRelation,
        modelClass: SongListSong,
        join: {
          from: "song_lists.id",
          to: "song_list_songs.song_list_id",
        },
      },
      songs: {
        relation: Model.ManyToManyRelation,
        modelClass: Song,
        join: {
          from: "song_lists.id",
          through: {
            modelClass: SongListSong,
            from: "song_list_songs.song_list_id",
            to: "song_list_songs.song_id",
            extra: {
              position: "position",
              songListSongId: "id",
            },
          },
          to: "songs.id",
        },
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "song_lists.user_id",
          to: "users.id",
        },
      },
    }
  }

  static get jsonSchema() {
    return {
      $schema: "http://json-schema.org/schema#",
      type: "object",
      required: ["title"],

      properties: {
        title: {
          type: "string",
          minLength: 1,
          maxLength: 30,
        },
      },
    }
  }

  static get modifiers() {
    return {
      defaultSelects(builder) {
        const { ref } = SongList
        builder.select(
          ref("id"), ref("title"), ref('created_at'))
      },
    }
  }

  async orderItems(data) {
    const SongListSong = require("./song-list-song")
    let myItems = this.items
    if (!myItems) {
      myItems = await SongListSong.query()
        .where({
          song_list_id: this.id,
        })
        .orderBy("position")
    }
    const myItemIds = myItems.map((item) => item.id).sort()
    const dataItemIds = data.map((item) => item.id).sort()

    if (JSON.stringify(myItemIds) != JSON.stringify(dataItemIds)) {
      throw new Error("Incorrect or missing song item data")
    }

    const trx = await Model.startTransaction()
    data.forEach(async (item) => {
      await SongListSong.query().findById(item.id).patch({
        position: item.position,
      })
    })
    await trx.commit()
  }
}
