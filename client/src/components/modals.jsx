import React, { useState } from 'react'
import { Button, Form, ListGroup, Modal, Alert } from 'react-bootstrap'
import { SongItem } from '../components/list-items'
import { Icon } from '../components/icons'

const getFormData = (form) => {
  const data = new URLSearchParams(new FormData(form))
  return data.toString()
}

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

const ArtistModal = ({
  artist = { name: '' },
  setArtist,
  role,
  title,
  show,
  setShow,
  confirmText = 'Save',
  dismissText = 'Cancel',
  onSuccess
}) => {

  const [error, setError] = useState('')
  const [isLoading, setLoading] = useState(false)

  let action = '/artists'
  let method = 'POST'
  if (role === 'update') {
    action = `/artists/${artist.id}`
    method = 'UPDATE'
  }

  const handleClose = () => {
    setShow(false)
    setLoading(false)
    setError('')
    setArtist({ name: '' })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = document.getElementById('artist-form')

    setLoading(true)
    fetch(action, {
      method,
      body: getFormData(form),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    }).then(response => response.json())
      .then((json) => {
        if (json.error) {
          setError(json.message)
        } else {
          setShow(false)
          onSuccess()
        }
      })
  }

  const handleChange = (event) => {
    setError('')
    const artistCopy = { ...artist }
    const target = event.target
    artistCopy[target.name] = target.value
    setArtist(artistCopy)
  }

  return (
    <Modal show={show} onHide={handleClose}
      className="song-items-modal"
      aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <Alert variant="danger" show={!!error}>{error}</Alert>
          <Form noValidate
            onSubmit={handleSubmit} method={method}
            className="mt-2"
            id="artist-form"
            action={action}>
            <Form.Group controlId="artistName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Counting Crows"
                name="name"
                value={artist.name}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary"
          disabled={isLoading}
          onClick={handleClose}>
          {dismissText}
        </Button>
        <Button variant="primary"
          className={error ? 'd-none' : ''}
          disabled={isLoading}
          onClick={handleSubmit}>
          {isLoading ? 'Please wait...' : confirmText}
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
    fetch(`/${noun}s/${entity.id}`, {
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


export { ArtistModal, Deleter, ConfirmModal, SongItemsModal }
