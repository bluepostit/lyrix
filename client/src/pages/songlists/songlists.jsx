import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { ListDataset } from '../../components/data'
import { ItemListPage } from '../item-list-page'
import { Icon } from '../../components/icons'

const renderSonglist = (songlist) => {
  return (
    <div className="d-flex w-100 justify-content-between">
      <div>
        <Icon entity="songlist" />
        <span>{songlist.title}</span>
      </div>
      <div>
        <span className="badge badge-pill badge-info">
          {songlist.songs.length}
        </span>
      </div>
    </div>
  )
}

const Songlists = () => {
  const history = useHistory()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({ actions: {} })

  const onSonglistClick = (songlist) => {
    history.push(`/songlists/${songlist.id}`)
  }

  const onNewClick = () => {
    history.push('/songlists/new')
  }

  const onLoadingComplete = (data) => {
    setData(data)
  }

  return (
    <>
      <ListDataset
        url="/songlists"
        loading={loading}
        setLoading={setLoading}
        onLoadingComplete={onLoadingComplete}
      />
      <ItemListPage
        title="My Songlists"
        items={data}
        actions={data.actions}
        loading={loading}
        onNewClick={onNewClick}
        onItemClick={onSonglistClick}
        renderItem={renderSonglist}
     />
    </>
  )
}

export { Songlists }
