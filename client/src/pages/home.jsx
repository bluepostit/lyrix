import React from 'react'
import { MenuButton } from '../components/buttons'
import { Navbar } from '../components/headers'

const PageContent = (props) => {
    return (
      <div className="page-content">
        <div className="d-sm-block">
          <Navbar title="Lyrix" />
          <div className="beneath-nav menu-buttons">
            <MenuButton action="artists" />
            <MenuButton action="songs" />
            <MenuButton action="songlists" />
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
