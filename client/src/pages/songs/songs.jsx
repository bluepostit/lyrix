import React from 'react'
import { useHistory } from "react-router-dom"
import { ItemListPage } from '../item-list-page'
import { Song } from '../../components/list-items'

const Songs = ({ data }) => {
  const history = useHistory()
  let title = "Songs"

  const renderSong = (song) => {
    return <Song song={song} />
  }

  const onSongClick = (song) => {
    history.push(`/songs/${song.id}`)
  }

  const onNewClick = () => {
    history.push('/songs/new')
  }

  const navActions = [{
    name: 'new',
    value: (data.actions && data.actions.create) ? onNewClick : null
  }]

  return (
    <ItemListPage title={title}
      items={data.data}
      actions={navActions}
      onItemClick={onSongClick}
      renderItem={renderSong}
    />
  )
}

export { Songs }
