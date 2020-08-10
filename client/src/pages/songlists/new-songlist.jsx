import React, { useEffect } from 'react'
import { useHistory } from "react-router-dom"
import { Page } from '../page'
import { SonglistForm } from './form'
import DataSource from '../../data/data-source'
import useUser from '../../data/users'

const NewSonglist = () => {
  const title = 'Add a Songlist'
  const history = useHistory()
  const { user, isLoading: userIsLoading } = useUser()

  if (!userIsLoading && !user.authenticated) {
    history.replace('/login')
  }

  const onSuccess = (entity) => {
    if (entity === 'songlist') {
      history.push('/songlists')
    }
  }

  useEffect(() => {
    DataSource.addListener('operate', onSuccess)
    return () => DataSource.removeListener('operate', onSuccess)
  })

  return (
    <Page title={title}>
      <div className="pt-1">
        <SonglistForm />
      </div>
    </Page>
  )
}

export { NewSonglist }
