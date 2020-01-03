import React, { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

const SignUpError = (props) => {
  console.log('sign up error now')
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

const SignUp = (props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [canSubmit, setCanSubmit] = useState(true)
  const [error, setError] = useState('')

  const history = useHistory()
  const location = useLocation()

  const getFormData = () => {
    const data = new URLSearchParams()
    data.append('email', email)
    data.append('password', password)
    data.append('password2', password2)
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
        <h1>Sign Up</h1>
        <form action="/user/sign-up" method="post" onSubmit={onSubmit}>
          <SignUpError error={error} />
          <div className="form-group">
            <label htmlFor="email">User name</label>
            <input type="text" id="email" name="email"
                   className="form-control" value={email}
                   placeholder="your.name@email.com"
                   onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password"
                   className="form-control" value={password}
                   placeholder="******"
                   onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="password2">Repeat Password</label>
            <input type="password" id="password2" name="password2"
                   className="form-control" value={password2}
                   placeholder="******"
                   onChange={(e) => setPassword2(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary"
                  disabled={!canSubmit}>Sign Up</button>
        </form>
      </div>
    </div>
  )
}

export { SignUp }