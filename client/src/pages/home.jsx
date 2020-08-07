import React from 'react'
import { Page } from './page'
import { MenuButton } from '../components/buttons'

const Home = () => {
  return (
    <Page title={<h2>Lyrix</h2>}>
      <div className="page-content home-page">
        <div className="menu-buttons">
          <MenuButton action="/artists" entity="artist" title="Artists" />
          <MenuButton action="/songs" entity="song" title="Songs" />
          <MenuButton action="/import" entity="import" title="Import" />
          <MenuButton action="/songlists" entity="songlist"
            title="Songlists" />
          <MenuButton action="/song-items" entity="songItem"
            title="Song Items" />
        </div>
      </div>
    </Page>
  )
}

export { Home }
