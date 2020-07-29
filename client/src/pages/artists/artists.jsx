import React, { useEffect, useState } from 'react'
import { ItemListPage } from '../item-list-page'

// A single artist list item
const renderArtist = (artist) => {
  return (
    <div className="d-flex w-100 justify-content-between">
      <div>
        <i className="fas fa-user-circle"></i>
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

const onArtistClick = (artist, history) => {
  history.push(`/artists/${artist.id}`)
}

const onNewClick = (history) => {
  history.push('/artists/new')
}

const Artists = (props) => {
  return (
    <ItemListPage title="Artists"
              getItems='/artists'
              onNewClick={onNewClick}
              onItemClick={onArtistClick}
              renderItem={renderArtist}
    />
  )
}

export { Artists }
