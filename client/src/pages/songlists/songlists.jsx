import React, { useEffect, useState } from 'react'
import { useHistory } from "react-router-dom"
import { Page } from '../page'

const getSonglists = () => {
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

// A single song list, eg. 'Sat. Night Rock'
const SonglistItem = (props) => {
  const songlist = props.songlist
  const history = useHistory()
  const onClick = () => {
    history.push(`/songlists/${songlist.id}`)
  }

  return (
    <button key={songlist.id} className="list-group-item lyrix-list-item"
            onClick={onClick} >
      <div>
        <i className="fas fa-clipboard-list"></i>
        <span>{songlist.title}</span>
      </div>
      <div>
        <span className="badge badge-pill badge-info">
          {songlist.songs.length}
        </span>
      </div>
    </button>
  )
}

const ListHeader = (props) => {
  const history = useHistory()
  const onClick = () => {
    history.push('/songlists/new')
  }
  return (
    <span>
      {props.title}
      <button className="btn my-0 py-0 pr-0" onClick={onClick}>
        <i class="fa fa-plus color-primary"></i>
      </button>
    </span>
  )
}

// A list of Songlists, eg. 'Light Lounge', 'Sat. Night Rock'
const SonglistsList = (props) => {
  return (
    <div className="list-group lyrix-list">
      { props.songlists.map((songlist, index) =>
        <SonglistItem key={index} songlist={songlist} />
      )}
    </div>
  )
}

const Songlists = (props) => {
  const [songlists, setSonglists] = useState([])
  const history = useHistory()

  useEffect(() => {
    getSonglists()
      .then(lists => setSonglists(lists))
      .catch((e) => {
        console.log('Something went wrong!')
        console.log(e)
        history.push('/login')
      })
    }, [history, songlists.length]) // things to monitor for render
    // See https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects

  return (
    <div className="songlists-page">
      <Page
        content={<SonglistsList songlists={songlists} />}
        title={<ListHeader title="My Songlists" />}
      />
    </div>
  )
}

export { Songlists }