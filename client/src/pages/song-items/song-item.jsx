import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from "react-router-dom"
import { Page } from '../page'
import { ToTopButton } from '../../components'
import { SongItemPageTitle } from '../../components/headers'
import { ConfirmModal } from '../../components/modals'

const getSongItem = (songItemId) => {
  let url = `/song-items/${songItemId}`
  return fetch(url)
    .then(response => response.json())
    .then((json) => {
      if (json.error) {
        throw json
      }
      return json.data
    })
}

const PageContent = ({ songItem }) => {
  return (
    <div>
      <div className="song-text">
        <div className="song-item-text-box">
          {songItem.text}
        </div>
      </div>
      <ToTopButton />
    </div>
  )
}

const Deleter = ({
  songItem,
  show = false,
  setShow,
  onDelete
}) => {
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDelete = () => {
    console.log('time to delete the item!')
    setLoading(true)
    fetch(`/song-items/${songItem.id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then((data) => {
        setLoading(false)
        if (data.error) {
          setError(data.error)
        } else {
          setShow(false)
          onDelete()
        }
      })
  }

  return (
    <ConfirmModal
      content="Are you sure you want to delete this song item?"
      show={show}
      setShow={setShow}
      onConfirm={handleDelete}
      awaitingResponse={isLoading}
      error={error}
      setError={setError}
    />
  )
}

const SongItem = () => {
  const { id } = useParams()
  const [songItem, setSongItem] = useState({ title: null, text: null, song: { title: null } })
  const [deleting, setDeleting] = useState(false)
  const history = useHistory()

  const goToEdit = () => {
    history.push(`/song-items/${songItem.id}/edit`)
  }

  const handleDeleteClick = () => {
    setDeleting(true)
  }

  const onDelete = () => {
    history.replace('/song-items')
  }

  useEffect(() => {
    getSongItem(id)
      .then((songItem) => {
        setSongItem(songItem)
      })
      .catch((e) => {
        console.log('Something went wrong!')
        console.log(e)
      })
  }, [history, id]) // things to monitor for render
    // See https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects)

  return (
    <div className="song-item-page">
      <Page
        content={<PageContent songItem={songItem} />}
        title={<SongItemPageTitle songItem={songItem} />}
        onEditClick={goToEdit}
        onDeleteClick={handleDeleteClick}
      />
      <Deleter
        songItem={songItem}
        show={deleting}
        setShow={setDeleting}
        onDelete={onDelete}
      />
    </div>
  )
}

export { SongItem }
