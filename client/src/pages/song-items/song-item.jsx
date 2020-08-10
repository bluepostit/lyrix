import React, { useState } from 'react'
import { useHistory, useParams } from "react-router-dom"
import { Page, EmptyPage, LoadingPage } from '../'
import { ToTopButton } from '../../components'
import { SongItemPageTitle } from '../../components/headers'
import { Deleter } from '../../components/modals'
import { useSongItem } from '../../data/song-items'
import useUser from '../../data/users'
const debug = require('debug')('lyrix:song-items')

const buildActions = (songItem, actions, editAction,
    deleteAction, artistAction, songAction) => {

  return [{
    name: 'edit',
    value: actions.edit ? editAction : null,
    hasDivider: !actions.delete
  }, {
    name: 'delete',
    value: actions.delete ? deleteAction : null,
    hasDivider: true
  }, {
    name: 'artist',
    title: songItem.song.artist.name,
    value: artistAction
  }, {
    name: 'song',
    title: songItem.song.title,
    value: songAction
  }]
}

const SongItem = () => {
  const history = useHistory()
  const params = useParams()
  const [deleting, setDeleting] = useState(false)
  const { user, isLoading: userIsLoading } = useUser()
  const { songItem, error, actions, isLoading } = useSongItem(params.id)

  if (isLoading)
    return <LoadingPage />
  if (error)
    return <EmptyPage message={error.toString()} />

  if (!userIsLoading && !user.authenticated) {
    history.replace('/login')
  }

  const goToEdit = () => {
    history.push(`/song-items/${songItem.id}/edit`)
  }

  const goToArtist = () => {
    history.push(`/artists/${songItem.song.artist.id}`)
  }

  const goToSong = () => {
    history.push(`/songs/${songItem.song.id}`)
  }

  const handleDeleteClick = () => {
    setDeleting(true)
  }

  const onDelete = () => {
    history.replace('/song-items')
  }

  const pageActions = buildActions(songItem, actions,
    goToEdit, handleDeleteClick, goToArtist, goToSong)

  if (!songItem) {
    return <EmptyPage actions={actions} />
  }

  const title = <SongItemPageTitle songItem={songItem} />
  return (
    <Page title={title} actions={pageActions}>
      <div className="song-item-text-display">
        <div className="song-item-text-box">
          {songItem.text}
        </div>
      </div>
      <ToTopButton />
      <Deleter
        entity={songItem}
        noun="song-item"
        show={deleting}
        setShow={setDeleting}
        onDelete={onDelete}
      />
    </Page>
  )
}

export { SongItem }
