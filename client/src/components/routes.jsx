import React from 'react'
import {
  Switch,
  Route,
} from "react-router-dom"
import { Home } from '../pages'
import * as Auth from '../pages/auth'
import * as Artists from '../pages/artists'
import { SongImporter } from '../pages/song-importer'
import * as Songlists from '../pages/songlists'
import * as SongItems from '../pages/song-items'
import * as Songs from '../pages/songs'
import { withSearch, withSubscription } from './data'
import DataSource from '../data/data-source'

const SongItemPage = withSubscription(
  SongItems.Show, DataSource, 'songItem', true
)
const SongItemsPage = withSubscription(
  SongItems.Index, DataSource, 'songItems'
)
const SongPage = withSubscription(
  Songs.Show, DataSource, 'song', true
)
const SongsPage = withSubscription(
  Songs.Index, DataSource, 'songs'
)
const SonglistsPage = withSubscription(
  Songlists.Index, DataSource, 'songlists'
)
const ArtistPage = withSubscription(
  Artists.Show, DataSource, 'artist', true
)
const ArtistsPage = withSubscription(
  Artists.Index, DataSource, 'artists'
)
const ImporterPage = withSubscription(
  withSearch(
    SongImporter, DataSource, 'importerSearch'
  ),
  DataSource,
  'importerSearch',
  false,
  true
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
        <SonglistsPage />
      </Route>

      <Route path="/song-items/:id/edit">
        <SongItems.Edit loader={loader} />
      </Route>
      <Route path="/song-items/:id">
        <SongItemPage />
      </Route>
      <Route path="/song-items">
        <SongItemsPage />
      </Route>

      <Route path="/import">
        <ImporterPage />
      </Route>

      <Route path="/">
        <Home />
      </Route>
    </Switch>
  )
}

export { RouterSwitch }
