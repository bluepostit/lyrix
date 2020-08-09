import React, { useState, useEffect } from 'react'
import { FormError } from '../../components/forms'
import DataSource from '../../data/data-source'

const SonglistForm = () => {
  const [error, setError] = useState('')
  const [title, setTitle] = useState('')

  const getFormData = () => {
    const data = new URLSearchParams()
    data.append('title', title)
    return data
  }

  const handleChange = (e) => {
    setTitle(e.target.value)
    setError('')
  }

  const handleError = (error) => {
    setError(error)
  }

  useEffect(() => {
    DataSource.addListener('error', handleError)
    return () => {
      DataSource.removeListener('error', handleError)
    }
  })

  const onSubmit = (e) => {
    e.preventDefault()
    const data = getFormData()

    setError('')
    DataSource.create('songlist', null, data)
  }

  return (
    <div className="container">
      <div className="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
        <form onSubmit={onSubmit}>
          <FormError error={error} />
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input type="text" id="title" name="title"
                   className="form-control" value={title}
                   onChange={handleChange} />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={error}>
              Create
          </button>
        </form>
      </div>
    </div>
  )
}

export { SonglistForm }
