import React, { useState } from 'react'
import { FormError } from '../../components/forms'

const SonglistForm = (props) => {
  const [canSubmit, setCanSubmit] = useState(true)
  const [error, setError] = useState('')
  const [title, setTitle] = useState('')

  const getFormData = () => {
    const data = new URLSearchParams()
    data.append('title', title)
    return data
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const data = getFormData()

    setCanSubmit(false)
    setError('')

    fetch(e.target.action, {
      method: 'POST',
      body: data
    })
      .then(response => response.json())
      .then((response) => {
        setCanSubmit(true)
        console.log(response)
        if (response.error) {
          setError(response.error)
        } else {
          props.onCreate(response)
        }
      })
  }

  return (
    <div className="container">
      <div className="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
        <form action="/api/songlists" method="post" onSubmit={onSubmit}>
          <FormError error={error} />
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input type="text" id="title" name="title"
                   className="form-control" value={title}
                   onChange={(e) => setTitle(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={!canSubmit}>Create</button>
        </form>
      </div>
    </div>
  )
}

export { SonglistForm }
