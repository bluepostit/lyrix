import React, { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

const LoginError = (props) => {
  if (props.error) {
    return (
      <div className="alert alert-danger" role="alert">
        {props.error}
      </div>
    )
  } else {
    return ''
  }
}

const Login = (props) => {
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

    // setCanSubmit(false)
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
          setError(response.message)
        } else {
          let { from } = location.state || { from: { pathname: "/" } };
          history.replace(from);
        }
      })
  }

  return (
    <div className="container">
      <div className="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
        <h1>Login</h1>
        <form action="/user/login" method="post" onSubmit={onSubmit}>
          <LoginError error={error} />
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
      </div>
    </div>
  )
}

export { Login }