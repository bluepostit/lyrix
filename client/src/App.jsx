import React, { useState } from 'react'
import { BrowserRouter as Router } from "react-router-dom"
import { RouterSwitch } from './components/routes'
import { LoadingModal } from './components/modals'
import { Loader } from './components/data'

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
  loader.addListener('start', onLoadStart)
  loader.addListener('stop', onLoadEnd)

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
