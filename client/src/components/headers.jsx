import React, { useState } from 'react'
import { useHistory, Link } from "react-router-dom"
import { NavbarButton as Button, NavbarButton } from '../components/buttons'
import { Icon } from '../components/icons'
import { Nav, Navbar } from 'react-bootstrap'

/**
 *
 * @param {*} props object containing the following:
 * - nextLink - (string) OPTIONAL link to navigate to when clicking 'next' (right arrow).
 *              If not provided, no right arrow will show.
 * - title - (any) content to be displayed in the center of the navbar
 * - peeker - content to add peeking out of the edge of the navbar.
 */
const LyrixNavbar = ({
  title,
  actions = {},
  navActions = [],
  peeker = null
}) => {
  const history = useHistory()
  const [expanded, setExpanded] = useState(false)

  const goHome = () => {
    history.push('/')
  }

  const execute = (action) => {
    if (typeof action === 'string') {
      history.push(action)
    } else if (typeof action === 'function') {
      action()
    }
  }

  const handleActionClick = (action) => {
    setExpanded(false)
    if (!action || !action.value) {
      return
    }
    execute(action.value)
  }

  const collapse = () => {
    setTimeout(() => {
      setExpanded(false)
    }, 10)
  }

  const onToggle = (expanded) => {
    if (!expanded) {
      collapse()
    } else {
      setExpanded(expanded)
    }
  }

  const className = 'lyrix-navbar ' + (expanded ? '' : 'collapsed')
  const visibleActions = navActions.filter(i => i.value)

  return (
    <Navbar collapseOnSelect fixed="top"
      onToggle={onToggle}
      expanded={expanded}
      expand="lg" variant="light" className={className}>
      <div className="navbar-title">
        <Navbar.Brand>{title}</Navbar.Brand>
      </div>

        <Navbar.Toggle aria-controls="lyrix-navbar-more" />
        <Navbar.Collapse id="lyrix-navbar-more">
          <Nav className="mr-auto">
            <Nav.Link href="#" onClick={goHome} >
              <Icon entity="home" /><strong> Lyrix</strong>
            </Nav.Link>
            <div className="horizontal-divider"
              hidden={visibleActions.length < 1} />
            {visibleActions.map((action, index) =>
              <NavbarButton action={action}
                onClick={handleActionClick}
                key={index + 1} />
            )}
          </Nav>
        </Navbar.Collapse>
      {peeker}
    </Navbar>
  )
}

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

export { LyrixNavbar as Navbar, SongItemPageTitle }
