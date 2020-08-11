import React, { useState } from 'react'
import { useHistory, useParams } from "react-router-dom"
import { ItemListPage } from '../item-list-page'
import { SonglistSong } from '../../components/list-items'
import useUser from '../../data/users'
import { useSonglist } from '../../data/songlists'
import { Deleter } from '../../components/modals'
import LoadingPage from '../loading-page'
import { EmptyPage } from '../empty-page'

const Songlist = () => {
  const { id } = useParams()
  const history = useHistory()
  const [deletingItem, setDeletingItem] = useState()
  const [showDeleter, setShowDeleter] = useState(false)
  const [showItemDeleter, setShowItemDeleter] = useState(false)
  const { user, isLoading: userIsLoading } = useUser()
  const { songlist, isLoading, error, actions,
    mutate: mutateSonglist } = useSonglist(id)

  if (user && !user.authenticated) {
    history.replace('/login')
  }

  if (isLoading) {
    return <LoadingPage />
  }

  if (error) {
    return <EmptyPage message={error.toString()} />
  }

  const onSongClick = (song) => {
    console.log('clicked the song - time to go!')
    history.push(`/songlists/${id}/songs/${song.id}`)
  }

  const onNewClick = () => {
    history.push('/songs/new')
  }

  const onDeleteClick = () => {
    setShowDeleter(true)
  }

  const onItemDeleteClick = (songItem) => {
    setDeletingItem(songItem)
    setShowItemDeleter(true)
  }

  const onDelete = () => {
    history.push('/songlists')
  }

  const onItemDelete = () => {
    mutateSonglist()
  }

  const hasDelete = actions && actions.delete
  const pageActions = [{
    name: 'new',
    value: onNewClick
  }, {
    name: 'delete',
    value: hasDelete ? onDeleteClick : null
  }]

  const title = songlist ? songlist.title : ''
  const items = songlist ? songlist.songs : []

  let itemDeleter = <></>
  if (deletingItem) {
    itemDeleter = <Deleter
      entity={{ id: deletingItem.songListSongId }}
      noun="songlist-song"
      show={showItemDeleter}
      setShow={setShowItemDeleter}
      onDelete={onItemDelete} />
  }

  return (
    <ItemListPage
      title={title}
      actions={pageActions}
      items={items}
      onItemClick={onSongClick}
      onItemDeleteClick={(item) => onItemDeleteClick(item)}
      renderItem={SonglistSong}
      renderItemMultiLine={true}>
      <Deleter
        entity={songlist}
        noun="songlist"
        show={showDeleter}
        setShow={setShowDeleter}
        onDelete={onDelete} />
      {itemDeleter}
      </ItemListPage>
  )
}

export { Songlist }
