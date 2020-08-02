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

  const { songId } = useParams()

  useEffect(() => {
    fetchSong(songId)
      .then(song => setSong(song))
      .catch((e) => {
        console.log('Something went wrong!')
        console.log(e)
        history.push('/login')
      })
  }, [history, songId]) // things to monitor for render


  const onCreationSuccess = () => {
    history.push('/song-items')
  }

  return (
    <div className="song-item-page">
      <Page
        content={<SongItemForm song={song} onSuccess={onCreationSuccess} />}
        title={<SongItemPageTitle song={song} title={title} />}
      />
    </div>
  )
}

export { NewSongItem }
