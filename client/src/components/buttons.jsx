import React, { useState } from 'react'
import { useHistory } from "react-router-dom"
import { Button, Nav } from 'react-bootstrap'
import { toTitleCase } from '../util'
import { Icon } from './icons'
import { SongItemsModal } from './modals'

const ToTopButton = () => {
  const onClick = () => {
    window.scrollTo(0, 0)
  }

  return (
    <button className="btn button-nav button-to-top" onClick={onClick}>
      <i className="fas fa-arrow-up"></i>
    </button>
  )
}

/**
 * Menu button for small screen
 */
const MenuButton = ({
  action,
  title,
  entity = null
}) => {
  const history = useHistory()

  const handleClick = () => {
    history.push(action)
  }

  const icon = <Icon entity={entity} />
  return (
    <button
      className="btn btn-primary menu-button"
      onClick={handleClick}>
        {icon} {title}
    </button>
  )
}

const SongItemsButton = ({ song }) => {
  const items = song.songItems || []
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  return (
    <div className="song-items-container">
      <Button variant="outline-secondary" onClick={handleShow}>
        <Icon entity="songItem" />
        <strong> {items.length} </strong>
      </Button>
      <SongItemsModal title="Your Song Items"
        song={song}
        songItems={items}
        show={show}
        handleClose={handleClose}
      />
    </div>
  )
}

const NavbarButton = ({
  action,
  onClick
}) => {
  const handleClick = (event) => {
    event.preventDefault()
    onClick(action)
  }
  const title = toTitleCase(action.title || action.name)
  return (
    <>
      <Nav.Link onClick={handleClick} data-action={action.name} >
        <Icon entity={action.name} /> {title}
      </Nav.Link>
      <div className="horizontal-divider"
        hidden={!action.hasDivider} />
    </>
  )
}


export { ToTopButton, MenuButton, NavbarButton, SongItemsButton }
