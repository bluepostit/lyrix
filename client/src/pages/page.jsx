import React, { useEffect } from 'react'
import { Navbar } from '../components'
import { useHistory } from 'react-router-dom'

/**
 * Props:
 * - title - string to be used as the page's title
 * - children - string/JSX to be used as the page's content
 * - noNavbar - if true, render no navbar
 *
 * Also includes all props offered by Navbar.
 * @see Navbar
 * @param {object} props
 */
const Page = ({
  title,
  actions = [],
  noNavbar = false,
  children
}) => {
  const history = useHistory()
  const getIsLoggedIn = async () => {
    const res = await fetch('/api/user/status')
    const json = await res.json()
    const status = json.authenticated
    return status
  }

  const logoutAction = async () => {
    const res = await fetch('/api/user/logout')
    history.push('/login')
  }

  const loginAction = () => {
    history.push('/login')
  }

  const addAuthAction = async () => {
    const loggedIn = await getIsLoggedIn()
    if (actions.length > 0) {
      (actions[actions.length - 1]).hasDivider = true
    }
    let action

    if (loggedIn) {
      action = {
        name: 'logout',
        value: logoutAction
      }
    } else {
      action = {
        name: 'login',
        value: loginAction
      }
    }
    actions.push(action)
  }

  useEffect(() => {
    addAuthAction()
  })

  let header
  if (!noNavbar) {
    header = <Navbar actions={actions} title={title} />
  }
  return (
    <div className={"lyrix-page " + (noNavbar ? '' : 'has-navbar')}>
      {header}
      <div className="content-wrapper">
        {children}
      </div>
    </div>
  )
}

export { Page }
