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
    <div className="song-page-contents">
      <div className="song-text">
        <div>{props.song.text}</div>
      </div>
      <ToTopButton />
    </div>
  )
}

const Song = (props) => {
  const { artistId, songlistId, songId } = useParams()
  const [data, setData] = useState({
    data: {
      title: null,
      text: null
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

  useEffect(() => {
    getSongData(songId, songlistId, artistId)
      .then((data) => {
        setData(data)
        if (data.data.nextSongId) {
          setNextLink(location.pathname.replace(/songs\/\d+/, `songs/${data.data.nextSongId}`))
        } else {
          setNextLink(null)
        }
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
        nextLink={nextLink}
        onEditClick={goToEdit}
        onDeleteClick={handleDeleteClick}
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
