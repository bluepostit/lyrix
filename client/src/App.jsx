import React from 'react'
import { BrowserRouter as Router } from "react-router-dom"
import { RouterSwitch } from './components/routes'

function App() {
  return (
    <Router>
      <RouterSwitch />
    </Router>
  )
}

export default App;
