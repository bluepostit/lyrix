import React, { useState } from 'react'
import { useHistory } from "react-router-dom"
import { ItemListPage } from '../item-list-page'
import { Icon } from '../../components/icons'
import { ArtistModal } from '../../components/modals'

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
  const [showModal, setShowModal] = useState(false)
  const [modalArtist, setModalArtist] = useState({ name: '' })
  const [error, setError] = useState('')

  const onArtistClick = (artist) => {
    history.push(`/artists/${artist.id}`)
  }

  const onNewClick = () => {
    setShowModal(true)
  }

  const onSuccessfulCreate = () => {
    // Need to reload items!
  }

  return (
    <>
      <ItemListPage title="Artists"
        getItems='/artists'
        onNewClick={onNewClick}
        onItemClick={onArtistClick}
        renderItem={renderArtist}
      />
      <ArtistModal
        artist={modalArtist}
        setArtist={setModalArtist}
        action="/artists"
        method="POST"
        title="Add an Artist"
        show={showModal}
        setShow={setShowModal}
        error={error}
        setError={setError}
        onSuccess={onSuccessfulCreate}
      />
    </>
  )
}

export { Artists }
