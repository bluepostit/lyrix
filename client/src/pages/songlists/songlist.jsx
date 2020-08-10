import React, { useState } from 'react'
import { useHistory, useParams } from "react-router-dom"
import { ItemListPage } from '../item-list-page'
import { SonglistSong } from '../../components/list-items'
import useUser from '../../data/users'
import DataSource from '../../data/data-source'
import { Deleter } from '../../components/modals'

const Songlist = ({ data }) => {
  const { id } = useParams()
  const history = useHistory()
  const [showDeleter, setShowDeleter] = useState(false)
  const { user, isLoading: userIsLoading } = useUser()

  if (!userIsLoading && !user.authenticated) {
    history.replace('/login')
  }

  const onSongClick = (song) => {
    history.push(`/songlists/${id}/songs/${song.id}`)
  }

  const onNewClick = () => {
    history.push('/songs/new')
  }

  const onDeleteClick = () => {
    setShowDeleter(true)
  }

  const onDelete = () => {
    history.push('/songlists')
  }

  const hasDelete = data.actions && data.actions.delete

  const actions = [{
    name: 'new',
    value: onNewClick
  }, {
    name: 'delete',
    value: hasDelete ? onDeleteClick : null
  }]

  const songlist = data.songlist
  const title = songlist ? songlist.title : ''
  const items = songlist ? songlist.songs : []

  return (
    <ItemListPage
      title={title}
      actions={actions}
      items={items}
      onItemClick={onSongClick}
      renderItem={SonglistSong}
      renderItemMultiLine={true}>
        <Deleter
          entity={songlist}
          noun="songlist"
          show={showDeleter}
          setShow={setShowDeleter}
          onDelete={onDelete} />
      </ItemListPage>
  )
}

export { Songlist }
