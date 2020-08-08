import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from "react-router-dom"
const debug = require('debug')('lyrix:data')

const ListDataset = ({
  url,
  loader,
  shouldLoad,
  onLoadingComplete
}) => {
  const [data, setData] = useState([])
  const [error, setError] = useState('')

  const fetchData = () => {
    loader && loader.start()
    fetch(url)
      .then(res => res.json())
      .then((json) => {
        if (json.error) {
          setError(json)
        }
        setData(json)
        loader && loader.stop()
        onLoadingComplete(json)
      })
  }

  useEffect(() => {
    fetchData()
  }, [shouldLoad, data.length])

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
    this.stoppingTimer = setTimeout(() => {
      this.isLoading = false
      this.stoppingTimer = null
      this.triggerEvent('stop')
    }, LOADING_STOP_TIMEOUT)
  }

  cancelStopping() {
    if (this.stoppingTimer) {
      clearTimeout(this.stoppingTimer)
      this.stoppingTimer = null
    }
  }

  start(message) {
    if (this.stoppingTimer) {
      this.cancelStopping()
    }
    this.message = message || this.message
    this.triggerEvent('start', message)
    this.isLoading = true
  }

  stop() {
    if (!this.stoppingTimer) {
      this.beginStopping()
    }
  }
}

const withSubscription = (
  Component,
  dataSource,
  dataEntity,
  useRouteParams = false
) => {
  const Wrapper = (props) => {
    const params = useParams()
    const getData = () => dataSource.get(dataEntity)
    const fetchData = () => {
      debug('fetchData() for %s', dataEntity)
      if (useRouteParams) {
        dataSource.fetch(dataEntity, params)
      } else {
        dataSource.fetch(dataEntity)
      }
    }
    const [data, setData] = useState(getData())

    const handleDataChange = () => {
      setData(getData())
    }

    // Trigger the loading of the data
    useEffect(() => {
      dataSource.addListener('change', handleDataChange)
      fetchData()
      // Cleanup:
      return () => {
        dataSource.removeListener('change', handleDataChange)
      }
    }, [])
    return <Component data={data} {...props} />
  }
  return Wrapper
}

export { ListDataset, Loader, withSubscription }
