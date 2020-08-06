import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from "react-router-dom"
import { Page } from '../page'
import { SongItemForm } from './form'
import { SongItemPageTitle } from '../../components/headers'

const fetchSong = async (id) => {
  let url = `/api/songs/${id}`
  return fetch(url)
    .then(response => response.json())
    .then((json) => {
      if (json.error) {
        throw json
      }
      return json.data
    })
}

const NewSongItem = ({ loader }) => {
  const title = 'Add a Song Item'
  const history = useHistory()
  const [song, setSong] = useState({
    id: '',
    artist: {
      id: ''
    }
  })
  const [songItem, setSongItem] = useState({
    id: '',
    title: '',
    text: '',
    song: song,
    songItemType: { id: '', name: '' }
  })
  const { songId } = useParams()

  useEffect(() => {
    loader.start('Loading...')
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
      .finally(() => {
        loader.stop()
      })
  }, [history, songId, songItem.song]) // things to monitor for render

  const onSongClick = () => {
    history.push(`/songs/${song.id}`)
  }

  const onArtistClick = () => {
    history.push(`/artists/${song.artist.id}`)
  }

  const onCreateSuccess = () => {
    history.push('/song-items')
  }

  const navActions = [
    {
      name: 'artist',
      title: song.artist.name,
      value: onArtistClick
    }, {
      name: 'song',
      title: song.title,
      value: onSongClick
    }
  ]

  const content =
    <SongItemForm
      song={song}
      songItem={songItem}
      setSongItem={setSongItem}
      action={'/api/song-items'}
      method='POST'
      loader={loader}
      onSuccess={onCreateSuccess} />

  return (
    <div className="song-item-page">
      <Page
        content={content}
        navActions={navActions}
        title={<SongItemPageTitle song={song} title={title} />}
      />
    </div>
  )
}

export { NewSongItem }
