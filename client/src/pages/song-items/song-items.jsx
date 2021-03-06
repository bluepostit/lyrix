import React from 'react'
import { useHistory } from 'react-router-dom'
import { ItemListPage } from '../item-list-page'
import { SongItem } from '../../components/list-items'
import { useSongItems } from '../../data/song-items'
import { EmptyPage, LoadingPage } from '../'
import useUser from '../../data/users'

const SongItems = () => {
  const history = useHistory()
  const title = 'Song Items'
  const { user, isLoading: userIsLoading } = useUser()
  const { songItems, error, isLoading } = useSongItems()

  if (userIsLoading || isLoading)
    return <LoadingPage />

  if (!userIsLoading && !user.authenticated) {
    history.replace('/login')
  }

  if (error)
    return <EmptyPage message={error.toString()} />


  const onSongItemClick = (songItem) => {
    history.push(`/song-items/${songItem.id}`)
  }

  return (
    <ItemListPage
      title={title}
      items={songItems}
      onItemClick={onSongItemClick}
      renderItem={(item, index, onClick) =>
        SongItem({songItem: item, index, onClick})}
    />
  )
}

export { SongItems }
