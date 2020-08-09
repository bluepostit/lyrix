import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from "react-router-dom"
import DataSource from '../../data/data-source'
import { Page } from '../page'
import { SongItemForm } from './form'

const EditSongItem = ({ songItemTypesData }) => {
  const title = 'Editing Song Item'
  const history = useHistory()
  const { id } = useParams()
  const songItemTypes = songItemTypesData.songItemTypes

  const onSuccess = () => {
    history.push(`/song-items/${id}`)
  }

  useEffect(() => {
    DataSource.addListener('operate', onSuccess)
    return () => {
      DataSource.removeListener('operate', onSuccess)
    }
  })

  // const titleEl = <SongItemPageTitle song={songItem.song} title={title} />

  return (
    <Page title={title}>
      <div className="pt-1">
        <SongItemForm
          role="edit"
          songItemTypes={songItemTypes}
          songItemId={id}
        />
      </div>
    </Page>
  )
}

export { EditSongItem }
