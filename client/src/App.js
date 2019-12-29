import React, { useState } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom"
import { Login, Home } from './pages'
import { MEDIA_CLASS_SMALL, MEDIA_CLASS_LARGE } from './common'

const RouterSwitch = () => {
  return (
    <Switch>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/perform">
        <h1>Perform</h1>
      </Route>
      <Route path="/practice">
        <h1>Practice</h1>
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  )
}

const BigScreenContent = () => {
  return (
    <div className={MEDIA_CLASS_LARGE}>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
      </nav>
      <RouterSwitch />
    </div>
  )
}


const SmallScreenContent = () => {
  return (
    <div className={MEDIA_CLASS_SMALL}>
      <RouterSwitch />
    </div>
  )
}

function App() {

  return (
    <div className="App">
     <Router>
        <div>
          <SmallScreenContent />
          <BigScreenContent />
        </div>
      </Router>
    </div>
  )
}

export default App;
