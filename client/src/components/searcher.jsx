import React, { useState, useRef, useEffect } from 'react'
import { Button, Form } from "react-bootstrap"

const Searcher = ({ onSearch }) => {
  const [query, setQuery] = useState('')
  const searchInput = useRef(null)

  const handleChange = (event) => {
    const value = event.currentTarget.value
    setQuery(value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!query) {
      return
    }
    onSearch(query)
  }

  useEffect(() => searchInput.current.focus(), [])

  return (
    <div className="container">
      <Form onSubmit={handleSubmit}
        className="mt-2"
        id="song-search-form">
          <Form.Group controlId="query">
            <Form.Label>Search for a Song</Form.Label>
            <Form.Control
              type="text"
              placeholder="Type your search text here"
              name="q"
              value={query}
              onChange={handleChange}
              ref={searchInput}
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
