import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { FormError } from '../../components/forms'
import { LoadingModal } from '../../components/modals'

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
  loader,
  onSuccess
}) => {
  const history = useHistory()

  const [artists, setArtists] = useState([])
  const [validated, setValidated] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const getArtist = (id) => {
    return artists.find(item => item.id === id)
  }

  const updateSong = (changes) => {
    const songCopy = { ...song }
    for (const key in changes) {
      if (changes.hasOwnProperty(key)) {
        const value = changes[key]
        songCopy[key] = value
      }
    }
    setSong(songCopy)
  }

  const handleChange = (event) => {
    let key = event.target.name
    let value = event.target.value
    if (key === 'artist_id') {
      key = 'artist'
      value = getArtist(parseInt(event.target.value))
        || { id: '' }
    }
    updateSong({ [key]: value })
  }

  const searchLyrics = async () => {
    setErrorMessage('')
    loader.start('Searching for lyrics...')
    const query = new URLSearchParams({
      artist_id: song.artist.id,
      title: song.title
    })
    const url = `/api/lyrics?${query.toString()}`
    fetch(url)
      .then(res => res.json())
      .then((json) => {
        if (json.error) {
          setErrorMessage(json.error)
        } else {
          updateSong({
            title: json.data.title,
            text: json.data.lyrics
          })
        }
      }).finally(() => {
        loader.stop()
      })
  }

  const handleSubmit = async (event) => {
    setErrorMessage('')
    event.preventDefault()
    const form = event.currentTarget
    // setValidated(true)

    loader.start('Saving song...')
    fetch(action, {
      method,
      body: getFormData(form),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    }).then(response => response.json())
      .then((json) => {
        if (json.error) {
          setErrorMessage(json.error)
        } else {
          onSuccess()
        }
      }).finally(() => {
        loader.stop()
      })
  }

  useEffect(() => {
    loader.start('Loading artists...')
    fetchArtists()
      .then((artists) => {
        setArtists(artists)
      })
      .catch((e) => {
        console.log('Something went wrong!')
        console.log(e)
        history.push('/login')
      }).finally(() => {
        loader.stop()
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
              <option value=""></option>
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
          <div>
            <Form.Label>Lyrics</Form.Label>
            <Button variant="secondary" size="sm" className="ml-2" onClick={searchLyrics}>Search!</Button>
          </div>
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
