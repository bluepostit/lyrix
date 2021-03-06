import React, { useEffect } from 'react'
import { useHistory } from "react-router-dom"
import { Page } from '../page'
import { SongItemForm } from './form'
import { SongItemPageTitle } from '../../components/headers'
import DataSource from '../../data/data-source'
import useUser from '../../data/users'

const NewSongItem = ({ songData, songItemTypesData }) => {
  const title = 'Add a Song Item'
  const history = useHistory()
  const { user, isLoading: userIsLoading } = useUser()
  const song = songData.song
  const songItemTypes = songItemTypesData.songItemTypes

  if (!userIsLoading && !user.authenticated) {
    history.replace('/login')
  }

  const onSongClick = () => {
    history.push(`/songs/${song.id}`)
  }

  const onArtistClick = () => {
    history.push(`/artists/${song.artist.id}`)
  }

  const onCreateSuccess = () => {
    history.push('/song-items')
  }

  useEffect(() => {
    DataSource.addListener('operate', onCreateSuccess)
    return () => {
      DataSource.removeListener('operate', onCreateSuccess)
    }
  })

  const navActions = [
    {
      name: 'artist',
      title: song ? song.artist.name : '',
      value: onArtistClick
    }, {
      name: 'song',
      title: song ? song.title : '',
      value: onSongClick
    }
  ]

  const titleEl = <SongItemPageTitle song={song} title={title} />

  return (
    <Page title={titleEl} actions={navActions}>
      <div className="pt-1">
        <SongItemForm
          role="create"
          songItemTypes={songItemTypes}
          song={song} />
      </div>
    </Page>
  )
}

export { NewSongItem }
