import React, { useEffect, useState } from 'react'
import { useHistory, useLocation, useParams } from "react-router-dom"
import { Page } from '../page'
import { ToTopButton } from '../../components'
import { Deleter, SongItemsModal } from '../../components/modals'
import { pluralize } from '../../util'

const getSongData = (songId, songlistId, artistId) => {
  let url = `/api/songs/${songId}`
  if (songlistId) {
    url += `?context=songlist&contextId=${songlistId}`
  } else if (artistId) {
    url += '?context=artist'
  } else {
    url += '?context=songlist' // Assumed context: ALL songs
  }
  return fetch(url)
    .then(response => response.json())
    .then((json) => {
      if (json.error) {
        throw json
      }
      return json
    })
}

const PageContent = (props) => {
  return (
    <div className="song-page-contents">
      <div className="song-text">
        {props.song.text}
      </div>
      <ToTopButton />
    </div>
  )
}

const Song = (props) => {
  const loader = props.loader
  const { artistId, songlistId, songId } = useParams()
  const [data, setData] = useState({
    data: {
      title: null,
      text: null,
      artist: { id: '' },
      songItems: []
    },
    actions: []
  })
  const [nextLink, setNextLink] = useState()
  const [showSongItemsModal, setShowSongItemsModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const history = useHistory()
  const location = useLocation()

  const goToEdit = () => {
    history.push(`/songs/${data.data.id}/edit`)
  }

  const handleDeleteClick = () => {
    setDeleting(true)
  }

  const onSongItemsButtonClick = () => {
    setShowSongItemsModal(true)
  }

  const handleSongItemsModalClose = (value) => {
    if (value === 'new') {
      history.push(`/songs/${data.data.id}/song-items/new`)
    } else if (value) {
      history.push(`/song-items/${value.id}`)
    }
    setShowSongItemsModal(false)
  }

  const onDelete = () => {
    history.replace('/songs')
  }

  const songItems = data.data.songItems || []
  const songItemsTitle =
    `You have ${pluralize(songItems.length, 'item')}`
  const hasEdit = data.actions.edit
  const hasDelete = data.actions.delete

  const navActions = [{
    name: 'artist',
    title: data.data.artist.name,
    value: `/artists/${data.data.artist.id}`,
    hasDivider: !nextLink
  }, {
    name: 'next',
    value: nextLink,
    hasDivider: true
    }, {
    name: 'songItem',
    title: songItemsTitle,
    value: onSongItemsButtonClick,
    hasDivider: hasEdit || hasDelete
  },{
    name: 'edit',
    value: hasEdit ? goToEdit : null
  }, {
    name: 'delete',
    value: hasDelete ? handleDeleteClick : null
  }]

  useEffect(() => {
    loader.start('Loading song...')
    getSongData(songId, songlistId, artistId)
      .then((data) => {
        setData(data)
        if (data.data.nextSongId) {
          setNextLink(location.pathname.replace(/songs\/\d+/, `songs/${data.data.nextSongId}`))
        } else {
          setNextLink(null)
        }
        loader.stop()
      })
      .catch((e) => {
        console.log('Something went wrong!')
        console.log(e)
        history.push('/login')
      })
    }, [history, songId, artistId, songlistId, location.pathname]) // things to monitor for render
    // See https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects

  return (
    <Page title={data.data.title} actions={navActions}>
      <div className="song-page-contents">
        <div className="song-text">
          {data.data.text}
        </div>
        <ToTopButton />
      </div>
      <SongItemsModal title="Your Song Items"
        songItems={songItems}
        show={showSongItemsModal}
        handleClose={handleSongItemsModalClose}
      />
      <Deleter
        entity={data.data}
        noun="song"
        show={deleting}
        setShow={setDeleting}
        onDelete={onDelete}
      />
    </Page>
  )
}

export { Song }
