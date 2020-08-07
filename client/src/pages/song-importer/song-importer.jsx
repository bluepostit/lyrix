import React, { useState } from 'react'
import { useHistory } from "react-router-dom"
import {
  Button, Form, ToggleButton, ToggleButtonGroup
} from 'react-bootstrap'
import { Page } from '../page'
import { Searcher } from './searcher'
import { Song } from '../../components/list-items'
import { FormError } from '../../components/forms'

const getFormData = (form) => {
  const data = new URLSearchParams(new FormData(form))
  return data.toString()
}

const SongImporter = ({ loader }) => {
  const title = 'Import a Song'
  const history = useHistory()
  const action = '/api/song-importer/import'
  const [songs, setSongs] = useState([])
  const [error, setError] = useState('')

  const onImportSuccess = (song) => {
    history.push(`/songs/${song.id}`)
  }

  const handleSearchStart = () => {
    setSongs([])
    setError('')
  }

  const onSearch = (res) => {
    let songs = []
    if (res.data && res.data.songs) {
      songs = res.data.songs
    }
    setSongs(songs)
  }

  const getImportUrl = (form) => {
    const queryString = getFormData(form)
    const url = `${action}?${queryString}`
    return url
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')
    const url = getImportUrl(event.currentTarget)
    loader.start('Importing...')
    fetch(url)
      .then(res => res.json())
      .then((json) => {
        if (json.status !== 200) {
          setError(json.message)
        } else {
          const song = json.data.song
          onImportSuccess(song)
        }
      }).finally(() => {
        loader.stop()
      })
  }

  const content =
    <div className="container pt-2">
      <Searcher
        loader={loader}
        onSearchStart={handleSearchStart}
        onSearchComplete={onSearch}
        action={'/api/song-importer/search'}
      />
      <div>
        <FormError error={error} />
        <Form onSubmit={handleSubmit}
          className="mt-2"
          id="song-importer-import-form">
          <Form.Group controlId="query" hidden={songs.length < 1 }>
            <Form.Label>Select a Song to Import</Form.Label>
            <ToggleButtonGroup type="radio" name="sid" vertical
              className="song-importer-results-buttons lyrix-list">
              {
                songs.map((song, index) =>
                  <ToggleButton value={song.id} key={index + 1}
                    variant="outline" className="lyrix-list-item">
                    <Song song={song} />
                  </ToggleButton>
                )
              }
            </ToggleButtonGroup>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="primary" type="submit"
              disabled={loader.loading} hidden={songs.length < 1}>
              Import!
            </Button>
          </div>
        </Form>
      </div>
    </div>

  return (
    <Page title={title}>
      <div className="page-content song-page">
        {content}
      </div>
    </Page>
  )
}

export { SongImporter }
