import React, { useEffect } from 'react'
import { useHistory } from "react-router-dom"
import { Page } from '../page'
import { SongForm } from './form'
import DataSource from '../../data/data-source'

const NewSong = ({
  artistsData,
  lyricsData,
  handleSearch,
  searchError
 }) => {
  const title = 'Add a Song'
  const history = useHistory()

  const handleSongsChange = (entity) => {
    if (entity === 'song') {
      onCreateSuccess()
    }
  }

  useEffect(() => {
    DataSource.addListener('change', handleSongsChange)
    return () => {
      DataSource.removeListener('change', handleSongsChange)
    }
  })

  const onCreateSuccess = () => {
    history.push('/songs')
  }

  const error = artistsData.error || lyricsData.error || searchError

  return (
    <Page title={title}>
      <div className="pt-1 song-page">
        <SongForm
          role="create"
          artists={artistsData.artists}
          lyricsData={lyricsData.data}
          handleLyricsSearch={handleSearch}
          error={error} />
      </div>
    </Page>
  )
}

export { NewSong }
