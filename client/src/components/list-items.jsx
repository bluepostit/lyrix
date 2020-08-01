import React from 'react'
import { Icon } from './icons'

const SongItem = (props) => {
  console.log(props)
  const item = props.songItem
  let songTitle = null
  if (item.song && item.song.title) {
    songTitle = item.song.title
  }

  return (
    <div className="d-flex w-100 justify-content-between">
      <div className="d-flex">
        <Icon entity="song-item" className="mt-3" />
        <div className="d-flex flex-column content-multi-lines align-items-start">
          <span>{songTitle}</span>
          <div className="content-secondary">
            {item.title}
          </div>
        </div>
      </div>
      <div>
        <span className="badge badge-pill badge-info">
          {item.songItemType.name}
        </span>
      </div>
    </div>
  )
}
export { SongItem }
