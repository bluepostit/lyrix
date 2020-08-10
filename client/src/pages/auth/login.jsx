import React, { useState } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { FormError } from '../../components/forms'
import { Page } from '../page'

const Login = () => {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [canSubmit, setCanSubmit] = useState(true)
  const [error, setError] = useState('')

  const history = useHistory()
  const location = useLocation()

  const getFormData = () => {
    const data = new URLSearchParams()
    data.append('username', userName)
    data.append('password', password)
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
          let { from } = location.state || { from: { pathname: "/" } };
          history.replace(from);
        }
      })
  }

  return (
    <Page title="Lyrix">
      <div className="container page-content text-page">
        <h3>Login</h3>
        <form action="/api/user/login" method="post" onSubmit={onSubmit}>
          <FormError error={error} />
          <div className="form-group">
            <label htmlFor="username">User name</label>
            <input type="text" id="username" name="username"
              className="form-control" value={userName}
              onChange={(e) => setUserName(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password"
              className="form-control" value={password}
              onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={!canSubmit}>Login</button>
        </form>
        <div>
          No account? <Link to="/sign-up">Sign Up</Link>
        </div>
      </div>
    </Page>
  )
}

export { Login }
