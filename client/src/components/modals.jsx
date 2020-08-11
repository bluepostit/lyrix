import React, { useState } from 'react'
import { Button, ListGroup, Modal, Alert, Spinner } from 'react-bootstrap'
import { SongItem } from '../components/list-items'
import { Icon } from '../components/icons'
import { useSonglists } from '../data/songlists'

const SongItemsModal = ({
  title = 'Song Items',
  songItems,
  show,
  handleClose
}) => {

  const onNewSongItemClick = (event) => {
    handleClose('new')
  }

  const onSongItemClick = (songItem) => {
    handleClose(songItem)
  }

  return (
    <Modal show={show} onHide={handleClose}
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
              onClick={onNewSongItemClick}>
            <Icon entity="new" /> Create new song item...
          </ListGroup.Item>
          {songItems.map((item, index) =>
              <SongItem songItem={item} key={index}
                onClick={() => onSongItemClick(item)} />
          )}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          Cancel
          </Button>
      </Modal.Footer>
    </Modal >
  )
}

const LoadingModal = ({
  title = 'Loading...',
  loading = false,
}) => {
  const onHide = () => { }

  return (
    <Modal show={loading} onHide={onHide}
      backdrop="static"
      keyboard={false}
      animation={false}
      className="lyrix-modal"
      aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="modal-spinner">
          <Spinner animation="border" variant="primary" />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary"
          show={''}
          disabled={loading}
          onClick={null}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal >
  )
}

const ConfirmModal = ({
  title = 'Are you sure?',
  show,
  setShow,
  content,
  awaitingResponse = false,
  onConfirm,
  confirmText = 'Ok',
  dismissText = 'Cancel',
  error = '',
  setError
}) => {

  const handleClose = () => {
    setShow(false)
    setError('')
  }

  return (
    <Modal show={show} onHide={handleClose}
      className="song-items-modal"
      aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>{content}</div>
        <Alert variant="danger" show={!!error}>{error}</Alert>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary"
            disabled={awaitingResponse}
            onClick={handleClose}>
          {dismissText}
        </Button>
        <Button variant="primary"
            className={error ? 'd-none' : ''}
            disabled={awaitingResponse}
            onClick={onConfirm}>
          {awaitingResponse ? 'Please wait...' : confirmText}
        </Button>
      </Modal.Footer>
    </Modal >
  )
}

const Deleter = ({
  entity,
  noun,
  show = false,
  setShow,
  onDelete
}) => {
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const textNoun = noun.replace('-', ' ')

  const handleDelete = () => {
    setLoading(true)
    fetch(`/api/${noun}s/${entity.id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then((data) => {
        setLoading(false)
        if (data.error) {
          setError(data.error)
        } else {
          setShow(false)
          onDelete()
        }
      })
  }

  return (
    <ConfirmModal
      content={`Are you sure you want to delete this ${textNoun}?`}
      show={show}
      setShow={setShow}
      onConfirm={handleDelete}
      awaitingResponse={isLoading}
      error={error}
      setError={setError}
    />
  )
}

const SelectSonglistModal = ({ show, setShow, onSelect, onDismiss }) => {
  const { songlists, isLoading, error} = useSonglists()
  const [songlist, setSonglist] = useState()
  const title = 'Select a Songlist'

  const onSonglistClick = (songlist) => {
    onSelect(songlist)
    handleClose()
  }

  const handleClose = () => {
    setShow(false)
  }

  let body
  if (isLoading) {
    body = <div className = "modal-spinner" >
      <Spinner animation="border" variant="primary" />
    </div >
  } else if (error) {
    body = <Alert variant="danger">{error}</Alert>
  } else {
    body = (
      <ListGroup>
        {songlists.map((item, index) =>
          <ListGroup.Item
            key={index + 1}
            onClick={(e) => onSonglistClick(item)}>
              <Icon entity="songlist" /> {item.title}
          </ListGroup.Item>
        )}
      </ListGroup>
    )
  }

  return (
    <Modal show={show} onHide={handleClose}
      className="song-items-modal"
      aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>{body}</div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary"
          onClick={handleClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal >
  )
}


export { Deleter, ConfirmModal, LoadingModal, SongItemsModal, SelectSonglistModal }
