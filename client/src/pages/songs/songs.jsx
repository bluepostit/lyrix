import React, { useState } from 'react'
import { useHistory } from "react-router-dom"
import { ListDataset } from '../../components/data'
import { ItemListPage } from '../item-list-page'
import { Song } from '../../components/list-items'

const Songs = (props) => {
  const history = useHistory()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({ data: [], actions: {} })

  let title = props.title || "Songs"

  const renderSong = (song) => {
    return <Song song={song} />
  }

  const onSongClick = (song) => {
    history.push(`/songs/${song.id}`)
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
        url="/api/songs"
        loading={loading}
        setLoading={setLoading}
        onLoadingComplete={onLoadingComplete}
      />
      <ItemListPage title={title}
        items={data.data}
        actions={data.actions}
        loading={loading}
        onNewClick={onNewClick}
        onItemClick={onSongClick}
        renderItem={renderSong}
      />
    </>
  )
}

export { Songs }
