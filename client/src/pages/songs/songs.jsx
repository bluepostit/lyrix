import React, { useState } from 'react'
import { useHistory } from "react-router-dom"
import { ListDataset } from '../../components/data'
import { ItemListPage } from '../item-list-page'
import { Song } from '../../components/list-items'

const Songs = ({ loader }) => {
  const history = useHistory()
  const [data, setData] = useState({ data: [], actions: {} })

  let title = "Songs"

  const renderSong = (song) => {
    return <Song song={song} />
  }

  const onSongClick = (song) => {
    history.push(`/songs/${song.id}`)
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
        url="/api/songs"
        loader={loader}
        onLoadingComplete={onLoadingComplete}
      />
      <ItemListPage title={title}
        items={data.data}
        actions={data.actions}
        loading={loader.loading}
        navActions={navActions}
        onItemClick={onSongClick}
        renderItem={renderSong}
      />
    </>
  )
}

export { Songs }
