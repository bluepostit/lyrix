import React, { useState } from 'react'
import { useHistory } from "react-router-dom"
import { ItemListPage } from '../item-list-page'
import { Icon } from '../../components/icons'
import { ArtistModal } from './modal'
import { ListDataset } from '../../components/data'

// A single artist list item
const renderArtist = (artist) => {
  return (
    <div className="d-flex w-100 justify-content-between">
      <div>
        <Icon entity="artist" />
        <span>{artist.name}</span>
      </div>
      <div>
        <span className="badge badge-pill badge-info">
          {artist.songCount}
        </span>
      </div>
    </div>
  )
}

const Artists = () => {
  const history = useHistory()
  const [modalArtist, setModalArtist] = useState({ name: '' })
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({ data: [], actions: {} })

  const onLoadingComplete = (data) => {
    setData(data)
  }

  const onArtistClick = (artist) => {
    history.push(`/artists/${artist.id}`)
  }

  const onNewClick = () => {
    setShowModal(true)
  }

  const onSuccessfulCreate = () => {
    // Need to reload items!
    setLoading(true)
  }

  return (
    <>
      <ListDataset
        url="/artists"
        loading={loading}
        setLoading={setLoading}
        onLoadingComplete={onLoadingComplete}
      />
      <ItemListPage title="Artists"
        items={data.data}
        actions={data.actions}
        loading={loading}
        onNewClick={onNewClick}
        onItemClick={onArtistClick}
        renderItem={renderArtist}
      />
      <ArtistModal
        artist={modalArtist}
        setArtist={setModalArtist}
        role="create"
        title="Add an Artist"
        show={showModal}
        setShow={setShowModal}
        onSuccess={onSuccessfulCreate}
      />
    </>
  )
}

export { Artists }
