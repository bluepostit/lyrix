import React, { useState } from 'react'
import { useHistory } from "react-router-dom"
import { ItemListPage } from '../item-list-page'
import { Artist } from '../../components/list-items'
import { ArtistModal } from './modal'

const Artists = ({ data }) => {
  const history = useHistory()
  const [showModal, setShowModal] = useState(false)

  const onArtistClick = (artist) => {
    history.push(`/artists/${artist.id}`)
  }

  const onNewClick = () => {
    setShowModal(true)
  }

  const actions = [{
    name: 'new',
    value: (data.actions && data.actions.create) ? onNewClick : null
  }]

  const onModalDismiss = () => {
    setShowModal(false)
  }

  const onSuccessfulCreate = () => {
    // Need to reload items!
    // setDatasetShouldLoad(true)
  }

  return (
    <ItemListPage
      title="Artists"
      items={data.artists}
      actions={actions}
      onItemClick={onArtistClick}
      renderItem={Artist}>
      <ArtistModal
        role="create"
        title="Add an Artist"
        show={showModal}
        onSuccess={onSuccessfulCreate}
        onDismiss={onModalDismiss}
      />
    </ItemListPage>
  )
}

export { Artists }
