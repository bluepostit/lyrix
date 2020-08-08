const DataSource = (() => {
  const data = {}
  let error
  const listeners = {
    'start': [],
    'stop': [],
    'change': []
  }

  const URLS = {
    songs: '/api/songs'
  }

  const triggerEvent = (event, ...params) => {
    listeners[event].forEach(listener => listener(params))
  }

  const setData = (entity, newData) => {
    data[entity] = newData
  }

  const setError = (err) => {
    error = err
  }

  const fetchData = async (entity) => {
    triggerEvent('start')
    const url = URLS[entity]
    if (!url) {
      throw `Invalid entity '${entity}'`
    }
    fetch(url)
      .then(res => res.json())
      .then((json) => {
        if (json.error) {
          setError(json)
          triggerEvent('error')
        } else {
          setData(entity, json)
          console.log(data)
          triggerEvent('change', entity)
        }
      }).finally(() => {
        triggerEvent('stop')
      })
  }

  return {
    addListener: (event, listener) => {
      console.log('adding listener...')
      if (!['start', 'stop', 'change'].includes(event)) {
        throw Error('Invalid event type')
      }
      listeners[event].push(listener)
    },

    removeListener: (event, listener) => {
      console.log('removing listener...')
      const index = listeners[event].indexOf(listener)
      if (index >= 0) {
        console.log('removed!')
        listeners[event].splice(index, 1)
      }
    },

    fetch: (entity) => {
      fetchData(entity)
    },

    get: (entity) => {
      let response = { data: [], actions: [] }
      if (data[entity]) {
        response = data[entity]
      }
      return response
    }
  }
})()

export default DataSource
