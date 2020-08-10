import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from "react-router-dom"
import DataSource from '../../data/data-source'
import useUser from '../../data/users'
import { Page } from '../page'
import { SongItemForm } from './form'
import { SongItemPageTitle } from '../../components/headers'
const debug = require('debug')('lyrix:song-items')

const EditSongItem = ({ songItemTypesData }) => {
  const title = 'Editing Song Item'
  const history = useHistory()
  const { id } = useParams()
  const songItemTypes = songItemTypesData.songItemTypes
  const [songItem, setSongItem] = useState()
  const { user, isLoading: userIsLoading } = useUser()

  if (!userIsLoading && !user.authenticated) {
    history.replace('/login')
  }

  const onSongItemLoad = () => {
    const songItem = DataSource.get('songItem')
    debug('setting songItem: %o', songItem.songItem)
    setSongItem(songItem.songItem)
  }

  const onSuccess = () => {
    history.push(`/song-items/${id}`)
  }

  useEffect(() => {
    DataSource.addListener('operate', onSuccess)
    DataSource.addListener('change', onSongItemLoad)
    return () => {
      DataSource.removeListener('operate', onSuccess)
      DataSource.removeListener('change', onSongItemLoad)
    }
  })

  let titleEl
  if (songItem && songItem.song) {
    titleEl = <SongItemPageTitle song={songItem.song} title={title} />
  }

  return (
    <Page title={titleEl || title}>
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
