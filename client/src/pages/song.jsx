import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from "react-router-dom"
import { Page } from './page'
import { ToTopButton } from '../components'

const getSong = (songId) => {
  return fetch(`/songs/${songId}`)
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
    <div>
      <div className="song-text">
        <div>{props.song.text}</div>
      </div>
      <ToTopButton />
    </div>
  )
}

const Song = (props) => {
  const { song_id } = useParams()
  const [song, setSong] = useState({title: null, text: null})
  const history = useHistory()

  useEffect(() => {
    getSong(song_id)
      .then(song => setSong(song))
      .catch((e) => {
        console.log('Something went wrong!')
        console.log(e)
        history.push('/login')
      })
    }, [history, song_id, song.text, song.title]) // things to monitor for render
    // See https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects

  return (
    <div className="song-page">
      <Page
        content={<PageContent song={song} />}
        title={song.title}
      />
    </div>
  )
}

export { Song }