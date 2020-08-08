import React from 'react'
import { useHistory, useParams } from "react-router-dom"
import { ItemListPage } from '../item-list-page'
import { SonglistSong } from '../../components/list-items'

const Songlist = ({ data }) => {
  const { id } = useParams()
  const history = useHistory()

  const onSongClick = (song) => {
    history.push(`/songlists/${id}/songs/${song.id}`)
  }

  const onNewClick = () => {
    history.push('/songs/new')
  }

  const actions = [{
    name: 'new',
    value: onNewClick
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
      renderItemMultiLine={true}
    />
  )
}

export { Songlist }
