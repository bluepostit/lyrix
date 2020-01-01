import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from "react-router-dom"
import { MobileHeader } from '../components'
import { MEDIA_CLASS_SMALL, MEDIA_CLASS_LARGE } from '../common'

const getSongList = (songlistId) => {
  // console.log('GET SONG LISTS')
  return fetch(`/songlists/${songlistId}`)
    .then(response => response.json())
    .then((json) => {
      if (json.error) {
        throw json
      }
      return json.data
    })
}

const SongListItem = (props) => {
  const song = props.song
  return (
    <button key={song.id} className="list-group-item lyrix-list-item">
      <div>
        <i className="fas fa-clipboard-list"></i>
        <span>{song.title}</span>
      </div>
      <div>

      </div>
    </button>
  )
}

const SongListComponent = (props) => {
  return (
    <div className="list-group lyrix-list">
      { props.songs.map((song, index) =>
        <SongListItem key={index} song={song} />
      )}
    </div>
  )
}

const SmallScreenContent = (props) => {
  return (
    <div className={MEDIA_CLASS_SMALL}>
      <div className="list-page">
        <MobileHeader title={props.songlist.title} />
        <SongListComponent songs={props.songlist.songs} />
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
          <SongListComponent songs={props.songlist.songs} />
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