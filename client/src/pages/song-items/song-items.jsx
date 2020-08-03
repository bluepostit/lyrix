import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { ListDataset } from '../../components/data'
import { ItemListPage } from '../item-list-page'
import { SongItem } from '../../components/list-items'

const SongItems = ({
  title = 'My Song Items'
}) => {
  const history = useHistory()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({ actions: {} })

  const onSongItemClick = (songItem) => {
    history.push(`/song-items/${songItem.id}`)
  }

  const renderSongItem = (songItem) => {
    return <SongItem songItem={songItem} />
  }

  const onLoadingComplete = (data) => {
    setData(data)
  }

  return (
    <>
      <ListDataset
        url="/song-items"
        loading={loading}
        setLoading={setLoading}
        onLoadingComplete={onLoadingComplete}
      />
      <ItemListPage
        title={title}
        items={data}
        actions={data.actions}
        loading={loading}
        onItemClick={onSongItemClick}
        renderItem={renderSongItem}
      />
    </>
  )
}

export { SongItems }
