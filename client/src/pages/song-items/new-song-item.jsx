import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from "react-router-dom"
import { Page } from '../page'
import { SongItemForm } from './form'
import { SongItemPageTitle } from '../../components/headers'

const fetchSong = async (id) => {
  let url = `/songs/${id}`
  return fetch(url)
    .then(response => response.json())
    .then((json) => {
      if (json.error) {
        throw json
      }
      return json.data
    })
}

const NewSongItem = () => {
  const title = 'Add a Song Item'
  const history = useHistory()
  const [song, setSong] = useState({id: ''})
  const [songItem, setSongItem] = useState({
    id: '',
    title: '',
    text: '',
    song: song,
    songItemType: { id: '', name: '' }
  })
  const { songId } = useParams()

  useEffect(() => {
    fetchSong(songId)
      .then((song) => {
        setSong(song)
        // songItem.song = song
      })
      .catch((e) => {
        console.log('Something went wrong!')
        console.log(e)
        history.push('/login')
      })
  }, [history, songId, songItem.song]) // things to monitor for render


  const onCreateSuccess = () => {
    history.push('/song-items')
  }

  const content =
    <SongItemForm
      song={song}
      songItem={songItem}
      setSongItem={setSongItem}
      action={'/song-items'}
      method='POST'
      onSuccess={onCreateSuccess} />

  return (
    <div className="song-item-page">
      <Page
        content={content}
        title={<SongItemPageTitle song={song} title={title} />}
      />
    </div>
  )
}

export { NewSongItem }