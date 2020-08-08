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
import { Subscriber } from './data'

const RouterSwitch = ({ loader, dataSource }) => {
  return (
    <Switch>
      <Route path="/login">
        <Auth.Login />
      </Route>
      <Route path="/sign-up">
        <Auth.SignUp />
      </Route>

      <Route path="/artists/:artistId/songs/:songId">
        <Songs.Show loader={loader} />
      </Route>
      <Route path="/artists/:artistId">
        <Artists.Show loader={loader} />
      </Route>
      <Route path="/artists">
        <Artists.Index loader={loader} />
      </Route>

      <Route path="/songs/new" children={<Songs.New loader={loader} />} />
      <Route path="/songs/:songId/song-items/new"
        children={<SongItems.New loader={loader} />} />
      <Route path="/songs/:id/edit" children={<Songs.Edit loader={loader} />} />
      <Route path="/songs/:songId" children={<Songs.Show loader={loader} />} />
      <Route path="/songs">
        <Subscriber
          Component={Songs.Index}
          dataSource={dataSource}
          dataEntity="songs"
        />
      </Route>

      <Route path="/songlists/:songlistId/songs/:songId">
        <Songs.Show loader={loader} />
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
