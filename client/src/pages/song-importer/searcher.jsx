import React, { useState } from 'react'
import { Button, Form } from "react-bootstrap"
import { FormError } from '../../components/forms'

const getFormData = (form) => {
  const data = new URLSearchParams(new FormData(form))
  return data.toString()
}

const Searcher = ({
  loading = false,
  setLoading,
  onSearchStart,
  onSearchComplete,
  action
}) => {
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')

  const handleChange = (event) => {
    event.preventDefault()
    setQuery(event.target.value)
  }

  const getSearchUrl = (form) => {
    const queryString = getFormData(form)
    const url = `${action}?${queryString}`
    return url
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    console.log('submit!')
    setError('')
    const url = getSearchUrl(event.currentTarget)
    onSearchStart()
    setLoading(true)
    fetch(url)
      .then(res => res.json())
      .then((json) => {
        onSearchComplete(json)
        setLoading(false)
        console.log(json)
        if (json.status !== 200) {
          setError(json.message)
        }
      })
  }

  return (
    <div className="container">
      <FormError error={error} />
      <Form onSubmit={handleSubmit}
        className="mt-2"
        id="song-importer-search-form"
        >
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
          <Button variant="primary" type="submit"
            disabled={loading}>
            Search
          </Button>
        </div>
        </Form>
    </div>
  )
}

export { Searcher }
