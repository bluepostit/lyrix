import React from 'react'
import { MenuButton } from '../components/buttons'
import { Navbar } from '../components/headers'
import { Icon } from '../components/icons'

const PageContent = (props) => {
  const artistsIcon = <Icon entity="artist" />
  const songsIcon = <Icon entity="song" />
  const songlistsIcon = <Icon entity="songlist" />
  const songItemsIcon = <Icon entity="song-item" />

    return (
      <div className="page-content">
        <div className="d-sm-block">
          <Navbar title="Lyrix" hasBackButton={false} hasHomeButton={false} />
          <div className="beneath-nav menu-buttons">
            <MenuButton action="artists" icon={artistsIcon} />
            <MenuButton action="songs" icon={songsIcon} />
            <MenuButton action="songlists" icon={songlistsIcon} />
            <MenuButton action="song-items" icon={songItemsIcon} />
          </div>
        </div>
      </div>
    )
}

const Home = (props) => {
  return (
    <div className="home-page">
      <PageContent />
    </div>
  )
}

export { Home }
