import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from "react-router-dom"
import { MobileHeader } from '../components'
import { MEDIA_CLASS_SMALL, MEDIA_CLASS_LARGE } from '../common'

const getSongList = (songlistId) => {
  return fetch(`/songlists/${songlistId}`)
    .then(response => response.json())
    .then((json) => {
      if (json.error) {
        throw json
      }
      return json.data
    })
}

// A single song, eg. 'Toxic'
const SongItem = (props) => {
  const song = props.song
  const number = props.index + 1
  return (
    <button className="list-group-item lyrix-list-item multi-line">
      <div className="numbered-disc-bullet">{number}</div>
      <div className="content-multi-lines">
        <div>{song.title}</div>
        <div className="content-secondary">{song.artist.name}</div>
      </div>
    </button>
  )
}

// A list of songs, eg. 'Greensleeves', 'Toxic'
const SongsListComponent = (props) => {
  return (
    <div className="list-group lyrix-list">
      { props.songs.map((song, index) =>
        <SongItem key={index} song={song} index={index} />
      )}
    </div>
  )
}

const SmallScreenContent = (props) => {
  return (
    <div className={MEDIA_CLASS_SMALL}>
      <div className="list-page">
        <MobileHeader title={props.songlist.title} />
        <SongsListComponent songs={props.songlist.songs} />
      </div>
    </div>
  )
}

const BigScreenContent = (props) => {
  return (
    <div className={MEDIA_CLASS_LARGE}>
      <div className="container banner-vcenter d-flex flex-column justify-content-center">
        <div className="text-center">
          <h1>{props.songlist.title}</h1>
          <SongsListComponent songs={props.songlist.songs} />
        </div>
      </div>
    </div>
  )
}


const Songlist = (props) => {
  const { id } = useParams()
  const [songlist, setSonglist] = useState({title: null, songs: []})
  const history = useHistory()

  useEffect(() => {
    getSongList(id)
      .then(songlist => setSonglist(songlist))
      .catch((e) => {
        console.log('Something went wrong!')
        console.log(e)
        history.push('/login')
      })
    }, [history, id, songlist.songs.length, songlist.title]) // things to monitor for render
    // See https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects

  return (
    <div className="songlist-page">
      <SmallScreenContent songlist={songlist} />
      <BigScreenContent songlist={songlist} />
    </div>
  )
}

export { Songlist }