import React, { useEffect } from 'react'
import { useHistory, useParams } from "react-router-dom"
import { Page } from '../page'
import { EmptyPage } from '../empty-page'
import LoadingPage from '../loading-page'
import { SongForm } from './form'
import DataSource from '../../data/data-source'
import useUser from '../../data/users'

const EditSong = ({
  artistsData,
  lyricsData,
  handleSearch,
  searchError
 }) => {
  const title = 'Edit Song'
  const history = useHistory()
  const { id } = useParams()
  const { user, isLoading: userIsLoading } = useUser()

  const handleSuccess = (entity) => {
    if (entity === 'song') {
      history.push(`/songs/${id}`)
    }
  }

  useEffect(() => {
    DataSource.addListener('operate', handleSuccess)
    return () => {
      DataSource.removeListener('operate', handleSuccess)
    }
  })

  if (userIsLoading) {
    return <LoadingPage />
  }
  if (!user.authenticated) {
    history.replace('/login')
  } else if (!user.admin) {
    return <EmptyPage message="You aren't authorized to edit songs" />
  }

  const error = artistsData.error || lyricsData.error || searchError

  return (
    <Page title={title}>
      <div className="pt-1 song-page">
        <SongForm
          role="edit"
          songId={id}
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
