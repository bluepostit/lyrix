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

const Songlists = ({ loader }) => {
  const history = useHistory()
  const [data, setData] = useState({ data: [], actions: {} })

  const onSonglistClick = (songlist) => {
    history.push(`/songlists/${songlist.id}`)
  }

  const onNewClick = () => {
    history.push('/songlists/new')
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
        url="/api/songlists"
        loader={loader}
        onLoadingComplete={onLoadingComplete}
      />
      <ItemListPage
        title="My Songlists"
        items={data.data}
        actions={data.actions}
        loading={loader.loading}
        navActions={navActions}
        onItemClick={onSonglistClick}
        renderItem={renderSonglist}
     />
    </>
  )
}

export { Songlists }
