import React, { useState } from 'react'
import { useHistory, useParams } from "react-router-dom"
import { ListDataset } from '../../components/data'
import { ItemListPage } from '../item-list-page'
import { Icon } from '../../components/icons'
import { Deleter } from '../../components/modals'

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
  const [deleting, setDeleting] = useState(false)
  const [data, setData] = useState({
    data: {
      name: '',
      songs: []
    },
    actions: {}
  })
  const history = useHistory()

  const onNewClick = () => {
    history.push('/songs/new')
  }

  const onSongClick = (song) => {
    history.push(`/artists/${song.artist_id}/songs/${song.id}`)
  }

  const onDeleteClick = () => {
    setDeleting(true)
  }

  const onLoadingComplete = (data) => {
    setData(data)
  }

  const onDelete = () => {
    history.replace('/artists')
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
        title={data.data.name}
        items={data.data.songs}
        actions={data.actions}
        loading={loading}
        onNewClick={onNewClick}
        onDeleteClick={onDeleteClick}
        onItemClick={onSongClick}
        renderItem={renderSong}
      />
      <Deleter
        entity={data.data}
        noun="artist"
        show={deleting}
        setShow={setDeleting}
        onDelete={onDelete}
      />
    </>
  )}

export { Artist }
