import React, { useState } from 'react'
import { useHistory } from "react-router-dom"
import { Page } from '../page'
import { SongForm } from './form'

const NewSong = ({ loader }) => {
  const title = 'Add a Song'
  const history = useHistory()
  const [song, setSong] = useState({
    id: '',
    title: '',
    text: '',
    artist: { id: '', name: '' }
  })

  const onCreateSuccess = () => {
    history.push('/songs')
  }

  return (
    <Page title={title}>
      <div className="pt-1 song-page">
        <SongForm
          song={song}
          setSong={setSong}
          action={'/api/songs'}
          method='POST'
          loader={loader}
          onSuccess={onCreateSuccess} />
      </div>
    </Page>
  )
}

export { NewSong }
