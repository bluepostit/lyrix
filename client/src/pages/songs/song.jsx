import React, { useEffect, useState } from 'react'
import { useHistory, useLocation, useParams } from "react-router-dom"
import { Page } from '../page'
import { ToTopButton, SongItemsButton } from '../../components'
import { Deleter } from '../../components/modals'

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
    <div className="song-page-contents beneath-nav">
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
      artist: { id: '' }
    },
    actions: []
  })
  const [nextLink, setNextLink] = useState()
  const [deleting, setDeleting] = useState(false)
  const history = useHistory()
  const location = useLocation()

  const goToEdit = () => {
    history.push(`/songs/${data.data.id}/edit`)
  }

  const handleDeleteClick = () => {
    setDeleting(true)
  }

  const onDelete = () => {
    history.replace('/songs')
  }

  const navActions = [{
    name: 'artist',
    title: data.data.artist.name,
    value: `/artists/${data.data.artist.id}`,
    hasDivider: true
  }, {
    name: 'next',
    value: nextLink,
    hasDivider: true
  }, {
    name: 'edit',
    value: goToEdit
  }, {
    name: 'delete',
    value: handleDeleteClick
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

  const peeker = <SongItemsButton song={data.data} {...props} />

  return (
    <div className="song-page">
      <Page
        content={<PageContent song={data.data} />}
        title={data.data.title}
        actions={data.actions}
        loader={props.loader}
        navActions={navActions}
        peeker={peeker}
      />
      <Deleter
        entity={data.data}
        noun="song"
        show={deleting}
        setShow={setDeleting}
        onDelete={onDelete}
      />
    </div>
  )
}

export { Song }
