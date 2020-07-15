import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'

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

const Artist = () => {
  const { artist_id } = useParams()
  const [artist, setArtist] = useState({name: null, songs: null})
  const history = useHistory()

  useEffect(() => {
    getArtist(artist_id)
      .then(artist => setArtist(artist))
      .catch((e) => {
        console.log('Something went wrong!')
        console.log(e)
      })
  }, [history, artist_id, artist.name])  // things to monitor for render
  // See https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects


  return (
    <div className="artist-page">
      <h1>{artist.name}</h1>
    </div>
  )
}

export { Artist }
