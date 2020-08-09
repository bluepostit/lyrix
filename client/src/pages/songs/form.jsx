import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { FormError } from '../../components/forms'
import DataSource from '../../data/data-source'
import { EmptyPage } from '../empty-page'
const debug = require('debug')('lyrix:songs-form')

const getFormData = (form) => {
  const data = new URLSearchParams(new FormData(form))
  return data.toString()
}

const SongForm = ({
  songEntity = {
    title: '',
    text: '',
    artist: { id: '' }
  },
  error,
  role,
  artists,
  lyricsData,
  handleLyricsSearch,
  onSuccess
}) => {
  const history = useHistory()
  const [song, setSong] = useState(songEntity)
  const [validated, setValidated] = useState(false)

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

  useEffect(() => {
    if (lyricsData && lyricsData.lyrics) {
      if ((lyricsData.artist === song.artist.name)
        && lyricsData.lyrics) {
          updateSong({
            text: lyricsData.lyrics,
            title: lyricsData.title
          })
      }
    }
  }, [lyricsData])

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
    const query = new URLSearchParams({
      artist_id: song.artist.id,
      title: song.title
    })
    handleLyricsSearch(query)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    if (role === 'create') {
      DataSource.post('song', null, getFormData(form))
    }
    // setValidated(true)
  }

  if (!artists || artists.length < 1) {
    return (
      <EmptyPage message="There are no artists yet!" />
    )
  }

  return (
    <div className="container">
      <FormError error={error} />
      <Form noValidate validated={validated}
        onSubmit={handleSubmit}
        className="mt-2"
        id="song-form">
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
            <Button variant="secondary" size="sm" className="ml-2"
              onClick={searchLyrics}>
                Search!
            </Button>
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
