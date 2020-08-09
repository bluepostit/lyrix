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

  const handleSongCreate = (entity) => {
    if (entity === 'song') {
      onCreateSuccess()
    }
  }

  useEffect(() => {
    DataSource.addListener('operate', handleSongCreate)
    return () => {
      DataSource.removeListener('operate', handleSongCreate)
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
