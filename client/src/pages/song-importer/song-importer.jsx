import React, { useState } from 'react'
import { useHistory } from "react-router-dom"
import {
  Button, Form, ToggleButton, ToggleButtonGroup
} from 'react-bootstrap'
import { Page } from '../page'
import { Searcher } from './searcher'
import { Song } from '../../components/list-items'
import { FormError } from '../../components/forms'
import DataSource from '../../data/data-source'
import useUser from '../../data/users'

const getFormData = (form) => {
  const data = new URLSearchParams(new FormData(form))
  return data.toString()
}

const SongImporter = (props) => {
  const { data, ...rest } = props
  const title = 'Import a Song'
  const history = useHistory()
  const { user, isLoading: userIsLoading } = useUser()

  if (!userIsLoading && !user.authenticated) {
    history.replace('/login')
  }

  const onImportSuccess = (song) => {
    history.push(`/songs/${song.id}`)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const query = getFormData(event.currentTarget)
    DataSource.fetch('importerImport', null, query)
  }

  const songs = data.songs || []
  const error = data.error ? <FormError error={data.error} /> : <></>

  const content =
    <div className="container pt-2">
      <Searcher {...rest} />
      <div>
        {data.error}
        {error}
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
                    {Song(song, index, () => {})}
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
