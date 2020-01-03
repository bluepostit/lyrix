import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from "react-router-dom"
import { MobileHeader } from '../components'
import { MEDIA_CLASS_SMALL, MEDIA_CLASS_LARGE } from '../common'

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

const SongTextComponent = (props) => {
  return (
    <div class="song-text">
      {props.text}
    </div>
  )
}

const SmallScreenContent = (props) => {
  return (
    <div className={MEDIA_CLASS_SMALL}>
      <div className="list-page">
        <MobileHeader title={props.song.title} />
        <SongTextComponent text={props.song.text} />
      </div>
    </div>
  )
}

const BigScreenContent = (props) => {
  return (
    <div className={MEDIA_CLASS_LARGE}>
      <div className="container banner-vcenter d-flex flex-column justify-content-center">
        <div className="text-center">
          <h1>{props.song.title}</h1>
          <SongTextComponent text={props.song.text} />
        </div>
      </div>
    </div>
  )
}


const Song = (props) => {
  const { songlist_id, song_id } = useParams()
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
      <SmallScreenContent songlistId={songlist_id} song={song} />
      <BigScreenContent songlistId={songlist_id} song={song} />
    </div>
  )
}

export { Song }