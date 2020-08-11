import React from 'react'
import { useHistory } from 'react-router-dom'
import { ItemListPage } from '../item-list-page'
import { Songlist } from '../../components/list-items'
import { useSonglists } from '../../data/songlists'
import useUser from '../../data/users'
import { EmptyPage, LoadingPage } from '../'

const Songlists = () => {
  const history = useHistory()
  const { user, isLoading: userIsLoading } = useUser()
  const { songlists, isLoading, error } = useSonglists()

  if (!userIsLoading && !user.authenticated) {
    history.replace('/login')
  }

  if (isLoading || userIsLoading) {
    return <LoadingPage />
  }

  if (error) {
    return <EmptyPage messag={error.toString()} />
  }

  const onSonglistClick = (songlist) => {
    history.push(`/songlists/${songlist.id}`)
  }

  const onNewClick = () => {
    history.push('/songlists/new')
  }

  const pageActions = [{
    name: 'new',
    value: onNewClick
  }]

  return (
    <ItemListPage
      title="My Songlists"
      items={songlists}
      actions={pageActions}
      onItemClick={onSonglistClick}
      renderItem={Songlist}
    />
  )
}

export { Songlists }
