import React, { useState } from 'react'
import { useHistory, Link } from "react-router-dom"
import { NavbarButton as Button } from '../components/buttons'
import { Icon } from '../components/icons'
import { Nav, Navbar } from 'react-bootstrap'

/**
 *
 * @param {*} props object containing the following:
 * - nextLink - (string) OPTIONAL link to navigate to when clicking 'next' (right arrow).
 *              If not provided, no right arrow will show.
 * - hasBackButton - default true
 * - hasHomeButton - default true
 * - title - (any) content to be displayed in the center of the navbar
 * - onNewClick - function|null - if empty, won't show 'New' button
 * - onEditClick - function|null - if empty, won't show 'Edit' button
 * - onDeleteClick - function|null - if empty, won't show 'Delete' button
 * - nextLink - string|null - if empty, won't show the link
 * - peeker - content to add peeking out of the edge of the navbar.
 */
const LyrixNavbar = ({
  nextLink = null,
  hasBackButton = true,
  hasHomeButton = true,
  title,
  onNewClick,
  onEditClick,
  onDeleteClick,
  actions = {},
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
  const goNext = () => {
    setExpanded(false)
    history.push(nextLink)
    window.scrollTo(0, 0)
  }
  const goNew = () => {
    collapse()
    onNewClick()
  }
  const goEdit = () => {
    setExpanded(false)
    onEditClick()
  }
  const goDelete = () => {
    setExpanded(false)
    onDeleteClick()
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

  const old = (
    <nav className="navbar navbar-light mobile-header">
      <div className="button-group">
        <Button action="previous" onClick={goBack} show={hasBackButton} />
        <Button action="home" onClick={goHome} show={hasHomeButton} />
      </div>
      <h1>{title}</h1>
      <div className="button-group">
        <Button
          action="new"
          onClick={onNewClick}
          show={onNewClick && actions.create}
        />
        <Button
          action="edit"
          onClick={onEditClick}
          show={onEditClick && actions.edit}
        />
        <Button
          action="delete"
          onClick={onDeleteClick}
          show={onDeleteClick && actions.delete}
        />
        <Button action="next" onClick={goNext} show={nextLink} />
      </div>
      {peeker}
    </nav>
  )

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
            <div className="horizontal-divider" />

            <Nav.Link onClick={goNext} hidden={!nextLink} >
              <Icon entity="next" /> Next
            </Nav.Link>
            <div className="horizontal-divider" hidden={!nextLink} />

          <Nav.Link onClick={goNew}
            hidden={!(onNewClick && actions.create)} >
              <Icon entity="new" /> New
          </Nav.Link>

          <Nav.Link onClick={goEdit}
            hidden={!(onEditClick && actions.edit)} >
              <Icon entity="edit" /> Edit
          </Nav.Link>

          <Nav.Link onClick={goDelete}
            hidden={!(onDeleteClick && actions.delete)} >
              <Icon entity="delete" /> Delete
          </Nav.Link>

          </Nav>
        </Navbar.Collapse>
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
