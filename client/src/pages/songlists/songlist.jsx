import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from "react-router-dom"
import { ItemListPage } from '../item-list-page'

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

const Songlist = () => {
  const { id } = useParams()
  const [songlist, setSonglist] = useState({ title: null, songs: [] })
  const history = useHistory()

  useEffect(() => {
    getSongList(id)
      .then(songlist => setSonglist(songlist))
      .catch((e) => {
        console.log('Something went wrong!')
        console.log(e)
      })
  }, [history, id, songlist.songs.length, songlist.title]) // things to monitor for render
    // See https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects

  const getSongs = async () => {
    return songlist.songs
  }

  const onSongClick = (song) => {
    history.push(`/songlists/${songlist.id}/songs/${song.id}`)
  }

  const onNewClick = () => {
    history.push('/songs/new')
  }

  const renderSong = (song, index) => {
    return (
      <div className="d-flex w-100 align-items-center">
        <div className="numbered-disc-bullet">{index + 1}</div>
        <div className="content-multi-lines">
          <div>{song.title}</div>
          <div className="content-secondary">{song.artist.name}</div>
        </div>
      </div>
    )
  }

  return (
    <ItemListPage title={songlist.title}
      getItems={getSongs}
      onNewClick={onNewClick}
      onItemClick={onSongClick}
      renderItem={renderSong}
      renderItemMultiLine={true}
    />
  )
}

export { Songlist }
