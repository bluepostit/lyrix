import React, { useEffect } from 'react'
import { useHistory, useParams } from "react-router-dom"
import { Page } from '../page'
import { SongForm } from './form'
import DataSource from '../../data/data-source'

const EditSong = ({
  songData,
  setSongData,
  artistsData,
  lyricsData,
  handleSearch,
  searchError
 }) => {
  const title = 'Edit Song'
  const history = useHistory()
  const { id } = useParams()

  const onUpdateSuccess = () => {
    history.push(`/songs/${id}`)
  }

  const handleSongUpdate = (entity) => {
    if (entity === 'song') {
      onUpdateSuccess()
    }
  }

  useEffect(() => {
    DataSource.addListener('operate', handleSongUpdate)
    return () => {
      DataSource.removeListener('operate', handleSongUpdate)
    }
  })

  const song = songData.song
  const error = artistsData.error || lyricsData.error || searchError

  return (
    <Page title={title}>
      <div className="pt-1 song-page">
        <SongForm
          role="edit"
          songData={songData}
          setSongData={setSongData}
          error={error}
          artists={artistsData.artists}
          lyricsData={lyricsData.data}
          handleLyricsSearch={handleSearch}
          />
      </div>
    </Page>
  )
}

export { EditSong }
