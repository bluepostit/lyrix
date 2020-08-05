import React, { useState } from 'react'
import { Button, ListGroup, Modal, Alert, Spinner } from 'react-bootstrap'
import { SongItem } from '../components/list-items'
import { Icon } from '../components/icons'

const SongItemsModal = ({
  title = 'Song Items',
  song,
  songItems,
  show,
  handleClose
}) => {

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
              href={`/songs/${song.id}/song-items/new`}>
            <Icon entity="new" /> Create new song item...
          </ListGroup.Item>
          {
            songItems.map((item, index) =>
              <ListGroup.Item action href={`/song-items/${item.id}`} key={index + 1}>
                <SongItem songItem={item} />
              </ListGroup.Item>
            )
          }
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


export { Deleter, ConfirmModal, LoadingModal, SongItemsModal }
