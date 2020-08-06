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

  const goBack = () => {
    history.goBack()
    window.scrollTo(0, 0)
  }

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

  return (
    <Navbar collapseOnSelect fixed="top"
      onToggle={onToggle}
      expanded={expanded}
      expand="lg" variant="light" className={className}>
      <div className="navbar-title">
        <Navbar.Brand>{title}</Navbar.Brand>
      </div>

        <Navbar.Toggle aria-controls="lyrix-navbar-more" transition={false} />
        <Navbar.Collapse id="lyrix-navbar-more">
          <Nav className="mr-auto">
            <Nav.Link href="#" onClick={goHome} >
              <Icon entity="home" /><strong> Lyrix</strong>
            </Nav.Link>
            <div className="horizontal-divider"
              hidden={navActions.length > 0} />
            {navActions.map((action, index) =>
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
  songItem = null,
  song = null,
  title = 'Add a New Song Item'
}) => {
  let lines = []
  if (songItem) {
    lines[0] = songItem.title
    lines[1] = songItem.song.title
    song = songItem.song
  } else if (song) {
    lines[0] = title
    lines[1] = song.title
  }

  return (
    <div className="title">
      <div>
        <Icon entity="songItem" />
        <strong className="ml-2">{lines[0]}</strong>
      </div>
      <Link to={`/songs/${song.id}`}>
        <span className="content-secondary">{lines[1]}</span>
      </Link>
    </div>
  )
}

export { LyrixNavbar as Navbar, SongItemPageTitle }
