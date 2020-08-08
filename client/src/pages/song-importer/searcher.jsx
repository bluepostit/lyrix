import React, { useState } from 'react'
import { Button, Form } from "react-bootstrap"
import { FormError } from '../../components/forms'
const debug = require('debug')('lyrix:song-importer')

const getFormData = (form) => {
  const data = new URLSearchParams(new FormData(form))
  return data.toString()
}

const Searcher = ({ handleSearch, searchError }) => {
  const [query, setQuery] = useState('')

  const handleChange = (event) => {
    const value = event.currentTarget.value
    setQuery(value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const query = getFormData(event.currentTarget)
    handleSearch(query)
  }

  const error = (searchError) ? <FormError className="x" error={searchError} /> : <></>
  debug(searchError)
  debug(error)
  return (
    <div className="container">
      {error}
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
