import React from 'react'
import { useHistory } from "react-router-dom"
import { Page } from '../page'
import { SonglistForm } from './form'

const NewSonglist = () => {
  const title = 'Add a Songlist'
  const history = useHistory()

  const onCreationSuccess = () => {
    history.push('/practice')
  }

  return (
    <Page title={title}>
      <div className="pt-1">
        <SonglistForm onCreate={onCreationSuccess} />
      </div>
    </Page>
  )
}

export { NewSonglist }
