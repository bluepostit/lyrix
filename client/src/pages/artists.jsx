import React, { useEffect, useState } from 'react'
import { ItemList } from './item-list'

const getArtists = () => {
  // console.log('GET SONG LISTS')
  return fetch('/artists')
    .then(response => response.json())
    .then((json) => {
      if (json.error) {
        throw json
      }
      return json.data
    })
}

// A single artist list item
const renderArtist = (artist) => {
  return (
    <div class="d-flex w-100 justify-content-between">
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
    <ItemList title="Artists"
              getItems={getArtists}
              onNewClick={onNewClick}
              onItemClick={onArtistClick}
              renderItem={renderArtist}
    />
  )
}

export { Artists }
