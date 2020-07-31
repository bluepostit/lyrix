import React from 'react'
import { useHistory } from 'react-router-dom'
import { ItemListPage } from '../item-list-page'
import { Icon } from '../../components/icons'

const renderSongItem = (songItem) => {
  return (
    <div className="d-flex w-100 justify-content-between">
      <div className="d-flex">
        <Icon entity="song-item" className="mt-3" />
        <div className="d-flex flex-column content-multi-lines align-items-start">
          <span>{songItem.song.title}</span>
          <div className="content-secondary">
            {songItem.title}
          </div>
        </div>
      </div>
      <div>
        <span className="badge badge-pill badge-info">
          {songItem.songItemType.name}
        </span>
      </div>
    </div>
  )
}

const SongItems = () => {
  const history = useHistory()
  const onSongItemClick = (songItem) => {
    history.push(`/song-items/${songItem.id}`)
  }

  const onNewClick = () => {
    history.push('/song-items/new')
  }

  return (
    <ItemListPage title="My song items"
              getItems='/song-items'
              onNewClick={onNewClick}
              onItemClick={onSongItemClick}
              renderItem={renderSongItem}
    />
  )
}

export { SongItems }
