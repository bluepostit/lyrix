import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from "react-router-dom"
import { Page } from '../page'
import { SongForm } from './form'

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

const EditSong = ({ loader }) => {
  const title = 'Editing Song'
  const history = useHistory()
  const [song, setSong] = useState({
    id: '',
    title: '',
    text: '',
    artist: {
      id: '',
      name: ''
    },
  })

  const { id } = useParams()

  useEffect(() => {
    loader.start('Loading song...')
    fetchSong(id)
      .then((song) => {
        setSong(song)
        loader.stop()
      })
      .catch((e) => {
        console.log('Something went wrong!')
        console.log(e)
        history.push('/login')
      })
  }, [history, id]) // things to monitor for render


  const onUpdateSuccess = () => {
    history.push(`/songs/${id}`)
  }

  const content =
    <SongForm
      song={song}
      setSong={setSong}
      action={`/api/songs/${song.id}`}
      method='PUT'
      loader={loader}
      onSuccess={onUpdateSuccess} />

  return (
    <div className="song-page">
      <Page
        content={content}
        title="Edit Song"
      />
    </div>
  )
}

export { EditSong }
