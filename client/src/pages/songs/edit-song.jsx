import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from "react-router-dom"
import { Page } from '../page'
import { SongForm } from './form'

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

const EditSong = () => {
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
    fetchSong(id)
      .then(song => setSong(song))
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
      action={`/songs/${song.id}`}
      method='PUT'
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
