import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom"
import { Arrange, Login, Home, Page, SignUp, Song } from './pages'
import * as Artists from './pages/artists'
import * as Songlists from './pages/songlists'

const RouterSwitch = () => {
  return (
    <Switch>
      <Route path="/artists/:artist_id" children={<Artists.Show />} />
      <Route path="/artists">
        <Artists.Index />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/sign-up">
        <SignUp />
      </Route>
      <Route path="/arrange">
        <Arrange />
      </Route>
      <Route path="/practice">
        <Songlists.Index />
      </Route>
      <Route path="/songs/:song_id" children={<Song />} />
      <Route path="/songlists/:songlist_id/songs/:song_id"
             children={<Song />} />
      <Route path="/songlists/new" children={<Songlists.New />} />
      <Route path="/songlists/:id" children={<Songlists.Show />} />
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  )
}

const PageContent = () => {
  return (
    <div>
      <nav className="d-none d-sm-block">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </nav>
        <RouterSwitch />
    </div>
  )
}

function App() {
  return (
    <Router>
      <Page noHeader content={<PageContent />} />
    </Router>
  )
}

export default App;
