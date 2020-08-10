import React, { useState } from 'react'
import { useHistory } from "react-router-dom"
import { NavbarButton } from '../components/buttons'
import { Icon } from '../components/icons'
import { Nav, Navbar } from 'react-bootstrap'

const SongItemPageTitle = ({
  songItem = { title: '' },
  title = 'Add a New Song Item'
}) => {

  return (
    <div className="title">
      <Icon entity="songItem" />
      <strong className="ml-2">{songItem.title || title}</strong>
    </div>
  )
}

const LyrixNavbar = ({ title, actions = [] }) => {
  const history = useHistory()
  const visibleActions = actions.filter(i => i.value)

  const goHome = () => {
    history.push('/')
  }

  const handleActionClick = (action) => {
    if (!action || !action.value) {
      return
    }
    execute(action.value)
  }

  const execute = (action) => {
    if (typeof action === 'string') {
      history.push(action)
    } else if (typeof action === 'function') {
      action()
    }
  }

  return (
    <Navbar collapseOnSelect variant="light" fixed="top"
        className="lyrix-navbar" expand="md">
      <Navbar.Brand>{title}</Navbar.Brand>

      <Navbar.Toggle aria-controls="lyrix-navbar-links" />
      <Navbar.Collapse id="lyrix-navbar-links">
        <Nav className="mr-auto">
          <Nav.Link onClick={goHome} >
            <Icon entity="home" /><strong> Lyrix</strong>
          </Nav.Link>
          {visibleActions.map((action, index) =>
            <NavbarButton action={action}
              onClick={handleActionClick}
              key={index + 1} />
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )

}

export { LyrixNavbar as Navbar, SongItemPageTitle }
