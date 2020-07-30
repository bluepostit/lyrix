import React from 'react'
import { useHistory } from "react-router-dom"
import { ItemListPage } from '../item-list-page'
import { Icon } from '../../components/icons'

const renderSong = (song) => {
  return (
    <div className="d-flex w-100 justify-content-between">
      <div>
        <Icon entity="song" />
        <span>{song.title}</span> <em><small>&ndash; {song.artist.name}</small></em>
      </div>
      <div>
        {/* <span className="badge badge-pill badge-info">
        </span> */}
      </div>
    </div>
  )
}

const Songs = (props) => {
  const history = useHistory()
  let title = props.title || "Songs"

  const onSongClick = (song) => {
    history.push(`/songs/${song.id}`)
  }

  const onNewClick = () => {
    history.push('/songs/new')
  }

  return (
    <ItemListPage title={title}
      getItems='/songs'
      onNewClick={onNewClick}
      onItemClick={onSongClick}
      renderItem={renderSong}
    />
  )
}

export { Songs }
