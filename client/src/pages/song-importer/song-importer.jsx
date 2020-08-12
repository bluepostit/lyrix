import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import { Page, LoadingPage } from '../'
import { Searcher } from '../../components/searcher'
import SongResultsForm from '../../components/song-results-form'
import { FormError } from '../../components/forms'
import DataSource from '../../data/data-source'
import { useSongSearch } from '../../data/song-importer'
import useUser from '../../data/users'
import { getFormData } from '../../util'

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
    results = <SongResultsForm
      handleSubmit={handleSubmit}
      error={error}
      songs={songs}
      title="Select a song to import:"
      action="Import!" />
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
