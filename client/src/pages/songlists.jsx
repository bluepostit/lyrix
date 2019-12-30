import React, { useEffect, useState } from 'react'
import { useHistory } from "react-router-dom"
import { MEDIA_CLASS_SMALL, MEDIA_CLASS_LARGE } from '../common'

const getSongLists = () => {
  // console.log('GET SONG LISTS')
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
    <li key={songList.id}>
      {songList.title} ({songList.songs.length} songs)
    </li>
  )
}

const SongListComponent = (props) => {
  return (
    <ul>
      { props.songLists.map((songList, index) =>
        <SongListItem key={index} songList={songList} />
      )}
    </ul>
  )
}

const SmallScreenContent = (props) => {
  return (
    <div className={MEDIA_CLASS_SMALL}>
      <h1>Your Song Lists</h1>
      <SongListComponent songLists={props.songLists} />
    </div>
  )
}

const BigScreenContent = (props) => {
  return (
    <div className={MEDIA_CLASS_LARGE}>
      <div className="container banner-vcenter d-flex flex-column justify-content-center">
        <div className="text-center">
          <h1>Your Song Lists</h1>
          <SongListComponent songLists={props.songLists} />
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