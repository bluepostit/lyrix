import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import {
  Button, Form, ToggleButton, ToggleButtonGroup
} from 'react-bootstrap'
import { Page, LoadingPage } from '../'
import { Searcher } from './searcher'
import { FormError } from '../../components/forms'
import { Icon } from '../../components/icons'
import DataSource from '../../data/data-source'
import { useSongSearch } from '../../data/song-importer'
import useUser from '../../data/users'

const getFormData = (form) => {
  const data = new URLSearchParams(new FormData(form))
  return data.toString()
}

const SongImporter = () => {
  const title = 'Import a Song'
  const history = useHistory()
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  const { user, isLoading: userLoading } = useUser()
  const {
    songs, error: searchError, isLoading: searchLoading
  } = useSongSearch(query)

  const onImportSuccess = (entity, songData) => {
    history.push(`/songs/${songData.song.id}`)
  }

  const onError = (error) => setError(error)

  useEffect(() => {
    DataSource.addListener('error', onError)
    DataSource.addListener('change', onImportSuccess)
    return () => DataSource.removeListener('change', onImportSuccess)
  })

  if (!userLoading && !user.authenticated) {
    history.replace('/login')
  }

  if (userLoading || searchLoading)
    return <LoadingPage />

  if (searchError) {
    setError(searchError)
  }

  const onSearch = (query) => {
    setQuery(query)
    setError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const query = getFormData(event.currentTarget)
    DataSource.fetch('importerImport', null, query)
  }

  let results
  if (error && !songs) {
    results = <FormError error={error} />
  } else if (songs) {
    results = (
      <div>
        <Form onSubmit={handleSubmit}
          className="mt-2"
          id="song-importer-import-form">
          <FormError error={error} />
          <Form.Group controlId="query" hidden={songs.length < 1}>
            <Form.Label>Select a Song to Import</Form.Label>
            <ToggleButtonGroup type="radio" name="sid" vertical
              className="song-importer-results-buttons lyrix-list">
              {
                songs.map((song, index) =>
                  <ToggleButton value={song.id} key={index}
                    variant="outline" className="lyrix-list-item">
                    <div className="d-flex w-100 justify-content-between">
                      <div>
                        <Icon entity="song" />
                        <span>{song.title}</span>
                        <em><small>
                          &ndash; {song.artist.name || song.artist}
                        </small></em>
                      </div>
                      <div>
                      </div>
                    </div>
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
