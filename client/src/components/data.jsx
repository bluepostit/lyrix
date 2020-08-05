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
  constructor(message, onStart, onStop) {
    this.isLoading = false
    this.isStopping = false
    this.message = message
    this.onStart = onStart
    this.onStop = onStop
  }

  get loading() {
    return this.isLoading
  }

  beginStopping() {
    this.stopping = true
    this.stoppingTimer = setTimeout(() => {
      this.onStop()
      this.isLoading = false
    }, LOADING_STOP_TIMEOUT)
  }

  cancelStopping() {
    if (this.stoppingTimer) {
      clearTimeout(this.stoppingTimer)
    }
  }

  start(message) {
    console.log(`Loader.start(${message})`)
    if (this.stopping) {
      this.cancelStop()
    }
    this.message = message || this.message
    this.onStart(message)
    this.isLoading = true
  }

  stop() {
    console.log(`Loader.stop()`)
    if (!this.stopping) {
      this.beginStopping()
    }
  }
}


export { ListDataset, Loader }
