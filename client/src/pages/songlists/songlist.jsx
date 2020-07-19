import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from "react-router-dom"
import { Page } from '../page'

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
  const { id } = useParams()
  const history = useHistory()
  const onClick = () => {
    history.push(`/songlists/${id}/songs/${song.id}`)
  }

  return (
    <button className="list-group-item lyrix-list-item multi-line"
            onClick={onClick} >
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
      <Page
        content={<SongsListComponent songs={songlist.songs} />}
        title={songlist.title}
      />
    </div>
  )
}

export { Songlist }
