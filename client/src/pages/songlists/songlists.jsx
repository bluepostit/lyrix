import React from 'react'
import { useHistory } from 'react-router-dom'
import { ItemListPage } from '../item-list-page'
import { Songlist } from '../../components/list-items'
import useUser from '../../data/users'

const Songlists = ({ data }) => {
  const history = useHistory()
  const { user, isLoading: userIsLoading } = useUser()

  if (!userIsLoading && !user.authenticated) {
    history.replace('/login')
  }

  const onSonglistClick = (songlist) => {
    history.push(`/songlists/${songlist.id}`)
  }

  const onNewClick = () => {
    history.push('/songlists/new')
  }

  const actions = [{
    name: 'new',
    value: onNewClick
  }]

  return (
    <ItemListPage
      title="My Songlists"
      items={data.songlists}
      actions={actions}
      onItemClick={onSonglistClick}
      renderItem={Songlist}
    />
  )
}

export { Songlists }
