import React, { useEffect, useState } from 'react'
import { useHistory } from "react-router-dom"
import { MEDIA_CLASS_SMALL, MEDIA_CLASS_LARGE } from '../common'

const getSongLists = () => {
  console.log('GET SONG LISTS')
  return fetch('/songlists')
    .then(response => response.json())
    .then((json) => {
      if (json.error) {
        throw json
      }
      return json.data
    })
}

const SongListItem = (props) => {
  const songList = props.songList
  return (
    <div key={songList.id}>
      {songList.title} ({songList.songs.length})
    </div>
  )
}

const SmallScreenContent = (props) => {
  return (
    <div className={MEDIA_CLASS_SMALL}>
      <h1>Song Lists</h1>
      { props.songLists.map(songList =>
        <SongListItem songList={songList} />
      )}
    </div>
  )
}

const BigScreenContent = (props) => {
  return (
    <div className={MEDIA_CLASS_LARGE}>
      <div className="container banner-vcenter d-flex flex-column justify-content-center">
        <div className="text-center">
          <h1>Welcome to Lyrix!</h1>
          <p>Your lyrics managing companion</p>

        </div>
      </div>
    </div>
  )
}


const Songlists = (props) => {
  const [songLists, setSongLists] = useState([])

  useEffect(() => {
    getSongLists()
      .then(lists => setSongLists(lists))
      .catch((e) => {
        console.log('Something went wrong!')
        console.log(e)
      })
    })

  return (
    <div className="songlists-page">
      <SmallScreenContent songLists={songLists} />
      <BigScreenContent songLists={songLists} />
    </div>
  )
}

export { Songlists }