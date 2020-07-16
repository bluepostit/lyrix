import React from 'react'
import { MenuButton } from '../components/buttons'

const PageContent = (props) => {
    return (
      <div className="page-content">
        <div className="d-sm-block">
          <div className="menu-title mb-5">Arrange</div>
          <div className="menu-buttons">
            <MenuButton action="artists" />
            <MenuButton action="songs" />
            <MenuButton action="songlists" />
          </div>
        </div>
      </div>
    )
}

const Arrange = (props) => {
  return (
    <div className="home-page">
      <PageContent />
    </div>
  )
}

export { Arrange }
