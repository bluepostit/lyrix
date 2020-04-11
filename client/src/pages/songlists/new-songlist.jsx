import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from "react-router-dom"
import { FormError } from '../../components/forms'
import { MobileHeader } from '../../components'
import { MEDIA_CLASS_SMALL, MEDIA_CLASS_LARGE } from '../../common'
import { SonglistForm } from './form'

const SmallScreenContent = (props) => {
  return (
    <div className={MEDIA_CLASS_SMALL}>
      <div className="list-page">
        <MobileHeader title={props.title} />
        <SonglistForm onCreate={props.onCreationSuccess} />
      </div>
    </div>
  )
}

const BigScreenContent = (props) => {
  return (
    <div className={MEDIA_CLASS_LARGE}>
      <div className="container banner-vcenter d-flex flex-column justify-content-center">
        <div className="text-center">
          <h1>{props.title}</h1>
        </div>
      </div>
      To Be Implemented...
    </div>
  )
}

const NewSonglist = () => {
  const title = 'Add a Songlist'
  const history = useHistory()

  const onCreationSuccess = () => {
    history.push('/practice')
  }

  return (
    <div className="songlist-page">
      <SmallScreenContent title={title} onCreationSuccess={onCreationSuccess}/>
      <BigScreenContent title={title} />
    </div>
  )
}

export { NewSonglist }