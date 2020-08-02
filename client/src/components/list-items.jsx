import React from 'react'
import { Icon } from './icons'

const SongItem = (props) => {
  const item = props.songItem

  let lines = [ item.title, '']
  if (item.song && item.song.title) {
    lines[1] = lines[0]
    lines[0] = item.song.title
  }

  return (
    <div className="song-item-row">
      <div className="info">

        <div className="song-item-text content-multi-lines">
          <div>
            <Icon entity="songItem" className="mt-3" />
            <span>{lines[0]}</span>
          </div>
          <div className="content-secondary">
            {lines[1]}
          </div>
        </div>
      </div>
      <div className="badges">
        <span className="badge badge-pill badge-info">
          {item.songItemType.name}
        </span>
      </div>
    </div>
  )
}
export { SongItem }
