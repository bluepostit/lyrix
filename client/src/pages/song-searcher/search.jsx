import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Page, LoadingPage } from '..'
import { useSongSearch } from '../../data/song-searcher'
import { Searcher } from '../../components/searcher'
import SongResultsForm from '../../components/song-results-form'

const SearchPage = () => {
  const history = useHistory()
  const [query, setQuery] = useState('')
  const {
    songs,
    error,
    isLoading: searchLoading
  } = useSongSearch(query)

  if (searchLoading)
    return <LoadingPage />

  const onSearch = (query) => setQuery(query)

  const handleSongClick = (song) => {
    history.push(`/songs/${song.id}`)
  }

  let body = <></>
  if (songs) {
    body = <>
      <h4>Results:</h4>
      <SongResultsForm handleResultClick={handleSongClick}
        error={error} songs={songs} />
      </>
  }

  return (
    <Page title="Search">
      <div className="page-content song-page">
        <div className="container pt-2">
          <div className="container">
            <Searcher onSearch={onSearch} />
            {body}
          </div>
        </div>
      </div>
    </Page>
  )
}

export default SearchPage
