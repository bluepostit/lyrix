import React, { useState } from 'react'
import { Button, Form, Modal, Alert } from 'react-bootstrap'

const getFormData = (form) => {
  const data = new URLSearchParams(new FormData(form))
  return data.toString()
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

  let action = '/api/artists'
  let method = 'POST'
  if (role === 'update') {
    action = `/api/artists/${artist.id}`
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
          setLoading(false)
        } else {
          handleClose()
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
                placeholder="Type the artist's name here"
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

export { ArtistModal }
