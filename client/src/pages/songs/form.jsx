import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { FormError } from '../../components/forms'

const fetchArtists = async () => {
  return fetch('/api/artists')
    .then(response => response.json())
    .then((json) => {
      if (json.error) {
        throw json
      }
      return json.data
    })
}

const getFormData = (form) => {
  const data = new URLSearchParams(new FormData(form))
  return data.toString()
}

const SongForm = ({
  song,
  setSong,
  action,
  method,
  onSuccess
}) => {
  const history = useHistory()

  const [artists, setArtists] = useState([])
  const [validated, setValidated] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const getArtist = (id) => {
    return artists.find(item => item.id === id)
  }

  const handleChange = (event) => {
    const songCopy = { ...song }
    const target = event.target
    if (target.name === 'artist_id') {
      songCopy.artist = getArtist(parseInt(target.value))
    } else {
      songCopy[target.name] = target.value
    }
    setSong(songCopy)
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

  useEffect(() => {
    fetchArtists()
      .then(artists => setArtists(artists))
      .catch((e) => {
        console.log('Something went wrong!')
        console.log(e)
        history.push('/login')
      })
  }, [history, artists.length]) // things to monitor for render

  return (
    <div className="container">
      <FormError error={errorMessage} />
      <Form noValidate validated={validated}
        onSubmit={handleSubmit} method="post"
        className="mt-2"
        id="song-form"
        action={action}>
        <Form.Group controlId="songTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Write your title here"
            name="title"
            value={song.title}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="songArtist">
          <Form.Label>Artist</Form.Label>
          <Form.Control
            as="select"
            name="artist_id"
            value={song.artist.id}
            onChange={handleChange} >
            {
              artists.map((artist, index) =>
                <option value={artist.id} key={index}>
                  {artist.name}
                </option>
              )
            }
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="songText">
          <Form.Label>Lyrics</Form.Label>
          <Form.Control
            as="textarea"
            rows="5"
            name="text"
            value={song.text}
            className="song-item-text-box"
            placeholder="Write the song's lyrics here"
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

export { SongForm }
