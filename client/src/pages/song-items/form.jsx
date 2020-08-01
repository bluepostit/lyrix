import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'

const SongItemForm = (props) => {
  const history = useHistory()
  const item = props.songItem || {}
  const [itemTypes, setItemTypes] = useState([])
  const [validated, setValidated] = useState(false)
  const [title, setTitle] = useState(item.title || '')
  const [text, setText] = useState(item.title || '')

  const [songItemType, setSongItemType] =
    useState(item.songItemTypeId || '')

  const onTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const onTextChange = (event) => {
    setText(event.target.value)
  }

  const onSongItemTypeChange = (event) => {
    setSongItemType(event.target.value)
  }

  const getFormData = (form) => {
    const data = new URLSearchParams(new FormData(form))
    return data.toString()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    console.log(form)
    // setValidated(true)
    const data = getFormData(form)
    console.log(data)

    const res = await fetch(event.target.action, {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
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
      <Form noValidate validated={validated}
            onSubmit={handleSubmit} method="post"
            className="mt-2"
            id="song-item-form"
            action="/song-items">
        <input type="hidden"
               name="song_id"
               value={props.song.id}
               />
        <Form.Group controlId="songItemTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Chords in G#"
            name="title"
            value={title}
            onChange={onTitleChange}
          />
        </Form.Group>
        <Form.Group controlId="songItemType">
          <Form.Label>Song Item Type</Form.Label>
          <Form.Control
            as="select"
            name="song_item_type_id"
            value={songItemType}
            onChange={onSongItemTypeChange} >
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
            value={text}
            className="song-item-text-box"
            placeholder="G#..."
            onChange={onTextChange}
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
