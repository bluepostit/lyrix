import React from 'react'
import { Button, ListGroup, Modal } from 'react-bootstrap'
import { SongItem } from '../components/list-items'
import { Icon } from '../components/icons'

const SongItemsModal = (props) => {
  const title = props.title || 'Song Items'

  return (
    <Modal show={props.show} onHide={props.handleClose}
           className="song-items-modal"
           aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          <ListGroup.Item
              action
              key={0}
              href={`/songs/${props.song.id}/song-items/new`}>
            <Icon entity="new" /> Create new song item...
          </ListGroup.Item>
          {
            props.songItems.map((item, index) =>
              <ListGroup.Item action href={`/song-items/${item.id}`} key={index + 1}>
                <SongItem songItem={item} />
              </ListGroup.Item>
            )
          }
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={props.handleClose}>
          Cancel
          </Button>
      </Modal.Footer>
    </Modal >
  )
}

export { SongItemsModal }
