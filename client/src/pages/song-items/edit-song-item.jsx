import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from "react-router-dom"
import { Page } from '../page'
import { SongItemForm } from './form'
import { SongItemPageTitle } from '../../components/headers'

const fetchSongItem = async (id) => {
  let url = `/api/song-items/${id}`
  return fetch(url)
    .then(response => response.json())
    .then((json) => {
      if (json.error) {
        throw json
      }
      return json.data
    })
}

const EditSongItem = ({ loader }) => {
  const title = 'Editing Song Item'
  const history = useHistory()
  const [songItem, setSongItem] = useState({
    id: '',
    title: '',
    songItemType: { id: '', name: '' },
    song: { id: '' }
  })

  const { id } = useParams()

  useEffect(() => {
    loader.start('Loading...')
    fetchSongItem(id)
      .then(songItem => setSongItem(songItem))
      .catch((e) => {
        console.log('Something went wrong!')
        console.log(e)
        history.push('/login')
      })
      .finally(() => {
        loader.stop()
      })
  }, [history, id]) // things to monitor for render


  const onUpdateSuccess = () => {
    history.push(`/song-items/${id}`)
  }

  const titleEl = <SongItemPageTitle song={songItem.song} title={title} />

  return (
    <Page title={titleEl}>
      <div className="pt-1">
        <SongItemForm
          song={songItem.song}
          songItem={songItem}
          setSongItem={setSongItem}
          action={`/api/song-items/${songItem.id}`}
          method='PUT'
          loader={loader}
          onSuccess={onUpdateSuccess} />
      </div>
    </Page>
  )
}

export { EditSongItem }
