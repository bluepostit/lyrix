import React, { useState } from 'react'
import { useHistory, useLocation } from "react-router-dom"
import { Page } from '../page'
import { ToTopButton } from '../../components'
import { Deleter, SongItemsModal } from '../../components/modals'
import { pluralize } from '../../util'
import { EmptyPage } from '../empty-page'

const buildActions = (data, location, editAction, deleteAction,
    songItemsAction) => {
  let actions = []
  const song = data.song
  if (song) {
    const songItems = song.songItems || []
    const songItemsTitle =
      `You have ${pluralize(songItems.length, 'item')}`
    const hasEdit = data.actions && data.actions.edit
    const hasDelete = data.actions && data.actions.delete

    let nextLink
    if (song.nextSongId) {
      nextLink = location.pathname.replace(
        /songs\/\d+/,
        `songs/${song.nextSongId}`)
    }

    actions = [{
      name: 'artist',
      title: song.artist.name,
      value: `/artists/${song.artist.id}`,
      hasDivider: !nextLink
    }, {
      name: 'next',
      value: nextLink,
      hasDivider: true
    }, {
      name: 'songItem',
      title: songItemsTitle,
      value: songItemsAction,
      hasDivider: hasEdit || hasDelete
    }, {
      name: 'edit',
      value: hasEdit ? editAction : null
    }, {
      name: 'delete',
      value: hasDelete ? deleteAction : null
    }]
  }
  return actions
}

const Song = ({ data }) => {
  const history = useHistory()
  const location = useLocation()
  const [showSongItemsModal, setShowSongItemsModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const goToEdit = () => {
    history.push(`/songs/${data.id}/edit`)
  }

  const handleDeleteClick = () => {
    setDeleting(true)
  }

  const onSongItemsButtonClick = () => {
    setShowSongItemsModal(true)
  }

  const handleSongItemsModalClose = (value) => {
    if (value === 'new') {
      history.push(`/songs/${data.id}/song-items/new`)
    } else if (value) {
      history.push(`/song-items/${value.id}`)
    }
    setShowSongItemsModal(false)
  }

  const onDelete = () => {
    history.replace('/songs')
  }

  const song = data.song
  const actions = buildActions(data, location, goToEdit, handleDeleteClick,
    onSongItemsButtonClick)

  if (!song) {
    return <EmptyPage title={<h2>Lyrix</h2>} actions={actions} />
  }
  return (
    <Page title={song.title} actions={actions}>
      <div className="song-page-contents">
        <div className="song-text">
          {song.text}
        </div>
        <ToTopButton />
      </div>
      <SongItemsModal title="Your Song Items"
        songItems={song.songItems || []}
        show={showSongItemsModal}
        handleClose={handleSongItemsModalClose}
      />
      <Deleter
        entity={data}
        noun="song"
        show={deleting}
        setShow={setDeleting}
        onDelete={onDelete}
      />
    </Page>
  )
}

export { Song }
