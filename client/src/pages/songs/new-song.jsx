import React, { useEffect, useState } from 'react'
import { useHistory } from "react-router-dom"
import { Page } from '../page'
import { SongForm } from './form'

const NewSong = () => {
  const title = 'Add a Song'
  const history = useHistory()
  const [song, setSong] = useState({
    id: '',
    title: '',
    text: '',
    artist: { id: '', name: '' }
  })

  // useEffect(() => {
  //   fetchSong(songId)
  //     .then((song) => {
  //       setSong(song)
  //       // songItem.song = song
  //     })
  //     .catch((e) => {
  //       console.log('Something went wrong!')
  //       console.log(e)
  //       history.push('/login')
  //     })
  // }, [history, songId, songItem.song]) // things to monitor for render


  const onCreateSuccess = () => {
    history.push('/songs')
  }

  const content =
    <SongForm
      song={song}
      setSong={setSong}
      action={'/songs'}
      method='POST'
      onSuccess={onCreateSuccess} />

  return (
    <div className="song-page">
      <Page
        content={content}
        title={title}
      />
    </div>
  )
}

export { NewSong }
