import React, { useEffect } from 'react'
import { useHistory } from "react-router-dom"
import { Page } from '../page'
import { SongForm } from './form'
import DataSource from '../../data/data-source'
import useUser from '../../data/users'
import { EmptyPage } from '../empty-page'
import LoadingPage from '../loading-page'

const NewSong = ({
  artistsData,
  lyricsData,
  handleSearch,
  searchError
 }) => {
  const title = 'Add a Song'
  const history = useHistory()
  const { user, isLoading: userIsLoading } = useUser()

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

  if (userIsLoading) {
    return <LoadingPage />
  }
  if (!user.authenticated) {
    history.replace('/login')
  } else if (!user.admin) {
    return <EmptyPage message="You aren't authorized to create songs" />
  }

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
