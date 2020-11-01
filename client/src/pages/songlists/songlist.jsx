import React, { useState } from 'react'
import { useHistory, useParams } from "react-router-dom"
import { ItemListPage } from '../item-list-page'
import { SonglistSong } from '../../components/list-items'
import useUser from '../../data/users'
import { useSonglist } from '../../data/songlists'
import { Deleter } from '../../components/modals'
import LoadingPage from '../loading-page'
import { EmptyPage } from '../empty-page'

const buildOrderData = (songlist) => {
  return songlist.items.map(item => {
    return {
      id: item.id,
      position: item.position
    }
  })
}

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

  if (isLoading || userIsLoading) {
    return <LoadingPage />
  }

  if (error) {
    return <EmptyPage message={error.toString()} />
  }

  const orderData = buildOrderData(songlist)

  const onSongItemClick = (songItem) => {
    console.log('clicked the song - time to go!')
    history.push(`/songlists/${id}/songs/${songItem.song.id}`)
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

  const submitNewOrder = async (destIdx, sourceIdx) => {
    const draggedItems = orderData.splice(sourceIdx, 1)
    orderData.splice(destIdx, 0, draggedItems[0])
    // reorder them
    const newOrderData = orderData.map((item, index) => {
      item.position = index + 1
      return item
    })

    const res = await fetch(`/api/songlists/${id}/order`, {
      method: 'POST',
      body: JSON.stringify(newOrderData),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const json = await res.json()
    if (json.error) {
      console.log(json.error)
    } else {
      console.log('ordering successful')
    }
  }

  const onDragEnd = (event) => {
    const { destination, source } = event

    if (!destination) {
      return
    }
    if (destination.droppableId === source.droppableId
        && destination.index === source.index) {
      return
    }

    submitNewOrder(destination.index, source.index)
      .then(() => {
        mutateSonglist()
      })
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
  const items = songlist ? songlist.items : []

  let itemDeleter = <></>
  if (deletingItem) {
    console.log(deletingItem)
    itemDeleter = <Deleter
      entity={{ id: deletingItem.id }}
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
      onItemClick={onSongItemClick}
      onItemDeleteClick={(item) => onItemDeleteClick(item)}
      renderItem={SonglistSong}
      renderItemMultiLine={true}
      onDragEnd={onDragEnd}
    >
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
