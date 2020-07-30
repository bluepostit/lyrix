import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom"
import { Login, Home, Page, SignUp } from './pages'
import * as Artists from './pages/artists'
import * as Songlists from './pages/songlists'
import * as Songs from './pages/songs'

const RouterSwitch = () => {
  return (
    <Switch>
      <Route path="/artists/:artistId/songs/:songId" children={<Songs.Show />} />
      <Route path="/artists/:artistId" children={<Artists.Show />} />
      <Route path="/artists">
        <Artists.Index />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/sign-up">
        <SignUp />
      </Route>
      <Route path="/songs/:songId" children={<Songs.Show />} />
      <Route path="/songs">
        <Songs.Index />
      </Route>

      <Route path="/songlists/:songlistId/songs/:songId"
             children={<Songs.Show />} />
      <Route path="/songlists/new" children={<Songlists.New />} />
      <Route path="/songlists/:id" children={<Songlists.Show />} />
      <Route path="/songlists">
        <Songlists.Index />
      </Route>
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
