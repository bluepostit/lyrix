import React, { useEffect, useState } from 'react'
import { useHistory } from "react-router-dom"
import {
  Button, Form, ToggleButton, ToggleButtonGroup
} from 'react-bootstrap'
import { Page } from '../page'
import { Searcher } from './searcher'
import { Song } from '../../components/list-items'
import { LoadingModal } from '../../components/modals'
import { FormError } from '../../components/forms'

const getFormData = (form) => {
  const data = new URLSearchParams(new FormData(form))
  return data.toString()
}

const SongImporter = () => {
  const title = 'Import a Song'
  const history = useHistory()
  const action = '/api/song-importer/import'
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingTitle, setLoadingTitle] = useState('')
  const [error, setError] = useState('')

  // useEffect(() => {
  //   fetchSong(songId)
  //     .then((song) => {
  //       setSong(song)
  //       // songItem.song = song
  //     })
  //     .catch((e) => {
  //       console.log('Something went wrong!')
  //       console.log(e)
  //       history.push('/login')
  //     })
  // }, [history, songId, songItem.song]) // things to monitor for render


  const onCreateSuccess = () => {
    history.push('/songs')
  }

  const handleSearchStart = () => {
    setSongs([])
    setLoadingTitle('Searching...')
  }

  const onSearch = (res) => {
    let songs = []
    if (res.data && res.data.songs) {
      songs = res.data.songs
    }
    setSongs(songs)
    setLoading(false)
  }

  const onSearchError = (error) => {
    console.log('error!')
    console.log(error)
  }

  const getImportUrl = (form) => {
    const queryString = getFormData(form)
    const url = `${action}?${queryString}`
    return url
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log('submit!')
    setError('')
    const url = getImportUrl(event.currentTarget)
    setLoadingTitle('Importing...')
    setLoading(true)
    fetch(url)
      .then(res => res.json())
      .then((json) => {
        setLoading(false)
        console.log(json)
        if (json.status !== 200) {
          setError(json.message)
        } else {
          const song = json.data.song
          history.push(`/songs/${song.id}`)
        }
      })

  }

  const content =
    <>
      <Searcher
        loading={loading}
        setLoading={setLoading}
        onSearchStart={handleSearchStart}
        onSearchComplete={onSearch}
        action={'/api/song-importer/search'}
      />
      <LoadingModal
        loading={loading}
        title={loadingTitle}
      />
      <div className="container">
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
              disabled={loading} hidden={songs.length < 1}>
              Import!
            </Button>
          </div>
        </Form>
      </div>
    </>

  return (
    <div className="song-page">
      <Page
        content={content}
        title={title}
      />
    </div>
  )
}

export { SongImporter }
