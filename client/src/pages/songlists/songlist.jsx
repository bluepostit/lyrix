import React, { useState } from 'react'
import { useHistory, useParams } from "react-router-dom"
import { ListDataset } from '../../components/data'
import { ItemListPage } from '../item-list-page'

const renderSong = (song, index) => {
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

const Songlist = () => {
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({
    title: '',
    songs: [],
    actions: []
  })
  const history = useHistory()

  const onSongClick = (song) => {
    history.push(`/songlists/${id}/songs/${song.id}`)
  }

  const onNewClick = () => {
    history.push('/songs/new')
  }

  const onLoadingComplete = (data) => {
    setData(data)
  }

  return (
    <>
      <ListDataset
        url={`/songlists/${id}`}
        loading={loading}
        setLoading={setLoading}
        onLoadingComplete={onLoadingComplete}
      />
      <ItemListPage
        title={data.title}
        items={data.songs}
        actions={data.actions}
        loading={loading}
        onNewClick={onNewClick}
        onItemClick={onSongClick}
        renderItem={renderSong}
        renderItemMultiLine={true}
      />
    </>
  )
}

export { Songlist }
