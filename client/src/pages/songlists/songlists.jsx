import React from 'react'
import { ItemListPage } from '../item-list-page'

const renderSonglist = (songlist) => {
  return (
    <div className="d-flex w-100 justify-content-between">
      <div>
        <i className="fas fa-clipboard-list"></i>
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

const onSonglistClick = (songlist, history) => {
  history.push(`/songlists/${songlist.id}`)
}

const onNewClick = (history) => {
  history.push('/songlists/new')
}

const Songlists = (props) => {
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
