import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from "react-router-dom"
import { Page } from '../page'
import { SonglistForm } from './form'

const NewSonglist = () => {
  const title = 'Add a Songlist'
  const history = useHistory()

  const onCreationSuccess = () => {
    history.push('/practice')
  }

  return (
    <div className="songlist-page">
      <Page
        content={<SonglistForm onCreate={onCreationSuccess} />}
        title={title}
      />
    </div>
  )
}

export { NewSonglist }