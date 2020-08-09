import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { FormError } from '../../components/forms'
import DataSource from '../../data/data-source'
import { EmptyPage } from '../empty-page'

const SongItemForm = ({
  songItemId,
  song,
  songItemTypes,
  role
}) => {
  const [songItem, setSongItem] = useState({})
  const [error, setError] = useState('')
  const [validated, setValidated] = useState(false)

  const getItemType = (id) => {
    return songItemTypes.find(item => item.id === id)
  }

  const onError = (error) => {
    setError(error)
  }

  useEffect(() => {
    DataSource.addListener('error', onError)
    return () => {
      DataSource.removeListener('error', onError)
    }
  })

  const handleChange = (event) => {
    const songItemCopy = { ...songItem }
    const target = event.target
    if (target.name === 'song_item_type_id') {
      songItemCopy.songItemType = getItemType(parseInt(target.value))
    } else {
      songItemCopy[target.name] = target.value
    }
    setSongItem(songItemCopy)
  }

  const getFormData = (form) => {
    const data = new URLSearchParams(new FormData(form))
    return data.toString()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    // setValidated(true)
    if (role === 'create') {
      DataSource.create('songItem', null, getFormData(form))
    }
  }

  if (!song || !songItemTypes || songItemTypes.length < 1) {
    return <EmptyPage message="Not enough data to create a song item." />
  }

  return (
    <div className="container">
      <FormError error={error} />
      <Form noValidate validated={validated}
            onSubmit={handleSubmit}
            className="mt-2"
            id="song-item-form">
        <input type="hidden"
               name="song_id"
               value={song.id}
               />
        <Form.Group controlId="songItemTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Write your title here"
            name="title"
            value={songItem.title}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="songItemType">
          <Form.Label>Song Item Type</Form.Label>
          <Form.Control
            as="select"
            name="song_item_type_id"
            value={songItem.songItemType ? songItem.songItemType.id : ''}
            onChange={handleChange} >
              {
                songItemTypes.map((itemType, index) =>
                  <option value={itemType.id} key={index}>
                    {itemType.name}
                  </option>
                )
              }
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="songItemText">
          <Form.Label>Text</Form.Label>
          <Form.Control
            as="textarea"
            rows="5"
            name="text"
            value={songItem.text}
            className="song-item-text-box"
            placeholder="Write your notes here"
            onChange={handleChange}
          />
        </Form.Group>
        <div className="d-flex justify-content-end">
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </div>
      </Form>
    </div>
  )
}

export { SongItemForm }
