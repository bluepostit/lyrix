import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from "react-router-dom"
import { ItemListPage } from '../item-list-page'
import { Icon } from '../../components/icons'

const getArtist = async (artistId) => {
  return fetch(`/artists/${artistId}`)
    .then(response => response.json())
    .then((json) => {
      if (json.error) {
        throw json.error
      } else {
        return json.data
      }
    })
}

const renderSong = (song) => {
  return (
    <div className="d-flex w-100 justify-content-between">
      <div>
        <Icon entity="song" />
        <span>{song.title}</span>
      </div>
    </div>
  )
}

const Artist = () => {
  const { artistId } = useParams()
  const [artist, setArtist] = useState({name: null, songs: []})
  const history = useHistory()

  useEffect(() => {
    async function fetchArtist () {
      try {
        let artist = await getArtist(artistId)
        setArtist(artist)
      } catch(e) {
        console.log('Something went wrong!')
        console.log(e)
      }
    }
    fetchArtist()
  }, [history, artistId, artist.name, artist.songs.length])  // things to monitor for render
  // See https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects

  const getSongs = async () => {
    return artist.songs
  }

  const onNewClick = () => {
    history.push('/songs/new')
  }

  const onSongClick = (song) => {
    history.push(`/artists/${song.artist_id}/songs/${song.id}`)
  }

  return (
    <ItemListPage title={artist.name}
      getItems={getSongs}
      onNewClick={onNewClick}
      onItemClick={onSongClick}
      renderItem={renderSong}
    />
  )}

export { Artist }
