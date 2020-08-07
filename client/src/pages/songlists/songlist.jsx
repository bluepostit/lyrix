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

const Songlist = ({ loader }) => {
  const { id } = useParams()
  const [data, setData] = useState({
    data: {
      title: '',
      songs: []
    },
    actions: []
  })
  const history = useHistory()

  const onSongClick = (song) => {
    history.push(`/songlists/${id}/songs/${song.id}`)
  }

  const onNewClick = () => {
    history.push('/songs/new')
  }

  const navActions = [{
    name: 'new',
    value: onNewClick
  }]

  const onLoadingComplete = (data) => {
    setData(data)
  }

  return (
    <>
      <ListDataset
        url={`/api/songlists/${id}`}
        loader={loader}
        onLoadingComplete={onLoadingComplete}
      />
      <ItemListPage
        title={data.data.title}
        items={data.data.songs}
        actions={navActions}
        loading={loader.loading}
        onItemClick={onSongClick}
        renderItem={renderSong}
        renderItemMultiLine={true}
      />
    </>
  )
}

export { Songlist }
