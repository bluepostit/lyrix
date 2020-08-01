import React, { useEffect, useState } from 'react'
import { useHistory, useLocation, useParams } from "react-router-dom"
import { Page } from '../page'
import { ToTopButton, SongItemsButton } from '../../components'

const getSong = (songId, songlistId, artistId) => {
  let url = `/songs/${songId}`
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
      return json.data
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
  const [song, setSong] = useState({title: null, text: null})
  const [nextLink, setNextLink] = useState()
  const history = useHistory()
  const location = useLocation()

  useEffect(() => {
    getSong(songId, songlistId, artistId)
      .then((song) => {
        setSong(song)
        if (song.nextSongId) {
          setNextLink(location.pathname.replace(/songs\/\d+/, `songs/${song.nextSongId}`))
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

  const peeker = <SongItemsButton song={song} {...props} />

  return (
    <div className="song-page">
      <Page
        content={<PageContent song={song} />}
        title={song.title}
        nextLink={nextLink}
        peeker={peeker}
      />
    </div>
  )
}

export { Song }
