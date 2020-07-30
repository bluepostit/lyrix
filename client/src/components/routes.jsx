import React from 'react'
import {
  Switch,
  Route,
} from "react-router-dom"
import { Login, Home, SignUp } from '../pages'
import * as Artists from '../pages/artists'
import * as Songlists from '../pages/songlists'
import * as Songs from '../pages/songs'

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

export { RouterSwitch }
