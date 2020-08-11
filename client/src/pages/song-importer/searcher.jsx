import React, { useState } from 'react'
import { Button, Form } from "react-bootstrap"
import { useSongSearch } from '../../data/song-importer'
// const debug = require('debug')('lyrix:song-importer')

const Searcher = ({ onSearch }) => {
  const [query, setQuery] = useState('')
  const { mutate: mutateSearch } = useSongSearch(query, false)

  const handleChange = (event) => {
    const value = event.currentTarget.value
    setQuery(value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!query) {
      return
    }
    mutateSearch()
    // DataSource.search('importerSearch', null, query)
    onSearch(query)
  }

  return (
    <div className="container">
      <Form onSubmit={handleSubmit}
        className="mt-2"
        id="song-importer-search-form">
          <Form.Group controlId="query">
            <Form.Label>Search for a Song</Form.Label>
            <Form.Control
              type="text"
              placeholder="Type your search text here"
              name="q"
              value={query}
              onChange={handleChange}
            />
          </Form.Group>
        <div className="d-flex justify-content-end">
          <Button variant="primary" type="submit">
            Search
          </Button>
        </div>
        </Form>
    </div>
  )
}

export { Searcher }
