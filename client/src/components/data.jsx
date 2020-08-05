import React, { useEffect, useState } from 'react'
import { useHistory } from "react-router-dom"

const ListDataset = ({
  url,
  loader,
  onLoadingComplete
}) => {
  const [data, setData] = useState([])
  const [error, setError] = useState('')

  const fetchData = () => {
    loader.start()
    fetch(url)
      .then(res => res.json())
      .then((json) => {
        if (json.error) {
          setError(json)
        }
        setData(json)
        loader.stop()
        onLoadingComplete(json)
      })
  }

  useEffect(() => {
    fetchData()
  }, [loader.loading, data.length])

  return (
    <>
      <ErrorHandler error={error} />
    </>
  )
}

const ErrorHandler = ({
  error,
}) => {
  const history = useHistory()
  if (error) {
    console.log(error)
    history.push('/login')
  }
  return <></>
}

const LOADING_STOP_TIMEOUT = 100 // milliseconds

class Loader {
  constructor(message) {
    this.isLoading = false
    this.stoppingTimer = null
    this.message = message
    this.listeners = {
      'start': [],
      'stop': []
    }
  }

  addListener(event, listener) {
    if (!['start', 'stop'].includes(event)) {
      throw Error('Invalid event type')
    }
    this.listeners[event].push(listener)
  }

  triggerEvent(event, ...params) {
    this.listeners[event].forEach(listener => listener(...params))
  }

  get loading() {
    return this.isLoading
  }

  beginStopping() {
    console.log('begin stopping - starting the timer...')
    this.stoppingTimer = setTimeout(() => {
      console.log('time up! calling onStop()')
      this.triggerEvent('stop')
      this.isLoading = false
      this.stoppingTimer = null
    }, LOADING_STOP_TIMEOUT)
    console.log(`(Are we stopping? ${!!this.stoppingTimer})`)
  }

  cancelStopping() {
    console.log('cancel stopping')
    if (this.stoppingTimer) {
      console.log('yes, clearing timeout')
      clearTimeout(this.stoppingTimer)
      this.stoppingTimer = null
    }
  }

  start(message) {
    console.log(`Loader.start(${message})`)
    console.log(`Are we stopping? ${!!this.stoppingTimer}`)
    console.log(this)
    if (this.stoppingTimer) {
      this.cancelStopping()
    }
    this.message = message || this.message
    this.triggerEvent('start', message)
    this.isLoading = true
  }

  stop() {
    console.log(`Loader.stop()`)
    console.log(this)
    if (!this.stoppingTimer) {
      console.log('not stopping yet; begin stopping...')
      this.beginStopping()
    }
  }
}


export { ListDataset, Loader }
