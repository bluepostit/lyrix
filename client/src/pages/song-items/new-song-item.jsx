import React from 'react'
import { useHistory } from "react-router-dom"
import { Page } from '../page'
import { SongItemForm } from './form'

const NewSongItem = () => {
  const title = 'Add a Song Item'
  const history = useHistory()

  const onCreationSuccess = () => {
    history.push('/song-items')
  }

  return (
    <div className="songlist-page">
      <Page
        content={<SongItemForm onCreate={onCreationSuccess} />}
        title={title}
      />
    </div>
  )
}

export { NewSongItem }
