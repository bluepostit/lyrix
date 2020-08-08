const debug = require('debug')('lyrix:data-source')

const parameterize = (baseUrl, params) => {
  debug('parameterize("%s", %o)', baseUrl, params)
  const key = (Object.getOwnPropertyNames(params))[0]
  return `${baseUrl}/${params[key]}`
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
  const invalidData = []

  let error
  const listeners = {
    'start': [],
    'stop': [],
    'error': [],
    'change': []
  }

  const URLS = {
    artist: '/api/artists',
    artists: '/api/artists',
    song: '/api/songs',
    songs: '/api/songs',
    songItem: '/api/song-items',
    songItems: '/api/song-items',
    songlist: '/api/songlists',
    songlists: '/api/songlists',
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
    debug('fetchData("%s", %o)', entity, params)
    triggerEvent('start')
    let url = URLS[entity]
    if (!url) {
      throw new Error(`Invalid entity '${entity}'`)
    }

    if (entity === 'song') {
      url = getSongUrl(url, params)
    } else if (entity === 'artist') {
      url = parameterize(url, params)
    } else if (entity === 'songItem') {
      url = parameterize(url, params)
    }

    fetch(url)
      .then(res => res.json())
      .then((json) => {
        if (json.error) {
          setError(json)
          triggerEvent('error')
        } else {
          setData(entity, json)
          validate(entity)
          triggerEvent('change', entity)
        }
      }).finally(() => {
        triggerEvent('stop')
      })
  }

  const validate = (entity) => {
    const index = invalidData.indexOf(entity)
    if (index >= 0) {
      invalidData.splice(index, 1)
    }
  }

  const isInvalidated = (entity) => {
    return invalidData.indexOf(entity) >= 0
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

    invalidate: (entity) => {
      if (data[entity] && invalidData.indexOf(entity) < 0) {
        invalidData.push(entity)
      }
    },

    fetch: (entity, params) => {
      fetchData(entity, params)
    },

    get: (entity) => {
      debug(`get('${entity}')`)
      let response = {}
      if (isInvalidated(entity)) {
        response = null
      } else if (data[entity]) {
        response = data[entity]
      }
      debug('all data: %O', data)
      debug('response: %O', response)
      return response
    }
  }
})()

export default DataSource
