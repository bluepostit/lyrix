import React from 'react'
import { Icon } from './icons'

const Artist = (artist) => {
  return (
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
  )
}

const Song = ({ song }) => {
  let artistName = song.artist.name || song.artist
  return (
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
  )
}

const SongItem = ({ songItem }) => {
  let lines = [ songItem.title, '']
  if (songItem.song && songItem.song.title) {
    lines[1] = lines[0]
    lines[0] = songItem.song.title
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
          {songItem.songItemType.name}
        </span>
      </div>
    </div>
  )
}

const Songlist = (songlist) => {
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

const SonglistSong = (song, index) => {
  return (
    <div className="d-flex w-100 align-items-center">
      <div className="numbered-disc-bullet">{index + 1}</div>
      <div className="content-multi-lines">
        <div>{song.title}</div>
        <div className="content-secondary">{song.artist.name}</div>
      </div>
    </div>
  )
}

export { Artist, Song, SongItem, Songlist, SonglistSong }
