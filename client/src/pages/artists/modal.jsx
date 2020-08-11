import React, { useState } from 'react'
import { Button, Form, Modal, Alert } from 'react-bootstrap'
import DataSource from '../../data/data-source'
import { useArtists } from '../../data/artists'

const getFormData = (form) => {
  const data = new URLSearchParams(new FormData(form))
  return data.toString()
}

const ArtistModal = ({
  role,
  title,
  show,
  onSuccess,
  onDismiss,
  confirmText = 'Save',
  dismissText = 'Cancel'
}) => {
  const { mutate: mutateArtists } = useArtists()
  const [modalArtist, setModalArtist] = useState({})
  const [error, setError] = useState('')
  const [isLoading, setLoading] = useState(false)

  let action = '/api/artists'
  let method = 'POST'
  if (role === 'update' && modalArtist) {
    action = `/api/artists/${modalArtist.id}`
    method = 'UPDATE'
  }

  const handleClose = () => {
    setLoading(false)
    onDismiss()
    setError('')
    setModalArtist({ name: '' })
    mutateArtists()
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
          setError(json.error)
          setLoading(false)
        } else {
          handleClose()
          onSuccess()
        }
      })
  }

  const handleChange = (event) => {
    setError('')
    const artistCopy = { ...modalArtist }
    const target = event.target
    artistCopy[target.name] = target.value
    setModalArtist(artistCopy)
  }

  return (
    <Modal show={show} onHide={handleClose}
      className="song-items-modal"
      animation={false}
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
                value={modalArtist.name}
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
