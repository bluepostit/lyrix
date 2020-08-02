import React from 'react'
import { useHistory, Link } from "react-router-dom"
import { NavbarButton as Button } from '../components/buttons'
import { Icon } from '../components/icons'

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
const Navbar = ({
  nextLink = null,
  hasBackButton = true,
  hasHomeButton = true,
  title,
  onNewClick,
  onEditClick,
  onDeleteClick,
  userCanCreate = true,
  peeker = null
}) => {
  const history = useHistory()
  const goBack = () => {
    history.goBack()
    window.scrollTo(0, 0)
  }
  const goHome = () => {
    history.push('/')
  }
  const goNext = () => {
    history.push(nextLink)
    window.scrollTo(0, 0)
  }

  return (
    <nav className="navbar navbar-light mobile-header">
      <div className="button-group">
        <Button action="previous" onClick={goBack} show={hasBackButton} />
        <Button action="home" onClick={goHome} show={hasHomeButton} />
      </div>
      <h1>{title}</h1>
      <div className="button-group">
        <Button action="new" onClick={onNewClick} show={onNewClick && userCanCreate} />
        <Button action="edit" onClick={onEditClick} show={onEditClick} />
        <Button action="delete" onClick={onDeleteClick} show={onDeleteClick} />
        <Button action="next" onClick={goNext} show={nextLink} />
      </div>
      {peeker}
    </nav>
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

export { Navbar, SongItemPageTitle }
