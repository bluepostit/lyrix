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
      return json.song
    })
}

const EditSong = ({ loader }) => {
  const title = 'Edit Song'
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

  return (
    <Page title={title}>
      <div className="pt-1 song-page">
        <SongForm
          song={song}
          setSong={setSong}
          action={`/api/songs/${song.id}`}
          method='PUT'
          loader={loader}
          onSuccess={onUpdateSuccess} />
      </div>
    </Page>
  )
}

export { EditSong }
