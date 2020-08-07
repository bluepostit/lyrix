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

const Artist = ({ loader }) => {
  const { artistId } = useParams()
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

  const navActions = [
    {
      name: 'new',
      value: data.actions.create ? onNewClick : null
    }, {
      name: 'delete',
      value: data.actions.delete ? onDeleteClick : null
    }
  ]

  return (
    <>
      <ListDataset
        url={`/api/artists/${artistId}`}
        loader={loader}
        onLoadingComplete={onLoadingComplete}
      />
      <ItemListPage
        title={data.data.name}
        items={data.data.songs}
        actions={navActions}
        loading={loader.loading}
        onItemClick={onSongClick}
        renderItem={renderSong}>
        <Deleter
          entity={data.data}
          noun="artist"
          show={deleting}
          setShow={setDeleting}
          onDelete={onDelete}
        />
      </ItemListPage>
    </>
  )}

export { Artist }
