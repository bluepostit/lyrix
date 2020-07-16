import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from "react-router-dom"
import { Page } from './page'
import { ToTopButton } from '../components'
import { getNextSongLink } from '../util'

const getSong = (songId) => {
  return fetch(`/songs/${songId}`)
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
        <div>{props.song.text}</div>
      </div>
      <ToTopButton />
    </div>
  )
}

const Song = (props) => {
  const { songlist_id, song_id } = useParams()
  const [song, setSong] = useState({title: null, text: null})
  const [nextLink, setNextLink] = useState()
  const history = useHistory()

  useEffect(() => {
    getSong(song_id)
      .then(song => setSong(song))
      .catch((e) => {
        console.log('Something went wrong!')
        console.log(e)
        history.push('/login')
      })
    }, [history, song_id, song.text, song.title]) // things to monitor for render
    // See https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects

  useEffect(() => {
    async function fetchNextSongLink() {
      try {
        let link = getNextSongLink(song, songlist_id)
        setNextLink(link)
      } catch (e) {
        console.log('Something went wrong!')
        console.log(e)
      }
    }
    fetchNextSongLink()
  }, [history, song, songlist_id, nextLink]) // things to monitor for render
  // See https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects

  return (
    <div className="song-page">
      <Page
        content={<PageContent song={song} />}
        title={song.title}
        nextLink={nextLink}
      />
    </div>
  )
}

export { Song }
