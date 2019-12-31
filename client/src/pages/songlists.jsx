import React, { useEffect, useState } from 'react'
import { useHistory } from "react-router-dom"
import { MobileHeader } from '../components'
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
    <button key={songList.id} className="list-group-item lyrix-list-item">
      <div>
        <i className="fas fa-clipboard-list"></i>
        <span>{songList.title}</span>
      </div>
      <div>
        <span className="badge badge-pill badge-info">
          {songList.songs.length}
        </span>
      </div>
    </button>
  )
}

const SongListComponent = (props) => {
  return (
    <div className="list-group lyrix-list">
      { props.songLists.map((songList, index) =>
        <SongListItem key={index} songList={songList} />
      )}
    </div>
  )
}

const SmallScreenContent = (props) => {
  return (
    <div className={MEDIA_CLASS_SMALL}>
      <div className="list-page">
        <MobileHeader title="My Songlists" />
        <SongListComponent songLists={props.songLists} />
      </div>
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
  const history = useHistory()

  useEffect(() => {
    getSongLists()
      .then(lists => setSongLists(lists))
      .catch((e) => {
        console.log('Something went wrong!')
        console.log(e)
        history.push('/login')
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