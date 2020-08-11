import React, { useState } from 'react'
import { useHistory } from "react-router-dom"
import { NavbarButton } from '../components/buttons'
import { Icon } from '../components/icons'
import { Nav, Navbar, NavDropdown } from 'react-bootstrap'

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
        className="lyrix-navbar justify-content-between" expand="md">
      <Nav.Link onClick={goHome} >
        <Icon entity="home" />
      </Nav.Link>
      <Navbar.Brand className="mr-auto">{title}</Navbar.Brand>

      <Navbar.Toggle aria-controls="lyrix-navbar-links" />
      <Navbar.Collapse id="lyrix-navbar-links">
        <Nav className="mr-auto">
        </Nav>
        {/* SMALL VERSION: simple collapsing nav */}
        <Nav className="d-md-none mr-auto">
            {visibleActions.map((action, index) =>
              <NavbarButton key={index} action={action}
                onClick={handleActionClick}
              />
            )}
        </Nav>
        {/* MD+ VERSION: dropdown menu */}
        <Nav className="d-none d-md-block mr-auto">
          <NavDropdown title="Menu" id="nav-actions-dropdown">
            {visibleActions.map((action, index) =>
              <NavbarButton forDropdown key={index} action={action}
                onClick={handleActionClick}
              />
            )}
          </NavDropdown>
        </Nav>

      </Navbar.Collapse>
    </Navbar>
  )

}

export { LyrixNavbar as Navbar, SongItemPageTitle }
