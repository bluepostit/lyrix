import React, { useState } from 'react'
import { useHistory } from "react-router-dom"
import { ItemListPage } from '../item-list-page'
import { EmptyPage } from '../empty-page'
import { Icon } from '../../components/icons'
import { Deleter } from '../../components/modals'

const renderSong = (song) => {
  return (
    <div className="d-flex w-100 justify-content-between">
      <div>
        <Icon entity="song" />
        <span>{song.title}</span>
      </div>
    </div>
  )
}

const buildActions = (data, newAction, deleteAction) => {
  let actions = []
  if (data.actions) {
    actions = [
      {
        name: 'new',
        value: data.actions.create ? newAction : null
      }, {
        name: 'delete',
        value: data.actions.delete ? deleteAction : null
      }
    ]
  }
  return actions
}

const Artist = ({ data }) => {
  const history = useHistory()
  const [deleting, setDeleting] = useState(false)

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

  const artist = data.artist
  const actions = buildActions(data, onNewClick, onDeleteClick)

  if (!artist) {
    return <EmptyPage actions={actions} />
  }

  return (
    <ItemListPage
      title={artist.name}
      items={artist.songs}
      actions={actions}
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
