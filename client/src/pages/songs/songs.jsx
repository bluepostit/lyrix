import React from 'react'
import { useHistory } from "react-router-dom"
import { ItemListPage } from '../item-list-page'
import { Song } from '../../components/list-items'
import { useSongs } from '../../data/songs'
import { EmptyPage, LoadingPage } from '../'

const Songs = () => {
  const history = useHistory()
  const { songs, actions, error, isLoading } = useSongs()

  if (isLoading)
    return <LoadingPage />
  if (error)
    return <EmptyPage message={error.toString()} />

  const onSongClick = (song) => {
    history.push(`/songs/${song.id}`)
  }

  const onNewClick = () => {
    history.push('/songs/new')
  }

  let title = "Songs"
  const navActions = [{
    name: 'new',
    value: (actions && actions.create) ? onNewClick : null
  }]

  return (
    <ItemListPage title={title}
      items={songs}
      actions={navActions}
      onItemClick={onSongClick}
      renderItem={Song}
    />
  )
}

export { Songs }
