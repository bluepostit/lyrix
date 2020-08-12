import React from 'react'
import {
  Button, Form, ToggleButton, ToggleButtonGroup
} from 'react-bootstrap'
import { Icon } from './icons'
import { FormError } from './forms'

const SongResultsForm = ({
  handleSubmit,
  handleResultClick,
  error,
  songs,
  title,
  action
}) => {
  const onSubmit = (event) => {
    if (handleSubmit) {
      handleSubmit(event)
    }
  }
  const onResultClick = (event, song) => {
    if (handleResultClick) {
      event.preventDefault()
      handleResultClick(song)
    }
  }
  let footer = <></>
  if (handleSubmit) {
    footer = (
      <div className="d-flex justify-content-end">
        <Button variant="primary" type="submit"
          hidden={songs.length < 1}>
          {action}
        </Button>
      </div>
    )
  }

  return (
    <Form onSubmit={onSubmit}
      className="mt-2"
      id="song-importer-import-form">
      <FormError error={error} />
      <Form.Group controlId="query" hidden={songs.length < 1}>
        <Form.Label>{title}</Form.Label>
        <ToggleButtonGroup type="radio" name="sid" vertical
          className="song-importer-results-buttons lyrix-list">
          { songs.map((song, index) =>
            <ToggleButton value={song.id} key={index}
              variant="outline" className="lyrix-list-item"
              onClick={(e) => onResultClick(e, song)}>
              <div className="d-flex w-100 justify-content-between">
                <div>
                  <Icon entity="song" />
                  <span>{song.title}</span>
                  <em><small>
                    &ndash; {song.artist.name || song.artist}
                  </small></em>
                </div>
                <div>
                </div>
              </div>
            </ToggleButton>
            ) }
        </ToggleButtonGroup>
      </Form.Group>
      {footer}
    </Form>
  )
}

export default SongResultsForm
