import React, { useState } from 'react'
import { useHistory } from "react-router-dom"
import { Button } from 'react-bootstrap'
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
const MenuButton = ({ action, icon = <></> }) => {
  let title = action[0].toUpperCase() + action.slice(1)
  title = title.replace('-', ' ')

  const history = useHistory()

  const handleMenuButtonClick = () => {
    const url = `/${action}`
    history.push(url)
  }

  const className = `btn btn-primary menu-button menu-button-${action}`
  return (
    <button className={className}
            data-action={action}
            onClick={handleMenuButtonClick}>
      {icon}{title}
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
  show = false,
  action,
  onClick
}) => {
  if (!show) {
    return <></>
  }

  return (
    <button className="btn button-nav" onClick={onClick}>
      <Icon entity={action} />
    </button>
  )
}


export { ToTopButton, MenuButton, NavbarButton, SongItemsButton }
