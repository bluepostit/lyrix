import React from 'react'
import { useHistory } from 'react-router-dom'
import { ItemListPage } from '../item-list-page'
import { Icon } from '../../components/icons'

const renderSonglist = (songlist) => {
  return (
    <div className="d-flex w-100 justify-content-between">
      <div>
        <Icon entity="songlist" />
        <span>{songlist.title}</span>
      </div>
      <div>
        <span className="badge badge-pill badge-info">
          {songlist.songs.length}
        </span>
      </div>
    </div>
  )
}

const Songlists = () => {
  const history = useHistory()
  const onSonglistClick = (songlist) => {
    history.push(`/songlists/${songlist.id}`)
  }

  const onNewClick = () => {
    history.push('/songlists/new')
  }

  return (
    <ItemListPage title="My Songlists"
              getItems='/songlists'
              onNewClick={onNewClick}
              onItemClick={onSonglistClick}
              renderItem={renderSonglist}
    />
  )
}

export { Songlists }
