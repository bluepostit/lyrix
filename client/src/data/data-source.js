const debug = require('debug')('lyrix:data-source')

const getArtistUrl = (baseUrl, params) => {
  let url = baseUrl
  if (params.artistId) {
    url = `${baseUrl}/${params.artistId}`
  }
  return url
}

const getSongUrl = (baseUrl, params) => {
  let url = `${baseUrl}/${params.songId}`
  if (params.songlistId) {
    url += `?context=songlist&contextId=${params.songlistId}`
  } else if (params.artistId) {
    url += '?context=artist'
  } else {
    url += '?context=songlist' // Assumed context: ALL songs
  }
  return url
}


const DataSource = (() => {
  const data = {}
  let error
  const listeners = {
    'start': [],
    'stop': [],
    'change': []
  }

  const URLS = {
    artist: '/api/artists',
    artists: '/api/artists',
    songs: '/api/songs',
    song: '/api/songs'
  }

  const triggerEvent = (event, ...params) => {
    debug('%s event triggered. params: %o', event, params)
    listeners[event].forEach(listener => listener(params))
  }

  const setData = (entity, newData) => {
    debug("setting data for '%s:' %O", entity, newData)
    data[entity] = newData
  }

  const setError = (err) => {
    error = err
  }

  const fetchData = async (entity, params) => {
    triggerEvent('start')
    let url = URLS[entity]
    if (!url) {
      throw `Invalid entity '${entity}'`
    }

    if (entity === 'song') {
      url = getSongUrl(url, params)
    } else if (entity === 'artist') {
      url = getArtistUrl(url, (params))
    }

    fetch(url)
      .then(res => res.json())
      .then((json) => {
        if (json.error) {
          setError(json)
          triggerEvent('error')
        } else {
          setData(entity, json)
          triggerEvent('change', entity)
        }
      }).finally(() => {
        triggerEvent('stop')
      })
  }

  return {
    addListener: (event, listener) => {
      debug("adding listener for '%s'", event)
      if (!['start', 'stop', 'change'].includes(event)) {
        throw Error('Invalid event type')
      }
      listeners[event].push(listener)
    },

    removeListener: (event, listener) => {
      debug("removing listener for '%s'", event)
      const index = listeners[event].indexOf(listener)
      if (index >= 0) {
        listeners[event].splice(index, 1)
      }
    },

    fetch: (entity, params) => {
      fetchData(entity, params)
    },

    get: (entity) => {
      debug(`get('${entity}')`)
      let response = {}
      if (data[entity]) {
        response = data[entity]
      }
      debug('all data: %O', data)
      debug('response: %O', response)
      return response
    }
  }
})()

export default DataSource
