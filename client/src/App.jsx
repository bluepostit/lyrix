import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router } from "react-router-dom"
import { RouterSwitch } from './components/routes'
import { LoadingModal } from './components/modals'
import { Loader } from './components/data'
import DataSource from './data/data-source'

const loader = new Loader('Loading...')

function App() {
  const [loading, setLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('Loading...')
  const onLoadStart = (message) => {
    setLoadingMessage(message)
    setLoading(true)
  }
  const onLoadEnd = () => {
    setLoading(false)
  }

  useEffect(() => {
    DataSource.addListener('start', onLoadStart)
    DataSource.addListener('stop', onLoadEnd)

    return () => {
      DataSource.removeListener('start', onLoadStart)
      DataSource.removeListener('stop', onLoadEnd)
    }
  }, [])

  return (
    <>
      <Router>
        <RouterSwitch loader={loader} />
      </Router>
      <LoadingModal
        loading={loading}
        title={loadingMessage}
      />
    </>
  )
}

export default App;
