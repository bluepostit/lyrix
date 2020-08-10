import React, { useState } from 'react'
import { useHistory, useParams } from "react-router-dom"
import { useArtist } from '../../data/artists'
import { ItemListPage } from '../item-list-page'
import { EmptyPage } from '../empty-page'
import LoadingPage from '../loading-page'
import { Icon } from '../../components/icons'
import { Deleter } from '../../components/modals'

const renderSong = (song, index, onClick) => {
  return (
    <button key={index}
      className="list-group-item lyrix-list-item"
      onClick={(e) => onClick(song)}>
      <div className="d-flex w-100 justify-content-between">
        <div>
          <Icon entity="song" />
          <span>{song.title}</span>
        </div>
      </div>
    </button>
  )
}

const buildActions = (actions, newAction, deleteAction) => {
  return [{
    name: 'new',
    value: actions.create ? newAction : null
  }, {
    name: 'delete',
    value: actions.delete ? deleteAction : null
  }]
}

const Artist = () => {
  const history = useHistory()
  const { id } = useParams()
  const [deleting, setDeleting] = useState(false)
  const { artist, isLoading, actions, error } = useArtist(id)

  if (isLoading)
    return <LoadingPage />
  if (error)
    return <EmptyPage message={error.toString()} />

  const onNewClick = () => {
    history.push('/songs/new')
  }

  const onSongClick = (song) => {
    history.push(`/artists/${song.artist_id}/songs/${song.id}`)
  }

  const onDeleteClick = () => {
    setDeleting(true)
  }

  const onDelete = () => {
    history.replace('/artists')
  }

  const pageActions = buildActions(actions, onNewClick, onDeleteClick)

  return (
    <ItemListPage
      title={artist.name}
      items={artist.songs}
      actions={pageActions}
      onItemClick={onSongClick}
      renderItem={renderSong}>
      <Deleter
        entity={artist}
        noun="artist"
        show={deleting}
        setShow={setDeleting}
        onDelete={onDelete}
      />
    </ItemListPage>
  )}

export { Artist }
