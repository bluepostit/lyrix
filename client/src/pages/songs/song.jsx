import React, { useState } from 'react'
import { useHistory, useParams, useLocation } from "react-router-dom"
import { Page } from '../page'
import { ToTopButton } from '../../components'
import { Deleter, SongItemsModal } from '../../components/modals'
import { pluralize } from '../../util'
import { EmptyPage } from '../empty-page'
import DataSource from '../../data/data-source'
import useUser from '../../data/users'
const debug = require('debug')('lyrix:song')

const buildActions = (data, editAction, deleteAction,
    nextAction, songItemsAction) => {
  let actions = []
  const song = data.song
  if (song) {
    const songItems = song.songItems || []
    const songItemsTitle =
      `You have ${pluralize(songItems.length, 'item')}`
    const hasEdit = data.actions && data.actions.edit
    const hasDelete = data.actions && data.actions.delete

    actions = [{
      name: 'artist',
      title: song.artist.name,
      value: `/artists/${song.artist.id}`,
      hasDivider: !song.nextSongId
    }, {
      name: 'next',
      value: song.nextSongId ? nextAction : null,
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

const fetchNextSong = (params, nextSongId) => {
  const nextParams = {...params}
  nextParams.songId = nextSongId
  DataSource.fetch('song', nextParams)
}

const Song = ({ data }) => {
  const song = data.song
  const history = useHistory()
  const location = useLocation()
  const params = useParams()
  const [showSongItemsModal, setShowSongItemsModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const { user } = useUser()

  const goToEdit = () => {
    history.push(`/songs/${song.id}/edit`)
  }

  const nextAction = () => {
    debug('nextAction()')
    if (song.nextSongId) {
      const nextLink = location.pathname.replace(
        /songs\/\d+/,
        `songs/${song.nextSongId}`)
      debug('nextLink: "%s"', nextLink)
      history.push(nextLink)
      fetchNextSong(params, song.nextSongId)
    }
  }

  const handleDeleteClick = () => {
    setDeleting(true)
  }

  const onSongItemsButtonClick = () => {
    if (user.authenticated) {
      setShowSongItemsModal(true)
    } else {
      history.push('/login')
    }
  }

  const handleSongItemsModalClose = (value) => {
    if (value === 'new') {
      history.push(`/songs/${song.id}/song-items/new`)
    } else if (value) {
      history.push(`/song-items/${value.id}`)
    }
    setShowSongItemsModal(false)
  }

  const onDelete = () => {
    history.replace('/songs')
  }

  const actions = buildActions(data, goToEdit,
    handleDeleteClick, nextAction, onSongItemsButtonClick)

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
        entity={song}
        noun="song"
        show={deleting}
        setShow={setDeleting}
        onDelete={onDelete}
      />
    </Page>
  )
}

export { Song }
