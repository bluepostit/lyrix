import React, { useState } from 'react'
import { useHistory } from "react-router-dom"
import { ItemListPage } from '../item-list-page'
import { Icon } from '../../components/icons'

// A single artist list item
const renderArtist = (artist) => {
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

const Artists = () => {
  const history = useHistory()

  const onArtistClick = (artist) => {
    history.push(`/artists/${artist.id}`)
  }

  const onNewClick = () => {
    history.push('/artists/new')
  }

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
