import React, { useState } from 'react'
import { useHistory } from "react-router-dom"
import { ItemListPage } from '../item-list-page'
import { Artist } from '../../components/list-items'
import { ArtistModal } from './modal'
import { useArtists } from '../../data/artists'
import LoadingPage from '../loading-page'
import { EmptyPage } from '../empty-page'


const Artists = () => {
  const history = useHistory()
  const [showModal, setShowModal] = useState(false)
  const { artists, isLoading, actions, error, mutate: mutateArtists }
    = useArtists()

  if (isLoading) {
    return <LoadingPage />
  }

  if (error) {
    return <EmptyPage message={error.toString()} />
  }

  const onArtistClick = (artist) => {
    history.push(`/artists/${artist.id}`)
  }

  const onNewClick = () => {
    setShowModal(true)
  }

  const pageActions = [{
    name: 'new',
    value: (actions && actions.create) ? onNewClick : null
  }]

  const onModalDismiss = () => {
    setShowModal(false)
  }

  const onSuccessfulCreate = () => {
    // Need to reload items!
    mutateArtists()
  }

  return (
    <ItemListPage
      title="Artists"
      items={artists}
      actions={pageActions}
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
