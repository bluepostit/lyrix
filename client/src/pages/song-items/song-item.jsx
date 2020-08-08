import React, { useState } from 'react'
import { useHistory } from "react-router-dom"
import { Page } from '../page'
import { ToTopButton } from '../../components'
import { SongItemPageTitle } from '../../components/headers'
import { Deleter } from '../../components/modals'
import { EmptyPage } from '../empty-page'

const buildActions = (data, editAction, deleteAction,
    artistAction, songAction) => {
  let actions = []
  const songItem = data.songItem
  if (songItem) {
    const hasEdit = data.actions.edit
    const hasDelete = data.actions.delete

    actions = [{
      name: 'edit',
      value: hasEdit ? editAction : null,
      hasDivider: !hasDelete
    }, {
      name: 'delete',
      value: hasDelete ? deleteAction : null,
      hasDivider: true
    }, {
      name: 'artist',
      title: data.songItem.song.artist.name,
      value: artistAction
    }, {
      name: 'song',
      title: data.songItem.song.title,
      value: songAction
    }]

  }
  return actions
}

const SongItem = ({ data }) => {
  const history = useHistory()
  const [deleting, setDeleting] = useState(false)

  const goToEdit = () => {
    history.push(`/song-items/${data.songItem.id}/edit`)
  }

  const goToArtist = () => {
    history.push(`/artists/${data.songItem.song.artist.id}`)
  }

  const goToSong = () => {
    history.push(`/songs/${data.songItem.song.id}`)
  }

  const handleDeleteClick = () => {
    setDeleting(true)
  }

  const onDelete = () => {
    history.replace('/song-items')
  }

  const songItem = data.songItem
  const actions = buildActions(data, goToEdit, handleDeleteClick,
    goToArtist, goToSong)

  if (!songItem) {
    return <EmptyPage title={<h2>Lyrix</h2>} actions={actions} />
  }

  const title = <SongItemPageTitle songItem={songItem} />
  return (
    <Page title={title} actions={actions}>
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
