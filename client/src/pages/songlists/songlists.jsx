import React from 'react'
import { ItemList } from '../item-list'

const getSonglists = () => {
  return fetch('/songlists')
    .then(response => response.json())
    .then((json) => {
      if (json.error) {
        throw json
      }
      return json.data
    })
}

const renderSonglist = (songlist) => {
  return (
    <div class="d-flex w-100 justify-content-between">
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
    <ItemList title="My Songlists"
              getItems={getSonglists}
              onNewClick={onNewClick}
              onItemClick={onSonglistClick}
              renderItem={renderSonglist}
    />
  )
}

export { Songlists }
