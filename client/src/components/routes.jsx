import React from 'react'
import {
  Switch,
  Route,
} from "react-router-dom"
import { Home } from '../pages'
import * as Auth from '../pages/auth'
import * as Songlists from '../pages/songlists'
import * as SongItems from '../pages/song-items'
import * as Pages from '../pages/data-pages'

const RouterSwitch = ({ loader }) => {
  return (
    <Switch>
      <Route path="/login">
        <Auth.Login />
      </Route>
      <Route path="/sign-up">
        <Auth.SignUp />
      </Route>

      <Route path="/artists/:artistId/songs/:songId">
        <Pages.SongPage />
      </Route>
      <Route path="/artists/:artistId">
        <Pages.ArtistPage />
      </Route>
      <Route path="/artists">
        <Pages.ArtistsPage />
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
      <Route path="/songs/:songId">
        <Pages.SongPage />
      </Route>
      <Route path="/songs">
        <Pages.SongsPage />
      </Route>

      <Route path="/songlists/:songlistId/songs/:songId">
        <Pages.SongPage />
      </Route>
      <Route path="/songlists/new">
        <Songlists.New />
      </Route>
      <Route path="/songlists/:id">
        <Pages.SonglistPage />
      </Route>
      <Route path="/songlists">
        <Pages.SonglistsPage />
      </Route>

      <Route path="/song-items/:id/edit">
        <Pages.EditSongItemPage />
      </Route>
      <Route path="/song-items/:id">
        <Pages.SongItemPage />
      </Route>
      <Route path="/song-items">
        <Pages.SongItemsPage />
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
