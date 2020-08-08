import React from 'react'
import { useHistory } from 'react-router-dom'
import { ItemListPage } from '../item-list-page'
import { SongItem } from '../../components/list-items'

const SongItems = ({
  title = 'My Song Items',
  data
}) => {
  const history = useHistory()

  const onSongItemClick = (songItem) => {
    history.push(`/song-items/${songItem.id}`)
  }

  const renderSongItem = (songItem) => {
    return <SongItem songItem={songItem} />
  }

  return (
    <ItemListPage
      title={title}
      items={data.songItems}
      onItemClick={onSongItemClick}
      renderItem={renderSongItem}
    />
  )
}

export { SongItems }
