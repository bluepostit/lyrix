import React from 'react'
import {
  Switch,
  Route,
} from "react-router-dom"
import { Home } from '../pages'
import * as Auth from '../pages/auth'
import * as Artists from '../pages/artists'
import { SongImporter as Importer } from '../pages/song-importer'
import * as Songlists from '../pages/songlists'
import * as SongItems from '../pages/song-items'
import * as Songs from '../pages/songs'
import { withSubscription } from './data'
import DataSource from '../data/data-source'

const SongPage = withSubscription(
  Songs.Show, DataSource, 'song', true
)

const SongsPage = withSubscription(
  Songs.Index, DataSource, 'songs'
)

const ArtistPage = withSubscription(
  Artists.Show, DataSource, 'artist', true
)
const ArtistsPage = withSubscription(
  Artists.Index, DataSource, 'artists'
)

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
        <SongPage />
      </Route>
      <Route path="/artists/:artistId">
        <ArtistPage />
      </Route>
      <Route path="/artists">
        <ArtistsPage />
      </Route>

      <Route path="/songs/new" children={<Songs.New loader={loader} />} />
      <Route path="/songs/:songId/song-items/new"
        children={<SongItems.New loader={loader} />} />
      <Route path="/songs/:id/edit" children={<Songs.Edit loader={loader} />} />
      <Route path="/songs/:songId">
        <SongPage />
      </Route>
      <Route path="/songs">
        <SongsPage />
      </Route>

      <Route path="/songlists/:songlistId/songs/:songId">
        <SongPage />
      </Route>
      <Route path="/songlists/new">
        <Songlists.New loader={loader} />
      </Route>
      <Route path="/songlists/:id">
        <Songlists.Show loader={loader} />
      </Route>
      <Route path="/songlists">
        <Songlists.Index loader={loader} />
      </Route>

      <Route path="/song-items/:id/edit">
        <SongItems.Edit loader={loader} />
      </Route>
      <Route path="/song-items/:id">
        <SongItems.Show loader={loader} />
      </Route>
      <Route path="/song-items">
        <SongItems.Index loader={loader} />
      </Route>

      <Route path="/import">
        <Importer loader={loader}/>
      </Route>

      <Route path="/">
        <Home />
      </Route>
    </Switch>
  )
}

export { RouterSwitch }
