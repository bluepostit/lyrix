import React, { useEffect } from 'react'
import { useHistory } from "react-router-dom"
import { Page } from '../page'
import { SonglistForm } from './form'
import DataSource from '../../data/data-source'

const NewSonglist = () => {
  const title = 'Add a Songlist'
  const history = useHistory()

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
