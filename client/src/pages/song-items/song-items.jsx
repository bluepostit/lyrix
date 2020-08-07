import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { ListDataset } from '../../components/data'
import { ItemListPage } from '../item-list-page'
import { SongItem } from '../../components/list-items'

const SongItems = ({
  title = 'My Song Items',
  loader
}) => {
  const history = useHistory()
  const [data, setData] = useState({ data: [], actions: {} })

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
        url="/api/song-items"
        loader={loader}
        onLoadingComplete={onLoadingComplete}
      />
      <ItemListPage
        title={title}
        items={data.data}
        loading={loader.loading}
        onItemClick={onSongItemClick}
        renderItem={renderSongItem}
      />
    </>
  )
}

export { SongItems }
