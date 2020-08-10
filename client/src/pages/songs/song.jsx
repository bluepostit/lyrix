import React, { useState } from 'react'
import { useHistory, useParams, useLocation } from "react-router-dom"
import { Page } from '../page'
import { ToTopButton } from '../../components'
import { Deleter, SongItemsModal, SelectSonglistModal } from '../../components/modals'
import { pluralize } from '../../util'
import { EmptyPage } from '../empty-page'
import DataSource from '../../data/data-source'
import useUser from '../../data/users'
const debug = require('debug')('lyrix:song')

const buildActions = (data, editAction, deleteAction,
    nextAction, songItemsAction, addToSonglistAction) => {
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
      name: 'add',
      title: 'Add to songlist...',
      value: addToSonglistAction,
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
  const [showAddToSonglistModal, setShowAddToSonglistModal] = useState(false)
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

  const addToSonglistAction = () => {
    setShowAddToSonglistModal(true)
  }

  const onSonglistSelect = (songlist) => {
    debug('selected songlist! %o', songlist)
    const createParams = {
      id: songlist.id
    }
    const body = new URLSearchParams({ songId: song.id }).toString()
    DataSource.addListener('operate', () => {
      history.push(`/songlists/${songlist.id}`)
    })
    DataSource.create('addToSonglist', createParams, body)
  }

  const actions = buildActions(data, goToEdit,
    handleDeleteClick, nextAction, onSongItemsButtonClick,
    addToSonglistAction)

  if (!song) {
    return <EmptyPage actions={actions} />
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
      <SelectSonglistModal
        show={showAddToSonglistModal}
        setShow={setShowAddToSonglistModal}
        onSelect={onSonglistSelect}
      />
    </Page>
  )
}

export { Song }
