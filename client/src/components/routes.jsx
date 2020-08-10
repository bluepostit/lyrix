import React from 'react'
import {
  Switch,
  Route,
} from "react-router-dom"
import { Home } from '../pages'
import * as Artists from '../pages/artists'
import * as Auth from '../pages/auth'
import * as Songs from '../pages/songs'
import * as SongItems from '../pages/song-items'
import * as Songlists from '../pages/songlists'
import * as Pages from '../pages/data-pages'

const RouterSwitch = () => {
  return (
    <Switch>
      <Route path="/login">
        <Auth.Login />
      </Route>
      <Route path="/sign-up">
        <Auth.SignUp />
      </Route>

      <Route path="/artists/:artistId/songs/:songId">
        {/* Need to send params with swr if we convert it! */}
        <Pages.SongPage />
      </Route>
      <Route path="/artists/:id">
        <Artists.Show />
      </Route>
      <Route path="/artists">
        <Artists.Index />
      </Route>

      <Route path="/songs/new">
        <Pages.NewSongPage />
      </Route>
      <Route path="/songs/:songId/song-items/new">
        <Pages.NewSongItemPage />
      </Route>
      <Route path="/songs/:id/edit">
        <Pages.EditSongPage />
      </Route>
      <Route path="/songs/:id">
        <Songs.Show />
      </Route>
      <Route path="/songs">
        <Songs.Index />
      </Route>

      <Route path="/songlists/:songlistId/songs/:id">
        <Songs.Show />
      </Route>
      <Route path="/songlists/new">
        <Songlists.New />
      </Route>
      <Route path="/songlists/:id">
        <Songlists.Show />
      </Route>
      <Route path="/songlists">
        <Songlists.Index />
      </Route>

      <Route path="/song-items/:id/edit">
        <Pages.EditSongItemPage />
      </Route>
      <Route path="/song-items/:id">
        <SongItems.Show />
      </Route>
      <Route path="/song-items">
        <SongItems.Index />
      </Route>

      <Route path="/import">
        <Pages.ImporterPage />
      </Route>

      <Route path="/">
        <Home />
      </Route>
    </Switch>
  )
}

export { RouterSwitch }
