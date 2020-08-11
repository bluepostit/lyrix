import React from 'react'
import { Navbar } from '../components'
import { useHistory } from 'react-router-dom'
import useUser from '../data/users'

const addAuthAction = (user, isLoading, error, actions,
    logoutAction, loginAction) => {

  if (isLoading || error) {
    return
  }
  if (actions.length > 0) {
    (actions[actions.length - 1]).hasDivider = true
  }
  let action

  if (user.authenticated) {
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

  const logoutAction = async () => {
    await fetch('/api/user/logout')
    history.push('/login')
  }

  const loginAction = () => {
    history.push('/login')
  }

  const { user, isLoading, error } = useUser()
  addAuthAction(user, isLoading, error, actions, logoutAction, loginAction)

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
