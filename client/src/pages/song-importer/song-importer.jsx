import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import {
  Button, Form, ToggleButton, ToggleButtonGroup
} from 'react-bootstrap'
import { Page, LoadingPage } from '../'
import { Searcher } from './searcher'
import { Song } from '../../components/list-items'
import { FormError } from '../../components/forms'
import DataSource from '../../data/data-source'
import { useSongSearch } from '../../data/song-importer'
import useUser from '../../data/users'

const getFormData = (form) => {
  const data = new URLSearchParams(new FormData(form))
  return data.toString()
}

const SongImporter = (props) => {
  const title = 'Import a Song'
  const history = useHistory()
  const [searching, setSearching] = useState(false)
  const [query, setQuery] = useState('')
  const { user, isLoading: userLoading } = useUser()
  const {
    songs, error: searchError, isLoading: searchLoading
  } = useSongSearch(query)

  useEffect(() => {
    setSearching(false)
  }, [songs])

  if (!userLoading && !user.authenticated) {
    history.replace('/login')
  }

  if (userLoading || searchLoading)
    return <LoadingPage />

  const onImportSuccess = (song) => {
    history.push(`/songs/${song.id}`)
  }

  const onSearch = (query) => {
    setSearching(true)
    setQuery(query)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const query = getFormData(event.currentTarget)
    DataSource.fetch('importerImport', null, query)
  }

  let results
  if (searchError) {
    results = <FormError error={searchError} />
  } else if (songs) {
    results = (
      <div>
        <Form onSubmit={handleSubmit}
          className="mt-2"
          id="song-importer-import-form">
          <Form.Group controlId="query" hidden={songs.length < 1}>
            <Form.Label>Select a Song to Import</Form.Label>
            <ToggleButtonGroup type="radio" name="sid" vertical
              className="song-importer-results-buttons lyrix-list">
              {
                songs.map((song, index) =>
                  <ToggleButton value={song.id} key={index + 1}
                    variant="outline" className="lyrix-list-item">
                    {Song(song, index, () => { })}
                  </ToggleButton>
                )
              }
            </ToggleButtonGroup>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="primary" type="submit"
              hidden={songs.length < 1}>
              Import!
          </Button>
          </div>
        </Form>
      </div>
    )
  }

  return (
    <Page title={title}>
      <div className="page-content song-page">
        <div className="container pt-2">
          <Searcher onSearch={onSearch} />
          {results}
        </div>
      </div>
    </Page>
  )
}

export { SongImporter }
