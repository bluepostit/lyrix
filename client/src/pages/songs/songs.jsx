import React from 'react'
import { ItemListPage } from '../item-list-page'

const getSongs = () => {
  return fetch('/songs')
    .then(response => response.json())
    .then((json) => {
      if (json.error) {
        throw json
      }
      return json.data
    })
}

const renderSong = (song) => {
  return (
    <div className="d-flex w-100 justify-content-between">
      <div>
        <i className="fas fa-clipboard-list"></i>
        <span>{song.title}</span>
      </div>
      <div>
        {/* <span className="badge badge-pill badge-info">
        </span> */}
      </div>
    </div>
  )
}

const onSongClick = (song, history) => {
  history.push(`/songs/${song.id}`)
}

const onNewClick = (history) => {
  history.push('/songs/new')
}

const Songs = (props) => {
  let title = props.title || "Songs"

  return (
    <ItemListPage title={title}
      getItems={getSongs}
      onNewClick={onNewClick}
      onItemClick={onSongClick}
      renderItem={renderSong}
    />
  )
}

export { Songs }
