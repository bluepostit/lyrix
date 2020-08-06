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

const Artists = ({ loader }) => {
  const history = useHistory()
  const [datasetShouldLoad, setDatasetShouldLoad] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [data, setData] = useState({ data: [], actions: {} })

  const onLoadingComplete = (data) => {
    setData(data)
    setDatasetShouldLoad(false)
  }

  const onArtistClick = (artist) => {
    history.push(`/artists/${artist.id}`)
  }

  const onNewClick = () => {
    setShowModal(true)
  }

  const navActions = [{
    name: 'new',
    value: data.actions.create ? onNewClick : null
  }]

  const onModalDismiss = () => {
    setShowModal(false)
  }

  const onSuccessfulCreate = () => {
    // Need to reload items!
    setDatasetShouldLoad(true)
  }

  return (
    <>
      <ListDataset
        url="/api/artists"
        loader={loader}
        shouldLoad={datasetShouldLoad}
        onLoadingComplete={onLoadingComplete}
      />
      <ItemListPage title="Artists"
        items={data.data}
        actions={data.actions}
        loader={loader}
        navActions={navActions}
        onItemClick={onArtistClick}
        renderItem={renderArtist}
      />
      <ArtistModal
        role="create"
        title="Add an Artist"
        show={showModal}
        onSuccess={onSuccessfulCreate}
        onDismiss={onModalDismiss}
      />
    </>
  )
}

export { Artists }
