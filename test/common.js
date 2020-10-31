const debugModule = require('debug')
const nodemon = require('nodemon')
const { SongList } = require('../models')

/**
 * Gets a debugger instance for debug logging.
 * If the environment variable `VERBOSE` is set with a truthy value,
 * the new debugger namespace will be enabled along with all currently
 * enabled namespaces.
 *
 * @param {string} namespace the namespace to use for debugging
 * @see https://github.com/visionmedia/debug
 */
const getDebugger = (namespace = 'lyrix:test-suite') => {
  const debug = debugModule(namespace)
  if (process.env['VERBOSE']) {
    const namespaces = debugModule.disable()
    if (namespaces) {
      debugModule.enable(`${namespaces},${namespace}`)
    } else {
      debugModule.enable(namespace)
    }
  }
  return debug
}

const getFirstSonglist = async () => {
  const songlist = await SongList.query().first().withGraphFetched("items.song")
  return songlist
}

const getLastSonglist = async () => {
  const songlist = await SongList.query()
    .orderBy("id", "desc")
    .first()
    .withGraphFetched("items.song")
  return songlist
}

const buildItemPositions = (songlist, callback) => {
  return songlist.items.map((item) => {
    let position = item.position
    if (callback) {
      position = callback(item, songlist)
    }
    return {
      id: item.id,
      position: position,
    }
  })
}

module.exports = {
  getDebugger,
  getFirstSonglist,
  getLastSonglist,
  buildItemPositions
}
