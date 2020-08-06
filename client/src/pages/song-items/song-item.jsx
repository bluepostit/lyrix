import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from "react-router-dom"
import { Page } from '../page'
import { ToTopButton } from '../../components'
import { SongItemPageTitle } from '../../components/headers'
import { Deleter } from '../../components/modals'

const getSongItem = (songItemId) => {
  let url = `/api/song-items/${songItemId}`
  return fetch(url)
    .then(response => response.json())
    .then((json) => {
      if (json.error) {
        throw json
      }
      return json
    })
}

const PageContent = ({ songItem }) => {
  return (
    <>
      <div className="song-item-text-display beneath-nav">
        <div className="song-item-text-box">
          {songItem.text}
        </div>
      </div>
      <ToTopButton />
    </>
  )
}

const SongItem = ({ loader }) => {
  const { id } = useParams()
  const [data, setData] = useState({
    title: null,
    text: null,
    data: {
      song: {
        title: '',
        artist: {
          name: ''
        }
      }
    },
    actions: {}
  })
  const [deleting, setDeleting] = useState(false)
  const history = useHistory()

  const goToEdit = () => {
    history.push(`/song-items/${data.data.id}/edit`)
  }

  const goToArtist = () => {
    history.push(`/artists/${data.data.song.artist.id}`)
  }

  const goToSong = () => {
    history.push(`/songs/${data.data.song.id}`)
  }

  const handleDeleteClick = () => {
    setDeleting(true)
  }

  const onDelete = () => {
    history.replace('/song-items')
  }

  const hasEdit = data.actions.edit
  const hasDelete = data.actions.delete

  const navActions = [{
    name: 'edit',
    value: hasEdit ? goToEdit : null,
    hasDivider: !hasDelete
  }, {
    name: 'delete',
    value: data.actions.delete ? handleDeleteClick : null,
    hasDivider: true
  }, {
    name: 'artist',
    title: data.data.song.artist.name,
    value: goToArtist
  }, {
    name: 'song',
    title: data.data.song.title,
    value: goToSong
  }]

  useEffect(() => {
    loader.start('Loading Song Item...')
    getSongItem(id)
      .then((data) => {
        setData(data)
      })
      .catch((e) => {
        console.log('Something went wrong!')
        console.log(e)
      })
      .finally(() => {
        loader.stop()
      })
  }, [history, id]) // things to monitor for render
    // See https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects)

  return (
    <div className="song-item-page">
      <Page
        content={<PageContent songItem={data.data} />}
        actions={data.actions}
        title={<SongItemPageTitle songItem={data.data} />}
        loader={loader}
        navActions={navActions}
      />
      <Deleter
        entity={data.data}
        noun="song-item"
        show={deleting}
        setShow={setDeleting}
        onDelete={onDelete}
      />
    </div>
  )
}

export { SongItem }
