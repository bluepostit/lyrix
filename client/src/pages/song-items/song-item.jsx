import React, { useEffect, useState } from 'react'
import { useHistory, useParams, Link } from "react-router-dom"
import { Page } from '../page'
import { ToTopButton } from '../../components'
import { Icon } from '../../components/icons'

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

const PageContent = (props) => {
  return (
    <div>
      <div className="song-text">
        <div>{props.songItem.text}</div>
      </div>
      <ToTopButton />
    </div>
  )
}

const Title = (props) => {
  const song = props.songItem.song
  return (
    <div className="title">
      <div>
        <Icon entity="song-item" />
        <strong className="ml-2">{props.songItem.title}</strong>
      </div>
      <Link to={`/songs/${song.id}`}>
        <span className="content-secondary">{song.title}</span>
      </Link>
    </div>
  )
}

const SongItem = () => {
  const { id } = useParams()
  const [songItem, setSongItem] = useState({ title: null, text: null, song: { title: null } })
  const history = useHistory()

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
        title={<Title songItem={songItem} />}
      />
    </div>
  )
}

export { SongItem }
