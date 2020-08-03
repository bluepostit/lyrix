import React, { useState } from 'react'
import { useHistory, useParams } from "react-router-dom"
import { ListDataset } from '../../components/data'
import { ItemListPage } from '../item-list-page'
import { Icon } from '../../components/icons'

const renderSong = (song) => {
  return (
    <div className="d-flex w-100 justify-content-between">
      <div>
        <Icon entity="song" />
        <span>{song.title}</span>
      </div>
    </div>
  )
}

const Artist = () => {
  const { artistId } = useParams()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({
    songs: [],
    actions: {}
  })
  const history = useHistory()

  const onNewClick = () => {
    history.push('/songs/new')
  }

  const onSongClick = (song) => {
    history.push(`/artists/${song.artist_id}/songs/${song.id}`)
  }

  const onLoadingComplete = (data) => {
    setData(data)
  }

  return (
    <>
      <ListDataset
        url={`/artists/${artistId}`}
        loading={loading}
        setLoading={setLoading}
        onLoadingComplete={onLoadingComplete}
      />
      <ItemListPage
        title={data.name}
        items={data.songs}
        actions={data.actions}
        loading={loading}
        onNewClick={onNewClick}
        onItemClick={onSongClick}
        renderItem={renderSong}
      />
    </>
  )}

export { Artist }
