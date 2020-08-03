import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { FormError } from '../../components/forms'

const SongItemForm = ({
  songItem,
  setSongItem,
  song,
  action,
  method,
  onSuccess
}) => {
  const history = useHistory()

  const [itemTypes, setItemTypes] = useState([])
  const [validated, setValidated] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const getItemType = (id) => {
    return itemTypes.find(item => item.id === id)
  }

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
    setErrorMessage('')
    event.preventDefault()
    const form = event.currentTarget
    // setValidated(true)

    fetch(action, {
      method,
      body: getFormData(form),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    }).then(response => response.json())
      .then((json) => {
        if (json.error) {
          setErrorMessage(json.message)
        } else {
          onSuccess()
        }
      })
  }

  const fetchSongItemTypes = async () => {
    return fetch('/song-item-types')
      .then(response => response.json())
      .then((json) => {
        if (json.error) {
          throw json
        }
        return json.data
      })
  }

  useEffect(() => {
    fetchSongItemTypes()
      .then(itemTypes => setItemTypes(itemTypes))
      .catch((e) => {
        console.log('Something went wrong!')
        console.log(e)
        history.push('/login')
      })
  }, [history, itemTypes.length]) // things to monitor for render

  return (
    <div className="container">
      <FormError error={errorMessage} />
      <Form noValidate validated={validated}
            onSubmit={handleSubmit} method="post"
            className="mt-2"
            id="song-item-form"
            action={action}>
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
            value={songItem.songItemType.id}
            onChange={handleChange} >
              {
                itemTypes.map((itemType, index) =>
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
