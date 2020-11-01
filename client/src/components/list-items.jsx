import React from 'react'
import { Icon } from './icons'
import { ListGroupItem } from 'react-bootstrap'

const Artist = (artist, index, onClick) => {
  return (
    <button key={index}
        className="list-group-item lyrix-list-item"
        onClick={(e) => onClick(artist)}>
      <div className="d-flex w-100 justify-content-between">
        <div>
          <Icon entity="artist" />
          <span>{artist.name}</span>
        </div>
        <div>
          <span className="badge badge-pill badge-info">
            {artist.songCount}
          </span>
        </div>
      </div>
    </button>
  )
}

const Song = (song, index, onClick) => {
  let artistName = song.artist.name || song.artist
  return (
    <button key={index}
        className="list-group-item lyrix-list-item"
        onClick={(e) => onClick(song)}>
      <div className="d-flex w-100 justify-content-between">
        <div>
          <Icon entity="song" />
          <span>{song.title}</span> <em><small>&ndash; {artistName}</small></em>
        </div>
        <div>
          {/* <span className="badge badge-pill badge-info">
          </span> */}
        </div>
      </div>
    </button>
  )
}

const SongItem = ({songItem, index, onClick}) => {
  let lines = [ songItem.title, '']
  if (songItem.song && songItem.song.title) {
    lines[1] = lines[0]
    lines[0] = songItem.song.title
  }

  return (
    <ListGroupItem action key={index}
        onClick={(e) => onClick(songItem)}>
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
            {songItem.songItemType.name}
          </span>
        </div>
      </div>
    </ListGroupItem>
  )
}

const Songlist = (songlist, index, onClick) => {
  return (
    <button key={index}
        className="list-group-item lyrix-list-item"
        onClick={(e) => onClick(songlist)}>
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
    </button>
  )
}

const SonglistSong = (songItem, index, onClick, onDeleteClick, draggableProps = {}) => {
  return (
    <div key={index}
        className="list-group-item lyrix-list-item multi-line d-flex w-100 align-items-center">
      <div
        className="list-group-item item-button"
        onClick={(e) => onClick(songItem)}>

        <div {...draggableProps} className="numbered-disc-bullet">{index + 1}</div>
        <div className="content-multi-lines">
          <div>{songItem.song.title}</div>
          <div className="content-secondary">{songItem.song.artist.name}</div>
        </div>
      </div>
      <div className="action-button ml-auto p-2"
          onClick={ e => onDeleteClick(songItem) }>
        <Icon entity="delete" />
      </div>
    </div>
  )
}

export { Artist, Song, SongItem, Songlist, SonglistSong }
