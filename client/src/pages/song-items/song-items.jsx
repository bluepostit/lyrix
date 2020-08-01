import React from 'react'
import { useHistory } from 'react-router-dom'
import { ItemListPage } from '../item-list-page'
import { SongItem } from '../../components/list-items'

const SongItems = () => {
  const history = useHistory()
  const onSongItemClick = (songItem) => {
    history.push(`/song-items/${songItem.id}`)
  }

  const renderSongItem = (songItem) => {
    return <SongItem songItem={songItem} />
  }

  return (
    <ItemListPage title="My song items"
              getItems='/song-items'
              onItemClick={onSongItemClick}
              renderItem={renderSongItem}
    />
  )
}

export { SongItems }
